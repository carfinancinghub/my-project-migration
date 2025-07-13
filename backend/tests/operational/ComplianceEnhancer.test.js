// File: ComplianceEnhancer.test.js
// Path: C:\CFH\backend\tests\operational\ComplianceEnhancer.test.js
// Purpose: Unit tests for ComplianceEnhancer service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const ComplianceEnhancer = require('@services/operational/ComplianceEnhancer');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('ComplianceEnhancer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyVehicleDetails', () => {
    it('verifies vehicle details successfully', async () => {
      const mockVehicle = {
        id: '789',
        vin: '12345678901234567',
        year: 2020,
        mileage: 50000
      };
      db.getVehicle.mockResolvedValueOnce(mockVehicle);

      const result = await ComplianceEnhancer.verifyVehicleDetails('789');
      expect(result).toEqual({ vehicleId: '789', isCompliant: true, issues: [] });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Verified vehicle details'));
    });

    it('identifies compliance issues', async () => {
      const mockVehicle = {
        id: '789',
        vin: '123',
        year: 1800,
        mileage: -100
      };
      db.getVehicle.mockResolvedValueOnce(mockVehicle);

      const result = await ComplianceEnhancer.verifyVehicleDetails('789');
      expect(result).toEqual({
        vehicleId: '789',
        isCompliant: false,
        issues: [
          'Invalid VIN: Must be 17 characters',
          'Invalid manufacturing year',
          'Invalid mileage'
        ]
      });
    });

    it('throws error when vehicle is not found', async () => {
      db.getVehicle.mockResolvedValueOnce(null);
      await expect(ComplianceEnhancer.verifyVehicleDetails('789')).rejects.toThrow('Vehicle not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Vehicle not found'));
    });
  });

  describe('flagNonCompliantVehicle', () => {
    it('flags non-compliant vehicle successfully', async () => {
      const mockVehicle = { id: '789' };
      db.getVehicle.mockResolvedValueOnce(mockVehicle);
      db.flagVehicle.mockResolvedValueOnce({});

      const result = await ComplianceEnhancer.flagNonCompliantVehicle('789', 'Invalid VIN');
      expect(result).toEqual({ vehicleId: '789', status: 'flagged', issue: 'Invalid VIN' });
      expect(db.flagVehicle).toHaveBeenCalledWith('789', expect.objectContaining({ issue: 'Invalid VIN' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Flagged non-compliant vehicle'));
    });

    it('throws error when vehicle is not found', async () => {
      db.getVehicle.mockResolvedValueOnce(null);
      await expect(ComplianceEnhancer.flagNonCompliantVehicle('789', 'Invalid VIN')).rejects.toThrow('Vehicle not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Vehicle not found'));
    });
  });
});

