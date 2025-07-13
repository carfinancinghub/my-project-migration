/*
File: PartsOrderService.test.ts
Path: C:\CFH\backend\tests\services\ai\PartsOrderService.test.ts
Created: 2025-07-04 05:01 PM PDT // Dynamically generated current PDT time
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for PartsOrderService with skeleton tests.
Artifact ID: o3p4q5r6-s7t8-u9v0-w1x2-y3z4a5b6c7d8
Version ID: p4q5r6s7-t8u9-v0w1-x2y3-z4a5b6c7d8e9 // New unique ID for version 1.0
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { partsOrderService, PartsOrderServiceError } from '@/backend/services/ai/PartsOrderService';
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

// Mock the internal MockPartsOrderClient
const mockClient = {
    requestParts: jest.fn(),
    trackOrderStatus: jest.fn(),
};


describe('PartsOrderService', () => {
    let service: typeof partsOrderService;

    beforeEach(() => {
        // Create a new instance, injecting our mocks
        service = new (partsOrderService as any).constructor(mockClient);
        jest.clearAllMocks();
        // Reset mock implementations for client methods
        mockClient.requestParts.mockReset();
        mockClient.trackOrderStatus.mockReset();

        // Default successful mock responses for client methods
        mockClient.requestParts.mockResolvedValue({
            orderId: 'mock-order-id-req',
            status: 'pending',
            estimatedDeliveryDate: new Date().toISOString(),
            totalCost: 100
        });
        mockClient.trackOrderStatus.mockResolvedValue({
            orderId: 'mock-order-id-track',
            status: 'shipped',
            eta: new Date().toISOString(),
        });

        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- requestParts Tests ---
    describe('requestParts', () => {
        const validEstimateId = 'e1f2g3h4-i5j6-7k8l-9m0n-1o2p3q4r5s6t'; // Valid UUID
        const validPartsList = [{ partName: 'Bumper', quantity: 1, price: 100 }, { partName: 'Headlight', quantity: 2, price: 50 }];

        it('should request parts successfully for valid input', async () => {
            const result = await service.requestParts(validEstimateId, validPartsList);

            expect(result).toHaveProperty('orderId');
            expect(result).toHaveProperty('status', 'pending');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] PartsOrderService: Requesting parts for estimate ${validEstimateId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Parts request completed`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
            expect(mockClient.requestParts).toHaveBeenCalledWith(validEstimateId, validPartsList);
        });

        it('should throw PartsOrderServiceError for invalid estimateId format', async () => {
            const invalidEstimateId = 'bad-uuid';
            await expect(service.requestParts(invalidEstimateId, validPartsList)).rejects.toThrow(PartsOrderServiceError);
            await expect(service.requestParts(invalidEstimateId, validPartsList)).rejects.toThrow('Invalid estimate ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for requestParts input'), expect.any(z.ZodError));
            expect(mockClient.requestParts).not.toHaveBeenCalled(); // Should fail validation before calling client
        });

        it('should throw PartsOrderServiceError for empty partsList', async () => {
            await expect(service.requestParts(validEstimateId, [])).rejects.toThrow(PartsOrderServiceError);
            await expect(service.requestParts(validEstimateId, [])).rejects.toThrow('At least one part is required to order.'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for requestParts input'), expect.any(z.ZodError));
            expect(mockClient.requestParts).not.toHaveBeenCalled();
        });

        it('should throw PartsOrderServiceError if partsOrderClient fails to request parts', async () => {
            mockClient.requestParts.mockRejectedValueOnce(new Error('Supplier API down'));

            await expect(service.requestParts(validEstimateId, validPartsList)).rejects.toThrow(PartsOrderServiceError);
            await expect(service.requestParts(validEstimateId, validPartsList)).rejects.toThrow(`Failed to request parts.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to request parts for estimate ${validEstimateId}`), expect.any(Error));
        });

        it('should log a warning if requestParts response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay for internal client call
                return {} as any;
            });

            await service.requestParts(validEstimateId, validPartsList);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Request response time exceeded 500ms'));
        });
    });

    // --- trackOrderStatus Tests ---
    describe('trackOrderStatus', () => {
        const validOrderId = 't1u2v3w4-x5y6-7z8a-9b0c-1d2e3f4g5h6i'; // Valid UUID

        it('should track order status successfully for valid input', async () => {
            const result = await service.trackOrderStatus(validOrderId);

            expect(result).toHaveProperty('orderId', validOrderId);
            expect(result).toHaveProperty('status');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] PartsOrderService: Tracking order status for order ${validOrderId}.`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Order status tracked in`));
            expect(logger.warn).not.toHaveBeenCalled();
            expect(mockClient.trackOrderStatus).toHaveBeenCalledWith(validOrderId);
        });

        it('should throw PartsOrderServiceError for invalid orderId format', async () => {
            const invalidOrderId = 'bad-order-id';
            await expect(service.trackOrderStatus(invalidOrderId)).rejects.toThrow(PartsOrderServiceError);
            await expect(service.trackOrderStatus(invalidOrderId)).rejects.toThrow('Invalid order ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for trackOrderStatus input'), expect.any(z.ZodError));
            expect(mockClient.trackOrderStatus).not.toHaveBeenCalled();
        });

        it('should throw PartsOrderServiceError if partsOrderClient fails to track status', async () => {
            mockClient.trackOrderStatus.mockRejectedValueOnce(new Error('Tracking API error'));

            await expect(service.trackOrderStatus(validOrderId)).rejects.toThrow(PartsOrderServiceError);
            await expect(service.trackOrderStatus(validOrderId)).rejects.toThrow(`Failed to track order status.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to track order status for order ${validOrderId}`), expect.any(Error));
        });

        it('should log a warning if trackOrderStatus response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay
                return {} as any;
            });

            await service.trackOrderStatus(validOrderId);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Tracking response time exceeded 500ms'));
        });
    });
});