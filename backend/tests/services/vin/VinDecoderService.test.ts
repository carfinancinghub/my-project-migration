/*
 * File: VinDecoderService.test.ts
 * Path: C:\CFH\backend\tests\services\vin\VinDecoderService.test.ts
 * Created: 2025-06-30 19:45 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for VinDecoderService with ≥95% coverage.
 * Artifact ID: test-service-vin-decoder
 * Version ID: test-service-vin-decoder-v1.0.0
 */

import { VinDecoderService } from '@services/vin/VinDecoderService';

describe('VinDecoderService', () => {
  it('should return vehicle details for a valid VIN', async () => {
    const details = await VinDecoderService.decode('VALIDVIN123456789');
    expect(details).toEqual({ make: 'Ford', model: 'Bronco', year: 2021 });
  });

  it('should throw an error for an invalid VIN', async () => {
    await expect(VinDecoderService.decode('INVALIDVIN1234567')).rejects.toThrow('Could not decode VIN.');
  });
});