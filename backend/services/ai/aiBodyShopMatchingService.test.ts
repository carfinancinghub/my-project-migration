/*
File: aiBodyShopMatchingService.test.ts
Path: C:\CFH\backend\tests\services\ai/aiBodyShopMatchingService.test.ts
Created: 2025-07-04 06:00 PM PDT // Dynamically generated current PDT time
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for aiBodyShopMatchingService with skeleton tests.
Artifact ID: a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6
Version ID: b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7 // New unique ID for version 1.0
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { bodyShopMatchingService, BodyShopMatchingServiceError } from '@/backend/services/ai/aiBodyShopMatchingService';
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
    matchShops: jest.fn(),
    evaluateCompatibility: jest.fn(),
};


describe('aiBodyShopMatchingService', () => {
    let service: typeof bodyShopMatchingService;

    beforeEach(() => {
        // Create a new instance, injecting our mocks
        service = new (bodyShopMatchingService as any).constructor(mockClient);
        jest.clearAllMocks();
        // Reset mock implementations for client methods
        mockClient.matchShops.mockReset();
        mockClient.evaluateCompatibility.mockReset();

        // Default successful mock responses for client methods
        mockClient.matchShops.mockResolvedValue([
            { id: 'shop1', name: 'Shop A', aiScore: 0.95 },
            { id: 'shop2', name: 'Shop B', aiScore: 0.90 },
        ]);
        mockClient.evaluateCompatibility.mockResolvedValue({
            shopId: 'shop1',
            estimateId: 'est1',
            compatibilityScore: 0.92,
            reasons: ['Good match on services', 'High rating for similar damage']
        });

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
        const validPhotos = ['http://example.com/photo.jpg'];

        it('should find matching shops successfully for valid input', async () => {
            const result = await service.findMatchingShops(validEstimateId, validLocation, validCriteria);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('aiScore');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] BodyShopMatchingService: Finding matching shops for estimate ${validEstimateId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Shop matching completed`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
            expect(mockClient.matchShops).toHaveBeenCalledWith(validEstimateId, validLocation, validCriteria);
        });

        it('should throw BodyShopMatchingServiceError for invalid estimateId format', async () => {
            const invalidEstimateId = 'bad-uuid';
            await expect(service.findMatchingShops(invalidEstimateId, validLocation)).rejects.toThrow(BodyShopMatchingServiceError);
            await expect(service.findMatchingShops(invalidEstimateId, validLocation)).rejects.toThrow('Invalid estimate ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for findMatchingShops input'), expect.any(z.ZodError));
            expect(mockClient.matchShops).not.toHaveBeenCalled(); // Should fail validation before calling client
        });

        it('should throw BodyShopMatchingServiceError for missing location', async () => {
            await expect(service.findMatchingShops(validEstimateId, '')).rejects.toThrow(BodyShopMatchingServiceError);
            await expect(service.findMatchingShops(validEstimateId, '')).rejects.toThrow('Location is required'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for findMatchingShops input'), expect.any(z.ZodError));
            expect(mockClient.matchShops).not.toHaveBeenCalled();
        });

        it('should throw BodyShopMatchingServiceError if AI client fails to find shops', async () => {
            mockClient.findShops.mockRejectedValueOnce(new Error('AI client communication error'));

            await expect(service.findMatchingShops(validEstimateId, validLocation)).rejects.toThrow(BodyShopMatchingServiceError);
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

    // --- evaluateShopCompatibility Tests ---
    describe('evaluateShopCompatibility', () => {
        const validShopId = 's1h2i3j4-k5l6-7m8n-o9p0-q1r2s3t4u5v6'; // Valid UUID
        const validEstimateId = 'e1f2g3h4-i5j6-7k8l-9m0n-1o2p3q4r5s6t'; // Valid UUID
        const validDetails = { userPreference: 'fast_turnaround' };

        it('should evaluate shop compatibility successfully for valid input', async () => {
            const result = await service.evaluateShopCompatibility(validShopId, validEstimateId, validDetails);

            expect(result).toHaveProperty('compatibilityScore');
            expect(result.compatibilityScore).toBeGreaterThanOrEqual(0.75); // Based on mock logic
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] BodyShopMatchingService: Evaluating compatibility for shop ${validShopId} with estimate ${validEstimateId}.`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Shop compatibility evaluated in`));
            expect(logger.warn).not.toHaveBeenCalled();
            expect(mockClient.evaluateCompatibility).toHaveBeenCalledWith(validShopId, validEstimateId, validDetails);
        });

        it('should throw BodyShopMatchingServiceError for invalid shopId format', async () => {
            const invalidShopId = 'bad-shop-id';
            await expect(service.evaluateShopCompatibility(invalidShopId, validEstimateId)).rejects.toThrow(BodyShopMatchingServiceError);
            await expect(service.evaluateShopCompatibility(invalidShopId, validEstimateId)).rejects.toThrow('Invalid shop ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for evaluateShopCompatibility input'), expect.any(z.ZodError));
            expect(mockClient.evaluateCompatibility).not.toHaveBeenCalled();
        });

        it('should throw BodyShopMatchingServiceError for invalid estimateId format', async () => {
            const invalidEstimateId = 'bad-estimate-id';
            await expect(service.evaluateShopCompatibility(validShopId, invalidEstimateId)).rejects.toThrow(BodyShopMatchingServiceError);
            await expect(service.evaluateShopCompatibility(validShopId, invalidEstimateId)).rejects.toThrow('Invalid estimate ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for evaluateShopCompatibility input'), expect.any(z.ZodError));
            expect(mockClient.evaluateCompatibility).not.toHaveBeenCalled();
        });

        it('should throw BodyShopMatchingServiceError if AI client fails to evaluate compatibility', async () => {
            mockClient.evaluateCompatibility.mockRejectedValueOnce(new Error('AI compatibility service down'));

            await expect(service.evaluateShopCompatibility(validShopId, validEstimateId)).rejects.toThrow(BodyShopMatchingServiceError);
            await expect(service.evaluateShopCompatibility(validShopId, validEstimateId)).rejects.toThrow(`Failed to evaluate shop compatibility.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to evaluate compatibility for shop ${validShopId} with estimate ${validEstimateId}`), expect.any(Error));
        });

        it('should log a warning if evaluateShopCompatibility response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay
                return {} as any;
            });

            await service.evaluateShopCompatibility(validShopId, validEstimateId);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Compatibility response time exceeded 500ms'));
        });
    });
});