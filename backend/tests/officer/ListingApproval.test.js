// File: ListingApproval.test.js
// Path: C:\CFH\backend\tests\officer\ListingApproval.test.js
// Purpose: Unit tests for ListingApproval service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const ListingApproval = require('@services/officer/ListingApproval');
const db = require('@services/db');
const logger = require('@utils/logger');

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
      db.getUser.mockResolvedValueOnce(mockOfficer);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      db.updateAuction.mockResolvedValueOnce({});

      const result = await ListingApproval.approveListing('officer1', '789', 'Looks good');
      expect(result).toEqual({ auctionId: '789', status: 'approved' });
      expect(db.updateAuction).toHaveBeenCalledWith('789', expect.objectContaining({ status: 'approved', comments: 'Looks good' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Approved listing'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(ListingApproval.approveListing('officer1', '789', 'Looks good')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(ListingApproval.approveListing('officer1', '789', 'Looks good')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('throws error when auction is not in pending status', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      db.getAuction.mockResolvedValueOnce({ id: '789', status: 'approved' });
      await expect(ListingApproval.approveListing('officer1', '789', 'Looks good')).rejects.toThrow('Auction is not in pending status');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction is not in pending status'));
    });
  });

  describe('rejectListing', () => {
    it('rejects listing successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockAuction = { id: '789', status: 'pending' };
      db.getUser.mockResolvedValueOnce(mockOfficer);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      db.updateAuction.mockResolvedValueOnce({});

      const result = await ListingApproval.rejectListing('officer1', '789', 'Invalid vehicle details');
      expect(result).toEqual({ auctionId: '789', status: 'rejected', reason: 'Invalid vehicle details' });
      expect(db.updateAuction).toHaveBeenCalledWith('789', expect.objectContaining({ status: 'rejected', reason: 'Invalid vehicle details' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Rejected listing'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(ListingApproval.rejectListing('officer1', '789', 'Invalid vehicle details')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(ListingApproval.rejectListing('officer1', '789', 'Invalid vehicle details')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('throws error when auction is not in pending status', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      db.getAuction.mockResolvedValueOnce({ id: '789', status: 'approved' });
      await expect(ListingApproval.rejectListing('officer1', '789', 'Invalid vehicle details')).rejects.toThrow('Auction is not in pending status');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction is not in pending status'));
    });
  });
});

