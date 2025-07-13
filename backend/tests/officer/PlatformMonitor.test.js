// File: PlatformMonitor.test.js
// Path: C:\CFH\backend\tests\officer\PlatformMonitor.test.js
// Purpose: Unit tests for PlatformMonitor service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const PlatformMonitor = require('@services/officer/PlatformMonitor');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('PlatformMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlatformStats', () => {
    it('retrieves platform stats successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockActivity = [
        { userId: '123', action: 'view_auction', timestamp: '2025-05-24T12:00:00Z' }
      ];
      db.getUser.mockResolvedValueOnce(mockOfficer);
      db.getActiveAuctionsCount.mockResolvedValueOnce(5);
      db.getTotalUsers.mockResolvedValueOnce(100);
      db.getRecentActivity.mockResolvedValueOnce(mockActivity);

      const result = await PlatformMonitor.getPlatformStats('officer1');
      expect(result).toEqual({
        activeAuctions: 5,
        totalUsers: 100,
        recentActivity: [
          { userId: '123', action: 'view_auction', timestamp: '2025-05-24T12:00:00Z' }
        ]
      });
      expect(db.getRecentActivity).toHaveBeenCalledWith(100);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved platform stats'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(PlatformMonitor.getPlatformStats('officer1')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error on stats retrieval failure', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      db.getActiveAuctionsCount.mockRejectedValueOnce(new Error('DB error'));
      await expect(PlatformMonitor.getPlatformStats('officer1')).rejects.toThrow('DB error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to retrieve platform stats'));
    });
  });

  describe('flagSuspiciousActivity', () => {
    it('flags suspicious activity successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockUser = { id: '123' };
      db.getUser.mockResolvedValueOnce(mockOfficer).mockResolvedValueOnce(mockUser);
      db.flagUser.mockResolvedValueOnce({});

      const result = await PlatformMonitor.flagSuspiciousActivity('officer1', '123', 'Multiple rapid bids');
      expect(result).toEqual({ userId: '123', status: 'flagged', reason: 'Multiple rapid bids' });
      expect(db.flagUser).toHaveBeenCalledWith('123', expect.objectContaining({ flaggedBy: 'officer1', reason: 'Multiple rapid bids' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Flagged suspicious activity'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(PlatformMonitor.flagSuspiciousActivity('officer1', '123', 'Multiple rapid bids')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce(null);
      await expect(PlatformMonitor.flagSuspiciousActivity('officer1', '123', 'Multiple rapid bids')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

