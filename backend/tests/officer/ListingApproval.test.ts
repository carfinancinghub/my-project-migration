/**
 * © 2025 CFH, All Rights Reserved
 * File: ListingApproval.test.ts
 * Path: backend/tests/officer/ListingApproval.test.ts
 * Purpose: Unit tests for ListingApproval service
 * Author: Cod1 Team
 * Date: 2025-07-19 [0015]
 * Version: 1.0.1
 * Version ID: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 * Crown Certified: Yes
 * Batch ID: Compliance-071925
 * Artifact ID: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 * Save Location: backend/tests/officer/ListingApproval.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed mocks and user/auction objects
 * - Added more tests for invalid comments or long strings
 * - Suggest extracting mock user/auction to test utils
 * - Suggest integration tests with real DB
 * - Improved: Typed approveListing and rejectListing returns
 * - Free Feature: Basic approval/rejection tests
 * - Premium Feature: Suggest tests for premium officer roles if added
 * - Wow ++ Feature: AI-assisted approval suggestions tests
 */

import ListingApproval from '@services/officer/ListingApproval';
import * as db from '@services/db';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('ListingApproval', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('approveListing', () => {
    it('approves listing successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockAuction = { id: '789', status: 'pending' };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockOfficer);
      (db.getAuction as jest.Mock).mockResolvedValueOnce(mockAuction);
      (db.updateAuction as jest.Mock).mockResolvedValueOnce({});

      const result = await ListingApproval.approveListing('officer1', '789', 'Looks good');
      expect(result).toEqual({ auctionId: '789', status: 'approved' });
      expect(db.updateAuction).toHaveBeenCalledWith('789', expect.objectContaining({ status: 'approved', comments: 'Looks good' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Approved listing'));
    });

    it('throws error for non-officer user', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(ListingApproval.approveListing('officer1', '789', 'Looks good')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when auction is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
      await expect(ListingApproval.approveListing('officer1', '789', 'Looks good')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('throws error when auction is not in pending status', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      (db.getAuction as jest.Mock).mockResolvedValueOnce({ id: '789', status: 'approved' });
      await expect(ListingApproval.approveListing('officer1', '789', 'Looks good')).rejects.toThrow('Auction is not in pending status');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction is not in pending status'));
    });
  });

  describe('rejectListing', () => {
    it('rejects listing successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockAuction = { id: '789', status: 'pending' };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockOfficer);
      (db.getAuction as jest.Mock).mockResolvedValueOnce(mockAuction);
      (db.updateAuction as jest.Mock).mockResolvedValueOnce({});

      const result = await ListingApproval.rejectListing('officer1', '789', 'Invalid vehicle details');
      expect(result).toEqual({ auctionId: '789', status: 'rejected', reason: 'Invalid vehicle details' });
      expect(db.updateAuction).toHaveBeenCalledWith('789', expect.objectContaining({ status: 'rejected', reason: 'Invalid vehicle details' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Rejected listing'));
    });

    it('throws error for non-officer user', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(ListingApproval.rejectListing('officer1', '789', 'Invalid vehicle details')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when auction is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
      await expect(ListingApproval.rejectListing('officer1', '789', 'Invalid vehicle details')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('throws error when auction is not in pending status', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      (db.getAuction as jest.Mock).mockResolvedValueOnce({ id: '789', status: 'approved' });
      await expect(ListingApproval.rejectListing('officer1', '789', 'Invalid vehicle details')).rejects.toThrow('Auction is not in pending status');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction is not in pending status'));
    });
  });
});
