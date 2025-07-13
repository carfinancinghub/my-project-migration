// File: DisputeManager.test.js
// Path: C:\CFH\backend\tests\officer\DisputeManager.test.js
// Purpose: Unit tests for DisputeManager service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const DisputeManager = require('@services/officer/DisputeManager');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('DisputeManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDispute', () => {
    it('creates dispute successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockUser = { id: '123' };
      const mockAuction = { id: '789' };
      db.getUser.mockResolvedValueOnce(mockOfficer).mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      db.createDispute.mockResolvedValueOnce('dispute1');

      const result = await DisputeManager.createDispute('officer1', '123', '789', 'Invalid listing');
      expect(result).toEqual({ disputeId: 'dispute1', status: 'created' });
      expect(db.createDispute).toHaveBeenCalledWith(expect.objectContaining({ userId: '123', auctionId: '789', reason: 'Invalid listing' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Created dispute'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(DisputeManager.createDispute('officer1', '123', '789', 'Invalid listing')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce(null);
      await expect(DisputeManager.createDispute('officer1', '123', '789', 'Invalid listing')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce({ id: '123' });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(DisputeManager.createDispute('officer1', '123', '789', 'Invalid listing')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('resolveDispute', () => {
    it('resolves dispute successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockDispute = { id: 'dispute1', status: 'open' };
      db.getUser.mockResolvedValueOnce(mockOfficer);
      db.getDispute.mockResolvedValueOnce(mockDispute);
      db.updateDispute.mockResolvedValueOnce({});

      const result = await DisputeManager.resolveDispute('officer1', 'dispute1', 'Refund issued');
      expect(result).toEqual({ disputeId: 'dispute1', status: 'resolved', resolution: 'Refund issued' });
      expect(db.updateDispute).toHaveBeenCalledWith('dispute1', expect.objectContaining({ status: 'resolved', resolution: 'Refund issued' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Resolved dispute'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(DisputeManager.resolveDispute('officer1', 'dispute1', 'Refund issued')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when dispute is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      db.getDispute.mockResolvedValueOnce(null);
      await expect(DisputeManager.resolveDispute('officer1', 'dispute1', 'Refund issued')).rejects.toThrow('Dispute not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Dispute not found'));
    });
  });
});

