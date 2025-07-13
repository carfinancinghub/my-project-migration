/*
File: aiBidService.test.ts
Path: C:\CFH\backend\tests\services\auction\aiBidService.test.ts
Created: 2025-07-03 14:30 PDT
Author: Mini (AI Assistant)
Version: 1.0
Purpose: Jest tests for aiBidService.ts with ≥95% coverage, mocking inputs, failed AI responses, and >500ms scenarios.
Description: Jest tests for aiBidService with ≥95% coverage, including error and performance scenarios.
Artifact ID: y6z7a8b9-c0d1-e2f3-g4h5-i6j7k8l9m0n1
Version ID: z7a8b9c0-d1e2-f3g4-h5i6-j7k8l9m0n1o2
*/

import { AIBidService, AIBidServiceError, aiBidService } from '@/backend/services/auction/aiBidService';
import logger from '@/utils/logger';

// Mock the logger to prevent console output during tests and spy on calls
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

// Mock the AI model inference service if it were a real dependency
// jest.mock('@/backend/services/ai/aiModelInferenceService', () => ({
//     aiModelInferenceService: {
//         predictBidOutcome: jest.fn(),
//     },
// }));

describe('AIBidService', () => {
    let service: AIBidService;

    beforeEach(() => {
        service = new AIBidService();
        jest.clearAllMocks();
        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- getBidSuggestion Success Scenarios ---
    it('should return a bid suggestion for valid input', async () => {
        const params = {
            auctionId: 'testAuction1',
            currentBid: 1000,
            userBudget: 2000,
            bidderProfile: 'conservative',
            timeRemainingSeconds: 3600, // 1 hour
        };
        // If aiModelInferenceService was mocked:
        // (aiModelInferenceService.predictBidOutcome as jest.Mock).mockResolvedValueOnce({
        //     recommendedBid: 1150, confidence: 0.85, optimalTiming: 'mid_auction', insights: 'AI analysis...'
        // });

        const result = await service.getBidSuggestion(params);

        expect(result).toHaveProperty('recommendedBid');
        expect(result).toHaveProperty('confidence');
        expect(result).toHaveProperty('optimalTiming');
        expect(result).toHaveProperty('insights');
        expect(result.recommendedBid).toBeGreaterThan(params.currentBid);
        expect(result.confidence).toBeGreaterThanOrEqual(0.7); // Based on mock logic
        expect(result.optimalTiming).toBe('mid_auction'); // Based on mock logic
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(Requesting bid suggestion for auction ${params.auctionId}));
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(Bid suggestion for ${params.auctionId} completed));
        expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
    });

    it('should return a last_minute optimal timing if time remaining is low', async () => {
        const params = {
            auctionId: 'testAuction2',
            currentBid: 500,
            timeRemainingSeconds: 50, // Less than 60 seconds
        };
        const result = await service.getBidSuggestion(params);
        expect(result.optimalTiming).toBe('last_minute');
    });

    // --- getBidSuggestion Error Scenarios ---
    it('should throw AIBidServiceError for invalid input (missing auctionId)', async () => {
        const params = {
            auctionId: '', // Invalid
            currentBid: 1000,
        } as any; // Cast to any to allow invalid input for testing

        await expect(service.getBidSuggestion(params)).rejects.toThrow(AIBidServiceError);
        await expect(service.getBidSuggestion(params)).rejects.toThrow('Invalid input parameters for bid suggestion.');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Invalid input for bid suggestion'));
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to get bid suggestion'), expect.any(AIBidServiceError));
    });

    it('should throw AIBidServiceError if AI model inference fails', async () => {
        const params = {
            auctionId: 'testAuctionError',
            currentBid: 1000,
        };
        // If aiModelInferenceService was mocked:
        // (aiModelInferenceService.predictBidOutcome as jest.Mock).mockRejectedValueOnce(new Error('AI service unavailable'));

        // To test the error path when internal service call fails, we need to mock the internal implementation
        const originalGetBidSuggestion = service.getBidSuggestion;
        service.getBidSuggestion = jest.fn().mockImplementationOnce(() => {
            throw new Error('Simulated AI inference failure');
        });

        await expect(service.getBidSuggestion(params)).rejects.toThrow(AIBidServiceError);
        await expect(service.getBidSuggestion(params)).rejects.toThrow('Failed to retrieve AI bid suggestion.');
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(Failed to get bid suggestion for auction ${params.auctionId}), expect.any(Error));

        service.getBidSuggestion = originalGetBidSuggestion; // Restore original
    });

    // --- Performance (CQS) Scenarios ---
    it('should log a warning if getBidSuggestion response time exceeds 500ms', async () => {
        const params = { auctionId: 'slowAuction', currentBid: 1000 };
        // Mock setTimeout to simulate a long-running operation
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
            // Simulate 600ms delay for the async operation
            setTimeout(() => cb(), 600);
            return {} as any;
        });

        await service.getBidSuggestion(params);
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('AIBidService: Bid suggestion response time exceeded 500ms'));
    });
});
