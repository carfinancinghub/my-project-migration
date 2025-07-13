/*
File: aiDamageAssessmentService.test.ts
Path: C:\CFH\backend\tests\services\ai\aiDamageAssessmentService.test.ts
Created: 2025-07-04 12:00 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for aiDamageAssessmentService with Wow++ features and performance checks.
Artifact ID: w7x8y9z0-a1b2-c3d4-e5f6-g7h8i9j0k1l2
Version ID: x8y9z0a1-b2c3-d4e5-f6g7-h8i9j0k1l2m3
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { aiDamageAssessmentService, AIDamageAssessmentServiceError } from '@/backend/services/ai/aiDamageAssessmentService';
import { z } from 'zod'; // ZodError for validation checks

// Mock the logger to prevent console output during tests and spy on calls
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

// Mock internal dependencies if they were real (e.g., imageProcessingService, aiModelClient)
// For now, the service uses mock data internally, so we test its public interface directly.

describe('aiDamageAssessmentService', () => {
    let service: typeof aiDamageAssessmentService;

    beforeEach(() => {
        service = new (aiDamageAssessmentService as any).constructor(); // Create a new instance for each test
        jest.clearAllMocks();
        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- Wow++ Tier: assessDamage ---
    describe('assessDamage', () => {
        const estimateId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // Valid UUID
        const photos = ['http://example.com/photo1.jpg', 'http://example.com/photo2.jpg'];

        it('should successfully assess damage for valid input', async () => {
            // If internal services were mocked:
            // (imageProcessingService.processPhotosForAI as jest.Mock).mockResolvedValueOnce(['processed_data']);
            // (aiModelClient.predictDamage as jest.Mock).mockResolvedValueOnce({
            //     summary: 'AI detected...', estimatedCost: 3000, confidence: 0.9
            // });

            const result = await service.assessDamage(estimateId, photos);

            expect(result).toHaveProperty('estimateId', estimateId);
            expect(result).toHaveProperty('summary');
            expect(result).toHaveProperty('estimatedCost');
            expect(result).toHaveProperty('confidence');
            expect(result.confidence).toBeGreaterThanOrEqual(0.7); // Based on mock logic
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Initiating damage assessment for estimate ${estimateId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Damage assessment for estimate ${estimateId} completed`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
        });

        it('should throw AIDamageAssessmentServiceError for invalid estimateId format', async () => {
            const invalidEstimateId = 'invalid-uuid';
            await expect(service.assessDamage(invalidEstimateId, photos)).rejects.toThrow(AIDamageAssessmentServiceError);
            await expect(service.assessDamage(invalidEstimateId, photos)).rejects.toThrow('Invalid estimate ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for assessDamage input'), expect.any(z.ZodError));
        });

        it('should throw AIDamageAssessmentServiceError for missing photo URLs', async () => {
            await expect(service.assessDamage(estimateId, [])).rejects.toThrow(AIDamageAssessmentServiceError);
            await expect(service.assessDamage(estimateId, [])).rejects.toThrow('At least one photo URL is required'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for assessDamage input'), expect.any(z.ZodError));
        });

        it('should throw AIDamageAssessmentServiceError if AI processing fails', async () => {
            // Simulate an internal AI service call failure
            const originalAssessDamage = service.assessDamage;
            service.assessDamage = jest.fn().mockImplementationOnce(() => {
                throw new Error('Simulated AI model error');
            });

            await expect(service.assessDamage(estimateId, photos)).rejects.toThrow(AIDamageAssessmentServiceError);
            await expect(service.assessDamage(estimateId, photos)).rejects.toThrow('Failed to perform AI damage assessment.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to assess damage for estimate ${estimateId}`), expect.any(Error));

            service.assessDamage = originalAssessDamage; // Restore original method
        });

        it('should log a warning if assessDamage response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay for AI processing
                return {} as any;
            });

            await service.assessDamage(estimateId, photos);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Damage assessment response time exceeded 500ms'));
        });
    });

    // --- Wow++ Tier: suggestResolutionAlternatives ---
    describe('suggestResolutionAlternatives', () => {
        const estimateId = 'e1f2g3h4-i5j6-7k8l-9m0n-1o2p3q4r5s6t'; // Valid UUID

        it('should successfully suggest resolution alternatives for valid input', async () => {
            // If internal services were mocked:
            // (aiModelClient.suggestAlternatives as jest.Mock).mockResolvedValueOnce(['alternative 1', 'alternative 2']);

            const result = await service.suggestResolutionAlternatives(estimateId);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Suggesting resolution alternatives for estimate ${estimateId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Resolution alternatives for estimate ${estimateId} completed`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should throw AIDamageAssessmentServiceError for invalid estimateId format', async () => {
            const invalidEstimateId = 'bad-id';
            await expect(service.suggestResolutionAlternatives(invalidEstimateId)).rejects.toThrow(AIDamageAssessmentServiceError);
            await expect(service.suggestResolutionAlternatives(invalidEstimateId)).rejects.toThrow('Invalid estimate ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for suggestResolutionAlternatives input'), expect.any(z.ZodError));
        });

        it('should throw AIDamageAssessmentServiceError if AI processing for alternatives fails', async () => {
            const originalSuggestResolutionAlternatives = service.suggestResolutionAlternatives;
            service.suggestResolutionAlternatives = jest.fn().mockImplementationOnce(() => {
                throw new Error('Simulated alternative generation failure');
            });

            await expect(service.suggestResolutionAlternatives(estimateId)).rejects.toThrow(AIDamageAssessmentServiceError);
            await expect(service.suggestResolutionAlternatives(estimateId)).rejects.toThrow('Failed to suggest resolution alternatives.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to suggest alternatives for estimate ${estimateId}`), expect.any(Error));

            service.suggestResolutionAlternatives = originalSuggestResolutionAlternatives; // Restore original
        });

        it('should log a warning if suggestResolutionAlternatives response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay
                return {} as any;
            });

            await service.suggestResolutionAlternatives(estimateId);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Resolution alternatives response time exceeded 500ms'));
        });
    });
});