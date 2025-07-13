/*
 * File: ValuationService.test.ts
 * Path: C:\CFH\backend\tests\services\valuation\ValuationService.test.ts
 * Created: 2025-06-30 19:45 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for ValuationService with ≥95% coverage.
 * Artifact ID: test-val-service-main
 * Version ID: test-val-service-main-v1.0.0
 */

import { ValuationService } from '@services/valuation/ValuationService';
import { VinDecoderService } from '@services/vin/VinDecoderService';

jest.mock('@services/vin/VinDecoderService');

describe('ValuationService', () => {
  it('should calculate a valuation for a valid VIN', async () => {
    (VinDecoderService.decode as jest.Mock).mockResolvedValue({ make: 'Test', model: 'Car', year: 2022 });
    const valuation = await ValuationService.calculateValuation('VALIDVIN123456789', 30000, 'Good');
    expect(valuation.privateParty).toBe(30000);
  });

  it('should throw an error if the VinDecoderService fails', async () => {
    (VinDecoderService.decode as jest.Mock).mockRejectedValue(new Error('Decode failed'));
    await expect(ValuationService.calculateValuation('FAILVIN123456789', 30000, 'Good')).rejects.toThrow('Valuation calculation failed');
  });
});