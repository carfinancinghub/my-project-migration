/*
File: aiJobPredictorService.test.ts
Path: C:\CFH\backend\tests\services\ai/aiJobPredictorService.test.ts
Created: 2025-07-04 05:20 PM PDT // Dynamically generated current PDT time
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for aiJobPredictorService with skeleton tests.
Artifact ID: s9t0u1v2-w3x4-y5z6-a7b8-c9d0e1f2g3h4
Version ID: t0u1v2w3-x4y5-z6a7-b8c9-d0e1f2g3h4i5 // New unique ID for version 1.0
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { jobPredictorService, JobPredictorServiceError } from '@/backend/services/ai/aiJobPredictorService';
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

// Mock the internal MockJobPredictorClient
const mockClient = {
    predictDuration: jest.fn(),
    suggestSchedule: jest.fn(),
};


describe('aiJobPredictorService', () => {
    let service: typeof jobPredictorService;

    beforeEach(() => {
        // Create a new instance, injecting our mocks
        service = new (jobPredictorService as any).constructor(mockClient);
        jest.clearAllMocks();
        // Reset mock implementations for client methods
        mockClient.predictDuration.mockReset();
        mockClient.suggestSchedule.mockReset();

        // Default successful mock responses for client methods
        mockClient.predictDuration.mockResolvedValue({
            durationHours: 25,
            confidence: 0.9,
            factors: ['damage complexity']
        });
        mockClient.suggestSchedule.mockResolvedValue({
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            optimalSlot: 'Monday 9 AM'
        });

        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- predictJobDuration Tests ---
    describe('predictJobDuration', () => {
        const validJobId = 'j1o2b3d4-u5r6-7a8t-9i0o-1n2e3x4y5z6a'; // Valid UUID
        const mockJobDetails = { damage: 'front', vehicleType: 'sedan' };

        it('should predict job duration successfully for valid input', async () => {
            const result = await service.predictJobDuration(validJobId, mockJobDetails);

            expect(result).toHaveProperty('durationHours');
            expect(result).toHaveProperty('confidence');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] JobPredictorService: Predicting job duration for job ${validJobId}.`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Job duration predicted in`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
            expect(mockClient.predictDuration).toHaveBeenCalledWith(validJobId, mockJobDetails);
        });

        it('should throw JobPredictorServiceError for invalid jobId format', async () => {
            const invalidJobId = 'bad-job-id';
            await expect(service.predictJobDuration(invalidJobId, mockJobDetails)).rejects.toThrow(JobPredictorServiceError);
            await expect(service.predictJobDuration(invalidJobId, mockJobDetails)).rejects.toThrow('Invalid job ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for predictJobDuration input'), expect.any(z.ZodError));
            expect(mockClient.predictDuration).not.toHaveBeenCalled(); // Should fail validation before calling client
        });

        it('should throw JobPredictorServiceError if AI client fails to predict duration', async () => {
            mockClient.predictDuration.mockRejectedValueOnce(new Error('AI prediction service down'));

            await expect(service.predictJobDuration(validJobId, mockJobDetails)).rejects.toThrow(JobPredictorServiceError);
            await expect(service.predictJobDuration(validJobId, mockJobDetails)).rejects.toThrow(`Failed to predict job duration.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to predict job duration for job ${validJobId}`), expect.any(Error));
        });

        it('should log a warning if predictJobDuration response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay for internal client call
                return {} as any;
            });

            await service.predictJobDuration(validJobId, mockJobDetails);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Prediction response time exceeded 500ms'));
        });
    });

    // --- suggestJobSchedule Tests ---
    describe('suggestJobSchedule', () => {
        const validJobId = 'j1o2b3d4-u5r6-7a8t-9i0o-1n2e3x4y5z6b'; // Valid UUID
        const mockJobDetails = { damage: 'side', vehicleType: 'SUV' };
        const mockShopAvailability = { technicianA: ['9-12'], technicianB: ['1-5'] };

        it('should suggest job schedule successfully for valid input', async () => {
            const result = await service.suggestJobSchedule(validJobId, mockJobDetails, mockShopAvailability);

            expect(result).toHaveProperty('startDate');
            expect(result).toHaveProperty('endDate');
            expect(result).toHaveProperty('optimalSlot');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] JobPredictorService: Suggesting job schedule for job ${validJobId}.`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Job schedule suggested in`));
            expect(logger.warn).not.toHaveBeenCalled();
            expect(mockClient.suggestSchedule).toHaveBeenCalledWith(validJobId, mockJobDetails, mockShopAvailability);
        });

        it('should throw JobPredictorServiceError for invalid jobId format', async () => {
            const invalidJobId = 'another-bad-id';
            await expect(service.suggestJobSchedule(invalidJobId, mockJobDetails, mockShopAvailability)).rejects.toThrow(JobPredictorServiceError);
            await expect(service.suggestJobSchedule(invalidJobId, mockJobDetails, mockShopAvailability)).rejects.toThrow('Invalid job ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for suggestJobSchedule input'), expect.any(z.ZodError));
            expect(mockClient.suggestSchedule).not.toHaveBeenCalled();
        });

        it('should throw JobPredictorServiceError if AI client fails to suggest schedule', async () => {
            mockClient.suggestSchedule.mockRejectedValueOnce(new Error('AI scheduling service error'));

            await expect(service.suggestJobSchedule(validJobId, mockJobDetails, mockShopAvailability)).rejects.toThrow(JobPredictorServiceError);
            await expect(service.suggestJobSchedule(validJobId, mockJobDetails, mockShopAvailability)).rejects.toThrow(`Failed to suggest job schedule.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to suggest job schedule for job ${validJobId}`), expect.any(Error));
        });

        it('should log a warning if suggestJobSchedule response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay
                return {} as any;
            });

            await service.suggestJobSchedule(validJobId, mockJobDetails, mockShopAvailability);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Scheduling response time exceeded 500ms'));
        });
    });
});