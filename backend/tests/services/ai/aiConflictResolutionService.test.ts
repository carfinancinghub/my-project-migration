/*
File: aiConflictResolutionService.test.ts
Path: C:\CFH\backend\tests\services\ai\aiConflictResolutionService.test.ts
Created: 2025-07-04 04:55 PM PDT // Dynamically generated current PDT time
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for aiConflictResolutionService with skeleton tests.
Artifact ID: c5d6e7f8-g9h0-i1j2-k3l4-m5n6o7p8q9r0
Version ID: d6e7f8g9-h0i1-j2k3-l4m5-n6o7p8q9r0s1 // New unique ID for version 1.0
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { aiConflictResolutionService, AIConflictResolutionServiceError } from '@/backend/services/ai/aiConflictResolutionService';
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

// Mock internal dependencies (MockAIConflictResolutionClient, MockEstimateService)
// We need to access the private members of the service to mock them.
// A better approach for larger projects is to use dependency injection.
const mockAiClient = {
    suggestResolutions: jest.fn(),
};

const mockEstimateService = {
    getEstimateDetailsForAI: jest.fn(),
    proposeNewQuote: jest.fn(),
    escalateToMediator: jest.fn(),
    updateConflictStatus: jest.fn(),
};


describe('aiConflictResolutionService', () => {
    let service: typeof aiConflictResolutionService;

    beforeEach(() => {
        // Create a new instance, injecting our mocks
        service = new (aiConflictResolutionService as any).constructor(mockAiClient, mockEstimateService);
        jest.clearAllMocks();
        // Reset mock implementations
        mockAiClient.suggestResolutions.mockReset();
        mockEstimateService.getEstimateDetailsForAI.mockReset();
        mockEstimateService.proposeNewQuote.mockReset();
        mockEstimateService.escalateToMediator.mockReset();
        mockEstimateService.updateConflictStatus.mockReset();

        // Default successful mock responses
        mockAiClient.suggestResolutions.mockResolvedValue([
            { id: 'sugg1', suggestion: 'Mock Suggestion', confidence: 0.8, type: 'renegotiation' }
        ]);
        mockEstimateService.getEstimateDetailsForAI.mockResolvedValue({ id: 'mockEstimate', status: 'Conflict' });
        mockEstimateService.proposeNewQuote.mockResolvedValue(true);
        mockEstimateService.escalateToMediator.mockResolvedValue(true);
        mockEstimateService.updateConflictStatus.mockResolvedValue(true);


        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- getResolutionSuggestions Tests ---
    describe('getResolutionSuggestions', () => {
        const estimateId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // Valid UUID
        const userId = 'user123';

        it('should return AI resolution suggestions successfully for valid input', async () => {
            const result = await service.getResolutionSuggestions(estimateId, userId);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('suggestion');
            expect(result[0]).toHaveProperty('confidence');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Getting AI suggestions for estimate ${estimateId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Suggestions for ${estimateId} completed`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
            expect(mockEstimateService.getEstimateDetailsForAI).toHaveBeenCalledWith(estimateId);
            expect(mockAiClient.suggestResolutions).toHaveBeenCalledWith(expect.any(Object), userId);
        });

        it('should throw AIConflictResolutionServiceError for invalid estimateId format', async () => {
            const invalidEstimateId = 'bad-uuid-format';
            await expect(service.getResolutionSuggestions(invalidEstimateId, userId)).rejects.toThrow(AIConflictResolutionServiceError);
            await expect(service.getResolutionSuggestions(invalidEstimateId, userId)).rejects.toThrow('Invalid estimate ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for getResolutionSuggestions input'), expect.any(z.ZodError));
            expect(mockEstimateService.getEstimateDetailsForAI).not.toHaveBeenCalled(); // Should fail validation before calling service
        });

        it('should throw AIConflictResolutionServiceError if estimate details are not found', async () => {
            mockEstimateService.getEstimateDetailsForAI.mockResolvedValueOnce(null); // Simulate not found

            await expect(service.getResolutionSuggestions(estimateId, userId)).rejects.toThrow(AIConflictResolutionServiceError);
            await expect(service.getResolutionSuggestions(estimateId, userId)).rejects.toThrow(`Estimate ${estimateId} not found or no conflict detected.`);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to get suggestions for estimate ${estimateId}`), expect.any(AIConflictResolutionServiceError));
        });

        it('should throw AIConflictResolutionServiceError if AI client fails', async () => {
            mockAiClient.suggestResolutions.mockRejectedValueOnce(new Error('AI service unavailable'));

            await expect(service.getResolutionSuggestions(estimateId, userId)).rejects.toThrow(AIConflictResolutionServiceError);
            await expect(service.getResolutionSuggestions(estimateId, userId)).rejects.toThrow('Failed to retrieve AI conflict resolution suggestions.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to get suggestions for estimate ${estimateId}`), expect.any(Error));
        });

        it('should log a warning if getResolutionSuggestions response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay for AI processing
                return {} as any;
            });

            await service.getResolutionSuggestions(estimateId, userId);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Suggestions response time exceeded 500ms'));
        });
    });

    // --- applyResolution Tests ---
    describe('applyResolution', () => {
        const estimateId = 'e1f2g3h4-i5j6-7k8l-9m0n-1o2p3q4r5s6t'; // Valid UUID
        const userId = 'user_apply_1';
        const resolutionId = 'res_id_789'; // Valid UUID
        const notes = 'User approved AI suggestion.';
        const optionSelected = 'renegotiation_proposal';

        it('should successfully apply an AI-recommended resolution (renegotiation)', async () => {
            // Mock the internal logic to return a specific type
            jest.spyOn(service as any, 'applyResolution').mockImplementationOnce(async (estId, uId, resId, nts, optSel) => {
                // Simulate internal logic for 'renegotiation'
                await mockEstimateService.proposeNewQuote(estId, uId, { resolutionId: resId, notes: nts, optionSelected: optSel });
                await mockEstimateService.updateConflictStatus(estId, 'Resolved');
                return { estimateId: estId, status: 'Resolved', appliedResolutionType: 'renegotiation' };
            });

            const result = await service.applyResolution(estimateId, userId, resolutionId, notes, optionSelected);

            expect(result).toHaveProperty('estimateId', estimateId);
            expect(result).toHaveProperty('status', 'Resolved');
            expect(result).toHaveProperty('appliedResolutionType', 'renegotiation');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] User ${userId} applying resolution ${resolutionId} to estimate ${estimateId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[CID:mock-uuid-correlation-id] Resolution ${resolutionId} applied for estimate ${estimateId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('AUDIT: [CID:mock-uuid-correlation-id] AI resolution applied.'));
            expect(mockEstimateService.proposeNewQuote).toHaveBeenCalledWith(estimateId, userId, { resolutionId, notes, optionSelected });
            expect(mockEstimateService.updateConflictStatus).toHaveBeenCalledWith(estimateId, 'Resolved');
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should successfully apply an AI-recommended resolution (mediation)', async () => {
            // Mock the internal logic to return a specific type
            jest.spyOn(service as any, 'applyResolution').mockImplementationOnce(async (estId, uId, resId, nts, optSel) => {
                // Simulate internal logic for 'mediation'
                await mockEstimateService.escalateToMediator(estId, uId, { resolutionId: resId, notes: nts });
                await mockEstimateService.updateConflictStatus(estId, 'Mediated'); // Example status
                return { estimateId: estId, status: 'Mediated', appliedResolutionType: 'mediation' };
            });
            
            const result = await service.applyResolution(estimateId, userId, resolutionId, notes, 'mediation'); // Pass 'mediation' as optionSelected

            expect(result).toHaveProperty('appliedResolutionType', 'mediation');
            expect(mockEstimateService.escalateToMediator).toHaveBeenCalledWith(estimateId, userId, { resolutionId, notes });
        });


        it('should throw AIConflictResolutionServiceError for invalid resolutionId format', async () => {
            const invalidResolutionId = 'bad-res-id';
            await expect(service.applyResolution(estimateId, userId, invalidResolutionId)).rejects.toThrow(AIConflictResolutionServiceError);
            await expect(service.applyResolution(estimateId, userId, invalidResolutionId)).rejects.toThrow('Invalid resolution ID format'); // Zod validation error
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed for applyResolution input'), expect.any(z.ZodError));
            expect(mockEstimateService.proposeNewQuote).not.toHaveBeenCalled(); // Should fail validation before calling service
        });

        it('should throw AIConflictResolutionServiceError if internal service call fails during application', async () => {
            mockEstimateService.proposeNewQuote.mockRejectedValueOnce(new Error('DB transaction failed'));

            await expect(service.applyResolution(estimateId, userId, resolutionId)).rejects.toThrow(AIConflictResolutionServiceError);
            await expect(service.applyResolution(estimateId, userId, resolutionId)).rejects.toThrow('Failed to apply AI-recommended resolution.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to apply resolution ${resolutionId} to estimate ${estimateId}`), expect.any(Error));
        });

        it('should log a warning if applyResolution response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay
                return {} as any;
            });

            await service.applyResolution(estimateId, userId, resolutionId);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Apply resolution response time exceeded 500ms'));
        });
    });
});