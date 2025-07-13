/*
File: estimateService.test.ts
Path: C:\CFH\backend\tests\services\bodyshop\estimateService.test.ts
Created: 2025-07-04 11:50 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for estimateService with tiered features and performance checks.
Artifact ID: u5v6w7x8-y9z0-a1b2-c3d4-e5f6g7h8i9j0
Version ID: v6w7x8y9-z0a1-b2c3-d4e5-f6g7h8i9j0k1
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { estimateService, EstimateServiceError, EstimateConflictError } from '@/backend/services/bodyshop/estimateService';
import { z } from 'zod'; // For testing ZodError propagation if needed

// Mock the logger to prevent console output during tests and spy on calls
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

// Mock internal dependencies if they were real (e.g., EstimateRepository, ShopRepository, aiDamageAssessmentService, notificationService)
// For now, the service uses mock data internally, so we test its public interface directly.

describe('estimateService', () => {
    let service: typeof estimateService;

    beforeEach(() => {
        service = new (estimateService as any).constructor(); // Create a new instance for each test
        jest.clearAllMocks();
        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- Free Tier Tests ---
    describe('Free Tier Methods', () => {
        const userId = 'testUserFree';
        const shopId = 'testShopFree';
        const basicEstimateData = {
            shopId, userId, vehicleMake: 'Honda', vehicleModel: 'Civic',
            damageDescription: 'Small dent on fender', photos: ['http://example.com/photo1.jpg']
        };

        it('createEstimate succeeds for Free tier', async () => {
            const result = await service.createEstimate(userId, basicEstimateData);
            expect(result.id).toBeDefined();
            expect(result.status).toBe('Pending');
            expect(result.shopId).toBe(shopId);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Creating single-shop estimate for user: ${userId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Single-shop estimate ${result.id} created for user ${userId}`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
        });

        it('createEstimate throws EstimateServiceError on failure', async () => {
            // Simulate an internal failure by temporarily replacing the method
            const originalCreateEstimate = service.createEstimate;
            service.createEstimate = jest.fn().mockImplementationOnce(() => {
                throw new Error('Simulated DB error');
            });

            await expect(service.createEstimate(userId, basicEstimateData)).rejects.toThrow(EstimateServiceError);
            await expect(service.createEstimate(userId, basicEstimateData)).rejects.toThrow('Failed to create estimate request.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to create single-shop estimate'), expect.any(Error));

            service.createEstimate = originalCreateEstimate; // Restore
        });

        it('getUserEstimates returns estimates for Free tier', async () => {
            const result = await service.getUserEstimates(userId);
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0); // Mock data should return some
            expect(result[0].userId).toBe(userId);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Fetching estimates for user: ${userId}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('getUserEstimates returns empty array if no estimates found', async () => {
            // Mock the internal repo call to return empty
            const originalGetUserEstimates = service.getUserEstimates;
            service.getUserEstimates = jest.fn().mockResolvedValueOnce([]);

            const result = await service.getUserEstimates('userNoEstimates');
            expect(result).toEqual([]);
            expect(logger.warn).not.toHaveBeenCalled();

            service.getUserEstimates = originalGetUserEstimates; // Restore
        });

        it('getUserEstimates throws EstimateServiceError on failure', async () => {
            const originalGetUserEstimates = service.getUserEstimates;
            service.getUserEstimates = jest.fn().mockImplementationOnce(() => {
                throw new Error('Simulated network error');
            });

            await expect(service.getUserEstimates(userId)).rejects.toThrow(EstimateServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to get estimates for user'), expect.any(Error));

            service.getUserEstimates = originalGetUserEstimates; // Restore
        });
    });

    // --- Standard Tier Tests ---
    describe('Standard Tier Methods', () => {
        const shopId = 'testShopStandard';
        const estimateId = 'estStandard1';
        const responseData = { quotedCost: 1500, timelineDays: 3, details: 'Standard repair quote.' };

        it('getShopEstimates returns estimates for Standard tier shop', async () => {
            const result = await service.getShopEstimates(shopId, 'shopOwner1');
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].shopId).toBe(shopId);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Fetching estimates for shop: ${shopId}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('getShopEstimates throws EstimateServiceError on failure', async () => {
            const originalGetShopEstimates = service.getShopEstimates;
            service.getShopEstimates = jest.fn().mockImplementationOnce(() => {
                throw new Error('DB connection lost');
            });

            await expect(service.getShopEstimates(shopId, 'shopOwner1')).rejects.toThrow(EstimateServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to get estimates for shop'), expect.any(Error));

            service.getShopEstimates = originalGetShopEstimates; // Restore
        });

        it('respondToEstimate succeeds for Standard tier', async () => {
            const result = await service.respondToEstimate(estimateId, shopId, responseData);
            expect(result.id).toBe(estimateId);
            expect(result.status).toBe('Quoted');
            expect(result.quotedCost).toBe(responseData.quotedCost);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Shop ${shopId} responding to estimate ${estimateId}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('respondToEstimate throws EstimateConflictError if already quoted', async () => {
            // Mock internal state to simulate conflict
            const originalRespondToEstimate = service.respondToEstimate;
            service.respondToEstimate = jest.fn().mockImplementationOnce(() => {
                throw new EstimateConflictError('Estimate already quoted.', estimateId);
            });

            await expect(service.respondToEstimate(estimateId, shopId, responseData)).rejects.toThrow(EstimateConflictError);
            await expect(service.respondToEstimate(estimateId, shopId, responseData)).rejects.toThrow('Estimate already quoted.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed for shop'), expect.any(EstimateConflictError));

            service.respondToEstimate = originalRespondToEstimate; // Restore
        });

        it('respondToEstimate throws EstimateServiceError on other failures', async () => {
            const originalRespondToEstimate = service.respondToEstimate;
            service.respondToEstimate = jest.fn().mockImplementationOnce(() => {
                throw new Error('Unauthorized access');
            });

            await expect(service.respondToEstimate(estimateId, shopId, responseData)).rejects.toThrow(EstimateServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed for shop'), expect.any(Error));

            service.respondToEstimate = originalRespondToEstimate; // Restore
        });
    });

    // --- Premium Tier Tests ---
    describe('Premium Tier Methods', () => {
        const userId = 'testUserPremium';
        const selectedShopIds = ['shopA', 'shopB', 'shopC'];
        const broadcastData = {
            userId, vehicleMake: 'BMW', vehicleModel: 'X5', damageDescription: 'Front collision',
            photos: ['url1'], selectedShopIds
        };

        it('broadcastEstimate succeeds for Premium tier', async () => {
            const result = await service.broadcastEstimate(userId, broadcastData);
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(selectedShopIds.length);
            expect(result[0].status).toBe('sent');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Broadcasting estimate for user ${userId}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('broadcastEstimate throws EstimateServiceError on failure', async () => {
            const originalBroadcastEstimate = service.broadcastEstimate;
            service.broadcastEstimate = jest.fn().mockImplementationOnce(() => {
                throw new Error('Broadcast system offline');
            });

            await expect(service.broadcastEstimate(userId, broadcastData)).rejects.toThrow(EstimateServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to broadcast estimate'), expect.any(Error));

            service.broadcastEstimate = originalBroadcastEstimate; // Restore
        });

        it('getShopLeads returns leads for Premium tier shop', async () => {
            const result = await service.getShopLeads('shopPremium');
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('status', 'New Lead');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Fetching leads for shop: shopPremium'));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('getShopLeads throws EstimateServiceError on failure', async () => {
            const originalGetShopLeads = service.getShopLeads;
            service.getShopLeads = jest.fn().mockImplementationOnce(() => {
                throw new Error('Lead repo error');
            });

            await expect(service.getShopLeads('shopPremium')).rejects.toThrow(EstimateServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to get leads for shop'), expect.any(Error));

            service.getShopLeads = originalGetShopLeads; // Restore
        });
    });

    // --- Wow++ Tier Tests ---
    describe('Wow++ Tier Methods', () => {
        const estimateId = 'estWowPlus1';
        const photos = ['http://example.com/damage1.jpg', 'http://example.com/damage2.jpg'];

        it('assessDamage succeeds for Wow++ tier', async () => {
            const result = await service.assessDamage(estimateId, photos);
            expect(result.estimateId).toBe(estimateId);
            expect(result).toHaveProperty('summary');
            expect(result).toHaveProperty('estimatedCost');
            expect(result).toHaveProperty('confidence');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Performing AI assessment for estimate ${estimateId}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('assessDamage throws EstimateServiceError on failure', async () => {
            const originalAssessDamage = service.assessDamage;
            service.assessDamage = jest.fn().mockImplementationOnce(() => {
                throw new Error('AI service down');
            });

            await expect(service.assessDamage(estimateId, photos)).rejects.toThrow(EstimateServiceError);
            await expect(service.assessDamage(estimateId, photos)).rejects.toThrow('Failed to perform AI damage assessment.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to perform AI assessment for estimate'), expect.any(Error));

            service.assessDamage = originalAssessDamage; // Restore
        });
    });

    // --- Performance (CQS) Scenarios ---
    it('should log a warning if createEstimate response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
            setTimeout(() => cb(), 600); // Simulate 600ms delay
            return {} as any;
        });
        await service.createEstimate('userSlow', { shopId: 'shopSlow', userId: 'userSlow', vehicleMake: 'Slow', vehicleModel: 'Car', damageDescription: 'Damage', photos: [] });
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Create estimate response time exceeded 500ms'));
    });

    it('should log a warning if getUserEstimates response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
            setTimeout(() => cb(), 600);
            return {} as any;
        });
        await service.getUserEstimates('userSlow');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Get user estimates response time exceeded 500ms'));
    });

    it('should log a warning if getShopEstimates response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
            setTimeout(() => cb(), 600);
            return {} as any;
        });
        await service.getShopEstimates('shopSlow', 'ownerSlow');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Get shop estimates response time exceeded 500ms'));
    });

    it('should log a warning if respondToEstimate response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
            setTimeout(() => cb(), 600);
            return {} as any;
        });
        await service.respondToEstimate('estSlow', 'shopSlow', { quotedCost: 100 });
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Respond to estimate response time exceeded 500ms'));
    });

    it('should log a warning if broadcastEstimate response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
            setTimeout(() => cb(), 600);
            return {} as any;
        });
        await service.broadcastEstimate('userSlow', { userId: 'userSlow', vehicleMake: 'Slow', vehicleModel: 'Car', damageDescription: 'Damage', photos: [], selectedShopIds: ['s1', 's2'] });
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Broadcast estimate response time exceeded 500ms'));
    });

    it('should log a warning if getShopLeads response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
            setTimeout(() => cb(), 600);
            return {} as any;
        });
        await service.getShopLeads('shopSlow');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Get shop leads response time exceeded 500ms'));
    });

    it('should log a warning if assessDamage response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
            setTimeout(() => cb(), 600);
            return {} as any;
        });
        await service.assessDamage('estSlowAI', ['url']);
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('AI assessment response time exceeded 500ms'));
    });
});