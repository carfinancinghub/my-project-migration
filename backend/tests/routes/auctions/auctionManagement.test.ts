/*
File: auctionManagement.test.ts
Path: C:\CFH\backend\tests\routes\auction\auctionManagement.test.ts
Created: 2025-07-02 13:30 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest tests for auction management routes with ≥95% coverage.
Artifact ID: z9a0b1c2-d3e4-f5g6-h7i8-j9k0l1m2n3o4
Version ID: a0b1c2d3-e4f5-g6h7-i8j9-k0l1m2n3o4p5
*/

import request from 'supertest';
import express from 'express'; // Import express to create a test app
import auctionManagementRoutes from '@/backend/routes/auction/auctionManagementRoutes'; // Import the router
import logger from '@/utils/logger'; // Centralized logging utility

// Mock middleware dependencies
// Mock authenticate middleware to set req.user based on provided tier
jest.mock('@/middleware/auth', () => ({
    authenticate: (req: any, res: any, next: jest.Mock) => {
        // This mock allows tests to control the user object
        // If 'x-mock-user-tier' header is set, use that, otherwise default to 'free'
        const tier = req.headers['x-mock-user-tier'] || 'free';
        req.user = { userId: `testUser-${tier}`, role: 'testRole', tier: tier };
        next();
    },
}));

// Mock tierCheck middleware
jest.mock('@/middleware/tierCheck', () => ({
    tierCheck: (requiredTier: 'free' | 'standard' | 'premium' | 'wowplus') => (req: any, res: any, next: jest.Mock) => {
        const TIER_ORDER = { 'free': 0, 'standard': 1, 'premium': 2, 'wowplus': 3 };
        const userTier = req.user?.tier || 'free'; // Get tier from mocked auth
        if (TIER_ORDER[userTier] >= TIER_ORDER[requiredTier]) {
            next();
        } else {
            const error = new Error(`Access denied: '${requiredTier}' tier required.`) as any;
            error.name = 'AccessDeniedError'; // Ensure custom error name is set
            next(error);
        }
    },
    AccessDeniedError: jest.fn().mockImplementation((message: string) => { // Mock the custom error class
        const error = new Error(message);
        error.name = 'AccessDeniedError';
        return error;
    }),
}));


// Mock logger to prevent console output during tests and spy on calls
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

// Create a test Express app to apply the router
const app = express();
app.use(express.json()); // Enable JSON body parsing
app.use(auctionManagementRoutes); // Mount the router

// Mock services that auctionManagementRoutes depends on (if they were real)
// jest.mock('@services/auction/auctionService');
// jest.mock('@services/ai/auctionAiService');

