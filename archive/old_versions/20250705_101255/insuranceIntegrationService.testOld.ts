/*
File: insuranceIntegrationService.test.ts
Path: C:\CFH\backend\tests\services\integrations\insuranceIntegrationService.test.ts
Created: 2025-07-04 13:10 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for insuranceIntegrationService with skeleton tests.
Artifact ID: x9y0z1a2-b3c4-d5e6-f7g8-h9i0j1k2l3m4
Version ID: y0z1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { insuranceIntegrationService, InsuranceIntegrationServiceError } from '@/backend/services/integrations/insuranceIntegrationService';

// Mock the logger to prevent console output during tests and spy on calls
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

describe('insuranceIntegrationService', () => {
    let service: typeof insuranceIntegrationService;

    beforeEach(() => {
        service = new (insuranceIntegrationService as any).constructor(); // Create a new instance for each test
        jest.clearAllMocks();
        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- processInsuranceWebhook Tests ---
    describe('processInsuranceWebhook', () => {
        const validClaimData = {
            claimId: 'claim_xyz_123',
            userId: 'user_abc',
            adjusterName: 'Jane Doe',
            insuredVehicle: { make: 'Toyota', model: 'Camry', vin: 'VINXYZ123' },
            damageCode: 'D101',
            preferredShops: ['shop1', 'shop2']
        };

        it('should successfully process a valid insurance webhook', async () => {
            const result = await service.processInsuranceWebhook(validClaimData);

            expect(result).toHaveProperty('claimId', validClaimData.claimId);
            expect(result).toHaveProperty('estimateLinked', true);
            expect(result).toHaveProperty('status', 'processed');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Processing webhook for claim: ${validClaimData.claimId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Webhook for claim ${validClaimData.claimId} processed`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
            // Cod1+ TODO: Assert that internal service calls (e.g., updateEstimateFromInsuranceClaim) were made.
        });

        it('should throw InsuranceIntegrationServiceError if webhook processing fails internally', async () => {
            // Simulate an internal failure by temporarily replacing the method's implementation
            const originalProcessWebhook = service.processInsuranceWebhook;
            service.processInsuranceWebhook = jest.fn().mockImplementationOnce(() => {
                throw new Error('Simulated internal processing error');
            });

            await expect(service.processInsuranceWebhook(validClaimData)).rejects.toThrow(InsuranceIntegrationServiceError);
            await expect(service.processInsuranceWebhook(validClaimData)).rejects.toThrow('Failed to process insurance webhook.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to process webhook for claim'), expect.any(Error));

            service.processInsuranceWebhook = originalProcessWebhook; // Restore
        });

        it('should log a warning if processInsuranceWebhook response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600); // Simulate 600ms delay
                return {} as any;
            });

            await service.processInsuranceWebhook(validClaimData);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Webhook processing response time exceeded 500ms'));
        });

        // Cod1+ TODO: Add tests for webhook signature validation (if implemented):
        // - Test with valid signature
        // - Test with invalid signature (should throw error)
    });
});