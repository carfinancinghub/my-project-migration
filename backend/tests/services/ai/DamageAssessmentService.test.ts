/*
File: DamageAssessmentService.test.ts
Path: C:\CFH\backend\tests\services\ai\DamageAssessmentService.test.ts
Created: 2025-07-04 04:17 PM PDT // Dynamically generated current PDT time
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for DamageAssessmentService with skeleton tests.
Artifact ID: g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5v6
Version ID: h2i3j4k5-l6m7-n8o9-p0q1-r2s3t4u5v6w7 // New unique ID for version 1.0
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { damageAssessmentService, DamageAssessmentServiceError } from '@/backend/services/ai/DamageAssessmentService';
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

// Mock the internal MockDamageAssessmentClient
const mockClient = {
    analyzeDamage: jest.fn(),
    generateReport: jest.fn(),
};


describe('DamageAssessmentService', () => {
    let service: typeof damageAssessmentService;

    beforeEach(() => {
        // Create a new instance, injecting our mocks
        service = new (damageAssessmentService as any).constructor(mockClient);
        jest.clearAllMocks();
        // Reset mock implementations for client methods
        mockClient.analyzeDamage.mockReset();
        mockClient.generateReport.mockReset();

        // Default successful mock responses for client methods
        mockClient.analyzeDamage.mockResolvedValue({
            severity: 'moderate',
            detectedAreas: ['front bumper'],
            estimatedPartsCost: 1500,
            estimatedLaborHours: 10,
            confidence: 0.90
        });
        mockClient.generateReport.mockResolvedValue({
            reportId: 'mock-report-id',
            summary: 'Mock damage report summary',
            pdfUrl: 'http://mock.pdf/report.pdf'
        });

        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- assessDamage Tests ---
    describe('assessDamage', () => {
        const validEstimateId = 'e1f2g3h4-i5j6-7k8l-9m0n-1o2p3q4r5s6t'; // Valid UUID
        const validPhotos = ['http://example.com/photo1.jpg', 'http://example.com/photo2.jpg'];

        it('should assess damage successfully for valid input', async () => {
            const result = await service.assessDamage(validPhotos, validEstimateId);

            expect(result).toHaveProperty('severity', 'moderate');
            expect(result).toHaveProperty('detectedAreas');
            expect(result.detectedAreas.length).toBeGreaterThan(0);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] DamageAssessmentService: Assessing damage for estimate ${validEstimateId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Damage assessment completed`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
            expect(mockClient.analyzeDamage).toHaveBeenCalledWith(validPhotos, validEstimateId);
        });

        it('should throw DamageAssessmentServiceError for invalid estimateId format', async () => {
            const invalidEstimateId = 'bad-uuid';
            await expect(service.assessDamage(validPhotos, invalidEstimateId)).rejects.toThrow(DamageAssessmentServiceError);
            await expect(service.assessDamage(validPhotos, invalidEstimateId)).rejects.toThrow('Invalid estimate ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for assessDamage input'), expect.any(z.ZodError));
            expect(mockClient.analyzeDamage).not.toHaveBeenCalled(); // Should fail validation before calling client
        });

        it('should throw DamageAssessmentServiceError for empty photo URLs array', async () => {
            await expect(service.assessDamage([], validEstimateId)).rejects.toThrow(DamageAssessmentServiceError);
            await expect(service.assessDamage([], validEstimateId)).rejects.toThrow('At least one photo URL is required for assessment'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for assessDamage input'), expect.any(z.ZodError));
            expect(mockClient.analyzeDamage).not.toHaveBeenCalled();
        });

        it('should throw DamageAssessmentServiceError if AI client fails to analyze damage', async () => {
            mockClient.analyzeDamage.mockRejectedValueOnce(new Error('AI client communication error'));

            await expect(service.assessDamage(validPhotos, validEstimateId)).rejects.toThrow(DamageAssessmentServiceError);
            await expect(service.assessDamage(validPhotos, validEstimateId)).rejects.toThrow(`Failed to assess damage for estimate ${validEstimateId}.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to assess damage for estimate ${validEstimateId}`), expect.any(Error));
        });

        it('should log a warning if assessDamage response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay for internal client call
                return {} as any;
            });

            await service.assessDamage(validPhotos, validEstimateId);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Assessment response time exceeded 500ms'));
        });
    });

    // --- generateDamageReport Tests ---
    describe('generateDamageReport', () => {
        const validEstimateId = 'r1s2t3u4-v5w6-7x8y-9z0a-1b2c3d4e5f6g'; // Valid UUID
        const validDamageData = { severity: 'critical', detectedAreas: ['engine'] }; // Example output from assessDamage

        it('should generate a damage report successfully for valid input', async () => {
            const result = await service.generateDamageReport(validDamageData, validEstimateId);

            expect(result).toHaveProperty('reportId', 'mock-uuid-correlation-id'); // from uuid mock
            expect(result).toHaveProperty('summary');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] DamageAssessmentService: Generating damage report for estimate ${validEstimateId}.`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Report generated in`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
            expect(mockClient.generateReport).toHaveBeenCalledWith(validDamageData, validEstimateId);
        });

        it('should throw DamageAssessmentServiceError for invalid estimateId format', async () => {
            const invalidEstimateId = 'another-bad-uuid';
            await expect(service.generateDamageReport(validDamageData, invalidEstimateId)).rejects.toThrow(DamageAssessmentServiceError);
            await expect(service.generateDamageReport(validDamageData, invalidEstimateId)).rejects.toThrow('Invalid estimate ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for generateDamageReport input'), expect.any(z.ZodError));
            expect(mockClient.generateReport).not.toHaveBeenCalled();
        });

        it('should throw DamageAssessmentServiceError if AI client fails to generate report', async () => {
            mockClient.generateReport.mockRejectedValueOnce(new Error('Report generation service down'));

            await expect(service.generateDamageReport(validDamageData, validEstimateId)).rejects.toThrow(DamageAssessmentServiceError);
            await expect(service.generateDamageReport(validDamageData, validEstimateId)).rejects.toThrow(`Failed to generate damage report for estimate ${validEstimateId}.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to generate damage report for estimate ${validEstimateId}`), expect.any(Error));
        });

        it('should log a warning if generateDamageReport response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay
                return {} as any;
            });

            await service.generateDamageReport(validDamageData, validEstimateId);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Report generation response time exceeded 500ms'));
        });
    });
});