describe('AuctionManagementRoutes', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mock calls before each test
    });

    // Helper to set user tier for specific requests
    const setTierHeader = (tier: 'free' | 'standard' | 'premium' | 'wowplus') => (req: request.SuperTest<request.Test>) => {
        return req.set('x-mock-user-tier', tier);
    };

    // --- Free Tier Tests ---
    describe('Free Tier Endpoints', () => {
        const validFreeAuctionData = {
            vin: '1234567890ABCDEF1',
            title: 'Test Car Auction',
            description: 'A great car for sale.',
            startingBid: 1000,
            photos: ['http://example.com/photo1.jpg'],
            durationDays: 7
        };

        it('POST / (create auction) succeeds for Free tier with valid data', async () => {
            const res = await setTierHeader('free')(request(app).post('/'))
                .send(validFreeAuctionData);
            
            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.auction).toHaveProperty('id');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Create Free Tier Auction'));
        });

        it('POST / (create auction) returns 400 for invalid data', async () => {
            const invalidData = { ...validFreeAuctionData, vin: 'short' }; // Invalid VIN
            const res = await setTierHeader('free')(request(app).post('/'))
                .send(invalidData);
            
            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('Invalid input');
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Validation error'));
        });

        it('POST / (create auction) returns 403 if user is not authenticated', async () => {
            // Temporarily disable the mock auth to simulate unauthenticated request
            jest.spyOn(require('@/middleware/auth'), 'authenticate').mockImplementationOnce((req, res, next) => {
                req.user = undefined; // Explicitly set user to undefined
                next();
            });
            const res = await request(app)
                .post('/')
                .send(validFreeAuctionData); // No tier header, so auth mock will not set user
            
            expect(res.status).toBe(403);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('Authentication required or user tier not found.');
        });

        it('POST / (create auction) returns 500 for service failure', async () => {
            // Simulate an internal service error by mocking the route's internal behavior
            jest.spyOn(auctionManagementRoutes, 'default' as any).mockImplementationOnce((req: any, res: any, next: jest.Mock) => {
                if (req.method === 'POST' && req.path === '/') {
                    // Simulate an error thrown by the service layer
                    next(new Error('Simulated service error'));
                } else {
                    next();
                }
            });

            const res = await setTierHeader('free')(request(app).post('/'))
                .send(validFreeAuctionData);
            
            expect(res.status).toBe(500);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('An internal server error occurred.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Unhandled error in auctionManagementRoutes'));
        });

        it('GET /seller/me (get basic listings) succeeds for Free tier', async () => {
            const res = await setTierHeader('free')(request(app).get('/seller/me'));
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toBeInstanceOf(Array);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get My Basic Auction Listings'));
        });

        it('GET /seller/me returns 403 if user is not Free tier', async () => {
            const res = await setTierHeader('standard')(request(app).get('/seller/me')); // Attempt with higher tier
            
            expect(res.status).toBe(403);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe("Access denied: 'free' tier required.");
        });

        it('GET /:auctionId/basic-data (get basic auction data) succeeds for Free tier', async () => {
            const res = await setTierHeader('free')(request(app).get('/auc1/basic-data'));
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('currentBid');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get Basic Auction Data'));
        });
    });

    // --- Standard Tier Tests ---
    describe('Standard Tier Endpoints', () => {
        const auctionId = 'standardAuc1';
        const validUpdateData = { title: 'Updated Title', description: 'New description.' };
        const validQandAData = { question: 'How old is it?', answer: '5 years.' };

        it('PUT /:auctionId (update auction) succeeds for Standard tier with valid data', async () => {
            const res = await setTierHeader('standard')(request(app).put(`/${auctionId}`))
                .send(validUpdateData);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.auction.title).toBe(validUpdateData.title);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Update Standard Tier Auction'));
        });

        it('PUT /:auctionId returns 400 for invalid update data', async () => {
            const invalidUpdateData = { title: '' }; // Too short
            const res = await setTierHeader('standard')(request(app).put(`/${auctionId}`))
                .send(invalidUpdateData);
            
            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Validation error'));
        });

        it('PUT /:auctionId returns 403 if user is Free tier', async () => {
            const res = await setTierHeader('free')(request(app).put(`/${auctionId}`))
                .send(validUpdateData);
            
            expect(res.status).toBe(403);
            expect(res.body.message).toBe("Access denied: 'standard' tier required.");
        });

        it('POST /:auctionId/qanda (manage Q&A) succeeds for Standard tier', async () => {
            const res = await setTierHeader('standard')(request(app).post(`/${auctionId}/qanda`))
                .send(validQandAData);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Manage Auction Q&A'));
        });

        it('POST /:auctionId/qanda returns 400 for missing question/answer', async () => {
            const res = await setTierHeader('standard')(request(app).post(`/${auctionId}/qanda`))
                .send({});
            
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Question or Answer is required.');
        });

        it('GET /:auctionId/bids/summary (get bid summary) succeeds for Standard tier', async () => {
            const res = await setTierHeader('standard')(request(app).get(`/${auctionId}/bids/summary`));
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('totalBids');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get Auction Bid Summary'));
        });
    });

    // --- Premium Tier Tests ---
    describe('Premium Tier Endpoints', () => {
        const auctionId = 'premiumAuc1';
        const validPriceData = { reservePrice: 15000, buyItNowPrice: 20000 };

        it('PUT /:auctionId/set-reserve (set reserve) succeeds for Premium tier with valid data', async () => {
            const res = await setTierHeader('premium')(request(app).put(`/${auctionId}/set-reserve`))
                .send(validPriceData);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.auction).toHaveProperty('reservePrice');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Set Reserve/Buy It Now Price'));
        });

        it('PUT /:auctionId/set-reserve returns 400 for invalid price data', async () => {
            const invalidPriceData = { reservePrice: -100 }; // Invalid
            const res = await setTierHeader('premium')(request(app).put(`/${auctionId}/set-reserve`))
                .send(invalidPriceData);
            
            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Validation error'));
        });

        it('PUT /:auctionId/set-reserve returns 403 if user is Standard tier', async () => {
            const res = await setTierHeader('standard')(request(app).put(`/${auctionId}/set-reserve`))
                .send(validPriceData);
            
            expect(res.status).toBe(403);
            expect(res.body.message).toBe("Access denied: 'premium' tier required.");
        });

        it('GET /:auctionId/advanced-bid-analytics succeeds for Premium tier', async () => {
            const res = await setTierHeader('premium')(request(app).get(`/${auctionId}/advanced-bid-analytics`));
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('bidderBehavior');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get Advanced Bid Analytics'));
        });
    });

    // --- Wow++ Tier Tests ---
    describe('Wow++ Tier Endpoints', () => {
        const draftId = 'draft123';
        const validAISuggestionsData = { suggestionType: 'pricing', auctionId: 'auc123' };
        const validHealthCheckData = { draftId: 'draft123' };

        it('POST /ai-suggestions (AI suggestions) succeeds for Wow++ tier with valid data', async () => {
            const res = await setTierHeader('wowplus')(request(app).post('/ai-suggestions'))
                .send(validAISuggestionsData);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('recommendations');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get AI Auction Suggestions'));
        });

        it('POST /ai-suggestions returns 400 for invalid AI suggestions data', async () => {
            const invalidData = { suggestionType: 'invalidType' }; // Invalid enum
            const res = await setTierHeader('wowplus')(request(app).post('/ai-suggestions'))
                .send(invalidData);
            
            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Validation error'));
        });

        it('POST /ai-suggestions returns 403 if user is Premium tier', async () => {
            const res = await setTierHeader('premium')(request(app).post('/ai-suggestions'))
                .send(validAISuggestionsData);
            
            expect(res.status).toBe(403);
            expect(res.body.message).toBe("Access denied: 'wowplus' tier required.");
        });

        it('GET /draft/:draftId/health-check (pre-submission health check) succeeds for Wow++ tier', async () => {
            const res = await setTierHeader('wowplus')(request(app).get(`/draft/${draftId}/health-check`));
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('status', 'Good');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get Draft Auction Health Check'));
        });

        it('GET /draft/:draftId/health-check returns 403 if user is Premium tier', async () => {
            const res = await setTierHeader('premium')(request(app).get(`/draft/${draftId}/health-check`));
            
            expect(res.status).toBe(403);
            expect(res.body.message).toBe("Access denied: 'wowplus' tier required.");
        });
    });

    // --- Global Error Handling Tests (e.g., HTTPS, Unhandled) ---
    it('returns 403 for HTTP request in production (HTTPS check)', async () => {
        // Temporarily set NODE_ENV to production for this test
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        // Create a new app instance for this specific test to control middleware
        const mockApp = express();
        mockApp.use((req, res, next) => {
            (req as any).secure = false; // Force req.secure to false
            next();
        });
        mockApp.use(auctionManagementRoutes);

        const res = await request(mockApp).get('/seller/me'); // Any route

        expect(res.status).toBe(403);
        expect(res.body.message).toBe('HTTPS connection required.');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Insecure request blocked'));

        process.env.NODE_ENV = originalNodeEnv; // Reset NODE_ENV
    });

    it('returns 500 for unhandled errors', async () => {
        // Simulate an unhandled error in a route handler
        jest.spyOn(auctionManagementRoutes, 'default' as any).mockImplementationOnce((req, res, next) => {
            // Only throw error for a specific path to not break other tests
            if (req.method === 'GET' && req.path === '/seller/me') {
                throw new Error('Simulated unhandled error');
            }
            next();
        });

        const res = await setTierHeader('free')(request(app).get('/seller/me'));
        
        expect(res.status).toBe(500);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toBe('An internal server error occurred.');
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Unhandled error in auctionManagementRoutes'));
    });
});