// File: ComplianceChecker.test.js
// Path: C:\CFH\backend\tests\officer\ComplianceChecker.test.js
// Purpose: Unit tests for ComplianceChecker service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const ComplianceChecker = require('@services/officer/ComplianceChecker');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('ComplianceChecker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkListingCompliance', () => {
    it('checks listing compliance successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockAuction = {
        id: '789',
        vehicleDetails: { vin: '123VIN456' },
        images: ['image1.jpg'],
        reservePrice: 10000
      };
      db.getUser.mockResolvedValueOnce(mockOfficer);
      db.getAuction.mockResolvedValueOnce(mockAuction);

      const result = await ComplianceChecker.checkListingCompliance('officer1', '789');
      expect(result).toEqual({ auctionId: '789', isCompliant: true, issues: [] });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Checked compliance'));
    });

    it('identifies compliance issues', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockAuction = {
        id: '789',
        vehicleDetails: {},
        images: [],
        reservePrice: 0
      };
      db.getUser.mockResolvedValueOnce(mockOfficer);
      db.getAuction.mockResolvedValueOnce(mockAuction);

      const result = await ComplianceChecker.checkListingCompliance('officer1', '789');
      expect(result).toEqual({
        auctionId: '789',
        isCompliant: false,
        issues: [
          'Missing VIN in vehicle details',
          'No images provided for listing',
          'Invalid reserve price'
        ]
      });
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(ComplianceChecker.checkListingCompliance('officer1', '789')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(ComplianceChecker.checkListingCompliance('officer1', '789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('flagNonCompliantListing', () => {
    it('flags non-compliant listing successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockAuction = { id: '789' };
      db.getUser.mockResolvedValueOnce(mockOfficer);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      db.flagAuction.mockResolvedValueOnce({});

      const result = await ComplianceChecker.flagNonCompliantListing('officer1', '789', 'Missing VIN');
      expect(result).toEqual({ auctionId: '789', status: 'flagged', issue: 'Missing VIN' });
      expect(db.flagAuction).toHaveBeenCalledWith('789', expect.objectContaining({ issue: 'Missing VIN' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Flagged non-compliant listing'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(ComplianceChecker.flagNonCompliantListing('officer1', '789', 'Missing VIN')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(ComplianceChecker.flagNonCompliantListing('officer1', '789', 'Missing VIN')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });
});

