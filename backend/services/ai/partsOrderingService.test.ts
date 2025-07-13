/*
File: partsOrderingService.test.ts
Path: C:\CFH\backend\tests\services\ai/partsOrderingService.test.ts
Created: 2025-07-04 05:40 PM PDT // Dynamically generated current PDT time
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for partsOrderingService with skeleton tests.
Artifact ID: w5x6y7z8-a9b0-c1d2-e3f4-g5h6i7j8k9l0
Version ID: x6y7z8a9-b0c1-d2e3-f4g5-h6i7j8k9l0m1 // New unique ID for version 1.0
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { partsOrderingService, PartsOrderingServiceError } from '@/backend/services/ai/partsOrderingService';
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

// Mock the internal MockOrderingClient
const mockClient = {
    placeOrder: jest.fn(),
    trackOrderStatus: jest.fn(),
};


describe('partsOrderingService', () => {
    let service: typeof partsOrderingService;

    beforeEach(() => {
        // Create a new instance, injecting our mocks
        service = new (partsOrderingService as any).constructor(mockClient);
        jest.clearAllMocks();
        // Reset mock implementations for client methods
        mockClient.placeOrder.mockReset();
        mockClient.trackOrderStatus.mockReset();

        // Default successful mock responses for client methods
        mockClient.placeOrder.mockResolvedValue({
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

    // --- placeOrder Tests ---
    describe('placeOrder', () => {
        const validJobId = 'j1o2b3d4-u5r6-7a8t-9i0o-1n2e3x4y5z6a'; // Valid UUID
        const validOrderDetails = {
            parts: [{ partName: 'Bumper', quantity: 1, price: 100 }, { partName: 'Headlight', quantity: 2, price: 50 }]
        };

        it('should place order successfully for valid input', async () => {
            const result = await service.placeOrder(validJobId, validOrderDetails);

            expect(result).toHaveProperty('orderId');
            expect(result).toHaveProperty('status', 'pending');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] PartsOrderingService: Placing order for job ${validJobId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Parts order placed`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
            expect(mockClient.placeOrder).toHaveBeenCalledWith(validJobId, validOrderDetails);
        });

        it('should throw PartsOrderingServiceError for invalid jobId format', async () => {
            const invalidJobId = 'bad-job-id';
            await expect(service.placeOrder(invalidJobId, validOrderDetails)).rejects.toThrow(PartsOrderingServiceError);
            await expect(service.placeOrder(invalidJobId, validOrderDetails)).rejects.toThrow('Invalid job ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for placeOrder input'), expect.any(z.ZodError));
            expect(mockClient.placeOrder).not.toHaveBeenCalled(); // Should fail validation before calling client
        });

        it('should throw PartsOrderingServiceError for empty parts list', async () => {
            const invalidOrderDetails = { parts: [] };
            await expect(service.placeOrder(validJobId, invalidOrderDetails)).rejects.toThrow(PartsOrderingServiceError);
            await expect(service.placeOrder(validJobId, invalidOrderDetails)).rejects.toThrow('At least one part is required to order.'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for placeOrder input'), expect.any(z.ZodError));
            expect(mockClient.placeOrder).not.toHaveBeenCalled();
        });

        it('should throw PartsOrderingServiceError if partsOrderClient fails to place order', async () => {
            mockClient.placeOrder.mockRejectedValueOnce(new Error('Supplier API down'));

            await expect(service.placeOrder(validJobId, validOrderDetails)).rejects.toThrow(PartsOrderingServiceError);
            await expect(service.placeOrder(validJobId, validOrderDetails)).rejects.toThrow(`Failed to place parts order.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to place order for job ${validJobId}`), expect.any(Error));
        });

        it('should log a warning if placeOrder response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay for internal client call
                return {} as any;
            });

            await service.placeOrder(validJobId, validOrderDetails);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Placement response time exceeded 500ms'));
        });
    });

    // --- updateOrderStatus Tests ---
    describe('updateOrderStatus', () => {
        const validOrderId = 't1u2v3w4-x5y6-7z8a-9b0c-1d2e3f4g5h6i'; // Valid UUID
        const validStatusUpdate = { status: 'shipped', eta: new Date().toISOString() };

        it('should update order status successfully for valid input', async () => {
            const result = await service.updateOrderStatus(validOrderId, validStatusUpdate);

            expect(result).toHaveProperty('orderId', validOrderId);
            expect(result).toHaveProperty('status', validStatusUpdate.status);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] PartsOrderingService: Updating order status for order ${validOrderId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Order status updated in`));
            expect(logger.warn).not.toHaveBeenCalled();
            expect(mockClient.updateOrderStatus).toHaveBeenCalledWith(validOrderId, { orderId: validOrderId, ...validStatusUpdate });
        });

        it('should throw PartsOrderingServiceError for invalid orderId format', async () => {
            const invalidOrderId = 'bad-order-id';
            await expect(service.updateOrderStatus(invalidOrderId, validStatusUpdate)).rejects.toThrow(PartsOrderingServiceError);
            await expect(service.updateOrderStatus(invalidOrderId, validStatusUpdate)).rejects.toThrow('Invalid order ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for updateOrderStatus input'), expect.any(z.ZodError));
            expect(mockClient.updateOrderStatus).not.toHaveBeenCalled();
        });

        it('should throw PartsOrderingServiceError for invalid status enum', async () => {
            const invalidStatusUpdate = { status: 'invalid_status' };
            await expect(service.updateOrderStatus(validOrderId, invalidStatusUpdate as any)).rejects.toThrow(PartsOrderingServiceError);
            await expect(service.updateOrderStatus(validOrderId, invalidStatusUpdate as any)).rejects.toThrow("Invalid enum value. Expected 'pending' | 'shipped' | 'delivered' | 'delayed' | 'cancelled', received 'invalid_status'"); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for updateOrderStatus input'), expect.any(z.ZodError));
            expect(mockClient.updateOrderStatus).not.toHaveBeenCalled();
        });

        it('should throw PartsOrderingServiceError if partsOrderClient fails to update status', async () => {
            mockClient.updateOrderStatus.mockRejectedValueOnce(new Error('Tracking API error'));

            await expect(service.updateOrderStatus(validOrderId, validStatusUpdate)).rejects.toThrow(PartsOrderingServiceError);
            await expect(service.updateOrderStatus(validOrderId, validStatusUpdate)).rejects.toThrow(`Failed to update order status.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to update order status for order ${validOrderId}`), expect.any(Error));
        });

        it('should log a warning if updateOrderStatus response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay
                return {} as any;
            });

            await service.updateOrderStatus(validOrderId, validStatusUpdate);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Update response time exceeded 500ms'));
        });
    });
});