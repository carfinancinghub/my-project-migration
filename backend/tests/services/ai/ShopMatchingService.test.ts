/*
File: ShopMatchingService.test.ts
Path: C:\CFH\backend\tests\services\ai\ShopMatchingService.test.ts
Created: 2025-07-04 04:50 PM PDT // Dynamically generated current PDT time
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for ShopMatchingService with skeleton tests.
Artifact ID: k7l8m9n0-p1q2-r3s4-t5u6-v7w8x9y0z1a2
Version ID: l8m9n0p1-q2r3-s4t5-u6v7-w8x9y0z1a2b3 // New unique ID for version 1.0
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { shopMatchingService, ShopMatchingServiceError } from '@/backend/services/ai/ShopMatchingService';
import * as uuid from 'uuid'; // Import uuid to mock its functions
import { z } from 'zod'; // For ZodError comparison

// Mock the logger to prevent console output during tests and spy on calls
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

// Mock uuid.v4() for consistent correlation IDs
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mock-uuid-correlation-id'),
}));

// Mock the internal MockShopMatchingClient
const mockClient = {
    findShops: jest.fn(),
    rankShops: jest.fn(),
};


describe('ShopMatchingService', () => {
    let service: typeof shopMatchingService;

    beforeEach(() => {
        // Create a new instance, injecting our mocks
        service = new (shopMatchingService as any).constructor(mockClient);
        jest.clearAllMocks();
        // Reset mock implementations for client methods
        mockClient.findShops.mockReset();
        mockClient.rankShops.mockReset();

        // Default successful mock responses for client methods
        mockClient.findShops.mockResolvedValue([
            { id: 'shop1', name: 'Shop A', aiScore: 0.95 },
            { id: 'shop2', name: 'Shop B', aiScore: 0.90 },
        ]);
        mockClient.rankShops.mockResolvedValue([
            { id: 'shop1', name: 'Shop A', aiScore: 0.95 },
            { id: 'shop2', name: 'Shop B', aiScore: 0.90 },
        ]);

        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- findMatchingShops Tests ---
    describe('findMatchingShops', () => {
        const validEstimateId = 'e1f2g3h4-i5j6-7k8l-9m0n-1o2p3q4r5s6t'; // Valid UUID
        const validLocation = '95677';
        const validCriteria = { damageType: 'collision' };

        it('should find matching shops successfully for valid input', async () => {
            const result = await service.findMatchingShops(validEstimateId, validLocation, validCriteria);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('aiScore');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] ShopMatchingService: Finding matching shops for estimate ${validEstimateId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Shop matching completed`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
            expect(mockClient.findShops).toHaveBeenCalledWith(validEstimateId, validLocation, validCriteria);
        });

        it('should throw ShopMatchingServiceError for invalid estimateId format', async () => {
            const invalidEstimateId = 'bad-uuid';
            await expect(service.findMatchingShops(invalidEstimateId, validLocation)).rejects.toThrow(ShopMatchingServiceError);
            await expect(service.findMatchingShops(invalidEstimateId, validLocation)).rejects.toThrow('Invalid estimate ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for findMatchingShops input'), expect.any(z.ZodError));
            expect(mockClient.findShops).not.toHaveBeenCalled(); // Should fail validation before calling client
        });

        it('should throw ShopMatchingServiceError for missing location', async () => {
            await expect(service.findMatchingShops(validEstimateId, '')).rejects.toThrow(ShopMatchingServiceError);
            await expect(service.findMatchingShops(validEstimateId, '')).rejects.toThrow('Location is required'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for findMatchingShops input'), expect.any(z.ZodError));
            expect(mockClient.findShops).not.toHaveBeenCalled();
        });

        it('should throw ShopMatchingServiceError if AI client fails to find shops', async () => {
            mockClient.findShops.mockRejectedValueOnce(new Error('AI client communication error'));

            await expect(service.findMatchingShops(validEstimateId, validLocation)).rejects.toThrow(ShopMatchingServiceError);
            await expect(service.findMatchingShops(validEstimateId, validLocation)).rejects.toThrow('Failed to find matching shops.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to find matching shops for estimate ${validEstimateId}`), expect.any(Error));
        });

        it('should log a warning if findMatchingShops response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay for internal client call
                return {} as any;
            });

            await service.findMatchingShops(validEstimateId, validLocation);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Matching response time exceeded 500ms'));
        });
    });

    // --- rankShops Tests ---
    describe('rankShops', () => {
        const validEstimateId = 'r1s2t3u4-v5w6-7x8y-9z0a-1b2c3d4e5f6g'; // Valid UUID
        const validShops = [{ id: 'shopX', name: 'Shop X', aiScore: 0.8 }, { id: 'shopY', name: 'Shop Y', aiScore: 0.9 }];
        const validRankingCriteria = { userPreference: 'closest' };

        it('should rank shops successfully for valid input', async () => {
            const result = await service.rankShops(validShops, validEstimateId, validRankingCriteria);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(validShops.length);
            expect(result[0].aiScore).toBe(0.9); // Verify sorting by mock AI score
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] ShopMatchingService: Ranking ${validShops.length} shops for estimate ${validEstimateId}.`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Shop ranking completed`));
            expect(logger.warn).not.toHaveBeenCalled();
            expect(mockClient.rankShops).toHaveBeenCalledWith(validShops, validEstimateId, validRankingCriteria);
        });

        it('should throw ShopMatchingServiceError for invalid estimateId format', async () => {
            const invalidEstimateId = 'another-bad-uuid';
            await expect(service.rankShops(validShops, invalidEstimateId)).rejects.toThrow(ShopMatchingServiceError);
            await expect(service.rankShops(validShops, invalidEstimateId)).rejects.toThrow('Invalid estimate ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for rankShops input'), expect.any(z.ZodError));
            expect(mockClient.rankShops).not.toHaveBeenCalled();
        });

        it('should throw ShopMatchingServiceError for empty shops array', async () => {
            await expect(service.rankShops([], validEstimateId)).rejects.toThrow(ShopMatchingServiceError);
            await expect(service.rankShops([], validEstimateId)).rejects.toThrow('At least one shop is required for ranking'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for rankShops input'), expect.any(z.ZodError));
            expect(mockClient.rankShops).not.toHaveBeenCalled();
        });

        it('should throw ShopMatchingServiceError if AI client fails to rank shops', async () => {
            mockClient.rankShops.mockRejectedValueOnce(new Error('AI ranking service down'));

            await expect(service.rankShops(validShops, validEstimateId)).rejects.toThrow(ShopMatchingServiceError);
            await expect(service.rankShops(validShops, validEstimateId)).rejects.toThrow(`Failed to rank shops for estimate ${validEstimateId}.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to rank shops for estimate ${validEstimateId}`), expect.any(Error));
        });

        it('should log a warning if rankShops response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay
                return {} as any;
            });

            await service.rankShops(validShops, validEstimateId);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Ranking response time exceeded 500ms'));
        });
    });
});