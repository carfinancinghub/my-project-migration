/*
File: estimateRoutes.test.ts
Path: C:\CFH\backend\tests\routes\bodyshop\estimateRoutes.test.ts
Created: 2025-07-04 12:50 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for estimateRoutes.ts with tiered endpoint tests.
Artifact ID: x1y2z3a4-b5c6-d7e8-f9g0-h1i2j3k4l5m6
Version ID: y2z3a4b5-c6d7-e8f9-g0h1-i2j3k4l5m6n7
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import express from 'express'; // Import express to create a test app
import logger from '@/utils/logger'; // Centralized logging utility
import estimateRoutes from '@/backend/routes/bodyshop/estimateRoutes'; // Import the router to test
import { z } from 'zod'; // For ZodError comparison

// Mock middleware dependencies
// Mock authenticate middleware to set req.user based on provided tier
jest.mock('@/middleware/auth', () => ({
    authenticate: (req: any, res: any, next: jest.Mock) => {
        // This mock allows tests to control the user object
        const tier = req.headers['x-mock-user-tier'] || 'free';
        req.user = { userId: `testUser-${tier}`, role: 'testRole', tier: tier, shopId: `testShop-${tier}` }; // Add shopId for shop-related tests
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
            error.name = 'AccessDeniedError';
            next(error);
        }
    },
    AccessDeniedError: jest.fn().mockImplementation((message: string) => {
        const error = new Error(message);
        error.name = 'AccessDeniedError';
        return error;
    }),
}));

// Mock rateLimiter middleware (simplified)
jest.mock('@/middleware/rateLimiter', () => ({
    rateLimiter: (options?: any) => (req: any, res: any, next: jest.Mock) => {
        // For testing purposes, just allow all requests or simulate failure
        if (req.headers['x-simulate-ratelimit']) {
            (req as any).statusCode = 429; // Simulate rate limit error
            const error = new Error('Too many requests. Please try again later.') as any;
            error.statusCode = 429;
            return next(error);
        }
        next();
    },
}));

// Mock redisCacheMiddleware (simplified)
jest.mock('@/middleware/redisCache', () => ({
    redisCacheMiddleware: (ttl: number) => (req: any, res: any, next: jest.Mock) => {
        // For testing, just pass through
        next();
    },
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
app.use('/bodyshop', estimateRoutes); // Mount the router under /bodyshop prefix

// Global error handler for the test app (to catch errors thrown by middleware/routes)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if ((err as any).name === 'AccessDeniedError' || (err as any).name === 'NotAuthenticatedError') {
        return res.status(403).json({ status: 'error', message: err.message });
    }
    if (err instanceof z.ZodError) {
        return res.status(400).json({ status: 'error', message: 'Invalid request data', errors: err.errors });
    }
    if ((err as any).statusCode === 409) { // Conflict Error
        return res.status(409).json({ status: 'error', message: err.message });
    }
    if ((err as any).statusCode === 429) { // Rate Limit Error
        return res.status(429).json({ status: 'error', message: err.message });
    }
    logger.error(`Test Global Error Handler:`, err);
    res.status(500).json({ status: 'error', message: 'An internal server error occurred.' });
});


describe('estimateRoutes', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mock calls before each test
    });

    // Helper to set user tier for specific requests
    const setTierHeader = (tier: 'free' | 'standard' | 'premium' | 'wowplus') => (req: request.SuperTest<request.Test>) => {
        return req.set('x-mock-user-tier', tier);
    };

    // --- Free Tier Tests ---
    describe('Free Tier Endpoints', () => {
        const userId = 'testUserFree1';
        const shopId = 'testShopFree1';
        const validEstimateData = {
            shopId: shopId, userId: userId, vehicleMake: 'Honda', vehicleModel: 'Civic',
            damageDescription: 'Dent on front bumper.', photos: ['http://example.com/photo1.jpg']
        };

        it('POST /estimates succeeds for Free tier with valid data', async () => {
            const res = await setTierHeader('free')(request(app).post('/bodyshop/estimates'))
                .send(validEstimateData);
            
            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.estimate).toHaveProperty('id');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Submit Free Tier Estimate Request'));
        });

        it('POST /estimates returns 400 for invalid data', async () => {
            const invalidData = { ...validEstimateData, vehicleMake: '' }; // Invalid
            const res = await setTierHeader('free')(request(app).post('/bodyshop/estimates'))
                .send(invalidData);
            
            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('Invalid input');
            expect(res.body.errors).toBeInstanceOf(Array);
        });

        it('POST /estimates returns 403 if user is not authenticated', async () => {
            jest.spyOn(require('@/middleware/auth'), 'authenticate').mockImplementationOnce((req, res, next) => {
                req.user = undefined; // Simulate unauthenticated
                next();
            });
            const res = await request(app).post('/bodyshop/estimates').send(validEstimateData);
            
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Authentication required or user tier not found.');
        });

        it('GET /estimates/user/:userId succeeds for Free tier', async () => {
            const res = await setTierHeader('free')(request(app).get(`/bodyshop/estimates/user/${userId}`));
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toBeInstanceOf(Array);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get User Estimate History (Basic)'));
        });

        it('GET /estimates/user/:userId returns 403 for unauthorized access to other user\'s estimates', async () => {
            const res = await setTierHeader('free')(request(app).get(`/bodyshop/estimates/user/otherUser`));
            
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Access denied to view other user\'s estimates.');
        });
    });

    // --- Standard Tier Tests ---
    describe('Standard Tier Endpoints', () => {
        const shopId = 'testShopStandard1';
        const estimateId = 'estStandard1';
        const validResponseData = { quotedCost: 1500, timelineDays: 3, details: 'Standard repair quote.' };

        it('GET /estimates/shop/:shopId succeeds for Standard tier', async () => {
            const res = await setTierHeader('standard')(request(app).get(`/bodyshop/estimates/shop/${shopId}`));
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toBeInstanceOf(Array);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get Shop Estimates'));
        });

        it('GET /estimates/shop/:shopId returns 403 if user is Free tier', async () => {
            const res = await setTierHeader('free')(request(app).get(`/bodyshop/estimates/shop/${shopId}`));
            
            expect(res.status).toBe(403);
            expect(res.body.message).toBe("Access denied: 'standard' tier required.");
        });

        it('PUT /estimates/:estimateId/respond succeeds for Standard tier with valid data', async () => {
            const res = await setTierHeader('standard')(request(app).put(`/bodyshop/estimates/${estimateId}/respond`))
                .send(validResponseData);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.estimate.status).toBe('Quoted');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Shop Respond to Estimate'));
        });

        it('PUT /estimates/:estimateId/respond returns 400 for invalid response data', async () => {
            const invalidData = { quotedCost: -100 }; // Invalid
            const res = await setTierHeader('standard')(request(app).put(`/bodyshop/estimates/${estimateId}/respond`))
                .send(invalidData);
            
            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('Invalid input');
        });

        it('PUT /estimates/:estimateId/respond returns 409 for conflict (e.g., already quoted)', async () => {
            // Simulate conflict error from service layer
            jest.spyOn(require('@/backend/services/bodyshop/estimateService'), 'estimateService').mockImplementationOnce({
                respondToEstimate: jest.fn().mockRejectedValueOnce({ name: 'EstimateConflictError', message: 'Estimate already quoted.' })
            });

            const res = await setTierHeader('standard')(request(app).put(`/bodyshop/estimates/${estimateId}/respond`))
                .send(validResponseData);
            
            expect(res.status).toBe(409);
            expect(res.body.message).toBe('Estimate already quoted.');
        });
    });

    // --- Premium Tier Tests ---
    describe('Premium Tier Endpoints', () => {
        const userId = 'testUserPremium1';
        const validBroadcastData = {
            userId: userId, vehicleMake: 'BMW', vehicleModel: 'X5', damageDescription: 'Front damage',
            photos: ['http://example.com/photo1.jpg'], selectedShopIds: ['shopA', 'shopB']
        };
        const claimId = 'claim123';
        const validWebhookData = {
            claimId: claimId, userId: userId, adjusterName: 'John Doe',
            insuredVehicle: { make: 'Toyota', model: 'Camry', vin: '1HGCM82633A123456' },
            damageCode: 'D102', preferredShops: ['shopA']
        };

        it('POST /estimates/broadcast succeeds for Premium tier with valid data', async () => {
            const res = await setTierHeader('premium')(request(app).post('/bodyshop/estimates/broadcast'))
                .send(validBroadcastData);
            
            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.message).toBe('Multi-shop estimate request broadcasted.');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Submit Multi-Shop Estimate Request'));
        });

        it('POST /estimates/broadcast returns 400 for invalid data', async () => {
            const invalidData = { ...validBroadcastData, selectedShopIds: [] }; // Invalid
            const res = await setTierHeader('premium')(request(app).post('/bodyshop/estimates/broadcast'))
                .send(invalidData);
            
            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('Invalid input');
        });

        it('GET /estimates/leads succeeds for Premium tier', async () => {
            const res = await setTierHeader('premium')(request(app).get('/bodyshop/estimates/leads'));
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toBeInstanceOf(Array);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get Estimate Leads for Shop'));
        });

        it('POST /estimates/webhook/insurance succeeds for Premium tier with valid data', async () => {
            // Mock webhook signature validation to pass for this test
            jest.spyOn(estimateRoutes, 'default' as any).mockImplementationOnce((req: any, res: any, next: jest.Mock) => {
                if (req.method === 'POST' && req.path === '/estimates/webhook/insurance') {
                    // Simulate successful processing
                    res.status(200).json({ status: 'received', claimLinked: true, data: { claimId: req.body.claimId } });
                } else {
                    next();
                }
            });

            const res = await request(app).post('/bodyshop/estimates/webhook/insurance').send(validWebhookData);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('received');
            expect(res.body.claimLinked).toBe(true);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Receive Insurance Webhook'));
        });

        it('POST /estimates/webhook/insurance returns 500 for internal processing error', async () => {
            jest.spyOn(estimateRoutes, 'default' as any).mockImplementationOnce((req: any, res: any, next: jest.Mock) => {
                if (req.method === 'POST' && req.path === '/estimates/webhook/insurance') {
                    next(new Error('Simulated webhook processing error'));
                } else {
                    next();
                }
            });
            const res = await request(app).post('/bodyshop/estimates/webhook/insurance').send(validWebhookData);
            
            expect(res.status).toBe(500);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('An internal server error occurred.');
        });
    });

    // --- Wow++ Tier Tests ---
    describe('Wow++ Tier Endpoints', () => {
        const estimateId = 'estWowPlus1';
        const validPhotos = ['http://example.com/damage1.jpg'];
        const validExpiryData = { expiresAt: new Date(Date.now() + 86400000).toISOString() };
        const validResolutionData = { resolutionId: 'res123', optionSelected: 'renegotiate' };

        it('POST /estimates/ai-assess succeeds for Wow++ tier with valid data', async () => {
            const res = await setTierHeader('wowplus')(request(app).post('/bodyshop/estimates/ai-assess'))
                .send({ estimateId: estimateId, damagePhotos: validPhotos });
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.message).toBe('AI assessment complete.');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('AI Preliminary Damage Assessment'));
        });

        it('POST /estimates/ai-assess returns 400 for invalid data', async () => {
            const invalidData = { estimateId: 'invalid-id', damagePhotos: [] }; // Invalid
            const res = await setTierHeader('wowplus')(request(app).post('/bodyshop/estimates/ai-assess'))
                .send(invalidData);
            
            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('Invalid input');
        });

        it('PATCH /estimates/:estimateId/set-expiry succeeds for Wow++ tier', async () => {
            const res = await setTierHeader('wowplus')(request(app).patch(`/bodyshop/estimates/${estimateId}/set-expiry`))
                .send(validExpiryData);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('updated');
            expect(res.body.message).toBe('Estimate expiry set successfully.');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Set Estimate Expiry'));
        });

        it('PATCH /estimates/:estimateId/set-expiry returns 400 for invalid expiry date', async () => {
            const invalidData = { expiresAt: 'not-a-date' };
            const res = await setTierHeader('wowplus')(request(app).patch(`/bodyshop/estimates/${estimateId}/set-expiry`))
                .send(invalidData);
            
            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('Invalid input');
        });

        it('GET /estimates/reminders/pending succeeds for Wow++ tier', async () => {
            const res = await setTierHeader('wowplus')(request(app).get('/bodyshop/estimates/reminders/pending'));
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toBeInstanceOf(Array);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get Pending Estimate Reminders'));
        });

        it('GET /estimates/:estimateId/resolve-conflict-suggestions succeeds for Wow++ tier', async () => {
            const res = await setTierHeader('wowplus')(request(app).get(`/bodyshop/estimates/${estimateId}/resolve-conflict-suggestions`));
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toBeInstanceOf(Array);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Get AI Conflict Resolution Suggestions'));
        });

        it('POST /estimates/:estimateId/resolve-with-ai succeeds for Wow++ tier with valid data', async () => {
            const res = await setTierHeader('wowplus')(request(app).post(`/bodyshop/estimates/${estimateId}/resolve-with-ai`))
                .send(validResolutionData);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.message).toBe('AI-recommended resolution applied.');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Apply AI-Recommended Resolution'));
        });

        it('POST /estimates/:estimateId/resolve-with-ai returns 400 for invalid data', async () => {
            const invalidData = { resolutionId: 'invalid-id' };
            const res = await setTierHeader('wowplus')(request(app).post(`/bodyshop/estimates/${estimateId}/resolve-with-ai`))
                .send(invalidData);
            
            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('Invalid input');
        });
    });

    // --- General CQS Tests (e.g., HTTPS, Rate Limiting) ---
    it('returns 403 for HTTP request in production (HTTPS check)', async () => {
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        const mockApp = express();
        mockApp.use((req, res, next) => {
            (req as any).secure = false; // Force req.secure to false
            next();
        });
        mockApp.use('/bodyshop', estimateRoutes);
        
        const res = await request(mockApp).get('/bodyshop/estimates/user/someUser');

        expect(res.status).toBe(403);
        expect(res.body.message).toBe('HTTPS connection required.');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Insecure request blocked'));

        process.env.NODE_ENV = originalNodeEnv; // Reset NODE_ENV
    });

    it('returns 429 for rate-limited requests', async () => {
        const res = await setTierHeader('free')(request(app).post('/bodyshop/estimates'))
            .send({ ...validEstimateData, userId: 'rateLimitedUser' })
            .set('x-simulate-ratelimit', 'true'); // Trigger mock rate limit

        expect(res.status).toBe(429);
        expect(res.body.message).toBe('Too many requests. Please try again later.');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Rate limit exceeded'));
    });
});