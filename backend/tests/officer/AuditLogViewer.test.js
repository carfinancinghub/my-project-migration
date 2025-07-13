// File: AuditLogViewer.test.js
// Path: C:\CFH\backend\tests\officer\AuditLogViewer.test.js
// Purpose: Unit tests for AuditLogViewer service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const AuditLogViewer = require('@services/officer/AuditLogViewer');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('AuditLogViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuditLogs', () => {
    it('retrieves audit logs successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockLogs = [
        { userId: '123', action: 'place_bid', details: { amount: 10000 }, timestamp: '2025-05-24T12:00:00Z' }
      ];
      db.getUser.mockResolvedValueOnce(mockOfficer);
      db.getAuditLogs.mockResolvedValueOnce(mockLogs);

      const result = await AuditLogViewer.getAuditLogs('officer1', '2025-05-24', '2025-05-25', '123');
      expect(result).toEqual([
        { userId: '123', action: 'place_bid', details: { amount: 10000 }, timestamp: '2025-05-24T12:00:00Z' }
      ]);
      expect(db.getAuditLogs).toHaveBeenCalledWith('2025-05-24', '2025-05-25', '123');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved audit logs'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(AuditLogViewer.getAuditLogs('officer1', '2025-05-24', '2025-05-25', '123')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when no logs are found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      db.getAuditLogs.mockResolvedValueOnce([]);
      await expect(AuditLogViewer.getAuditLogs('officer1', '2025-05-24', '2025-05-25', '123')).rejects.toThrow('No audit logs found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No audit logs found'));
    });
  });

  describe('getFlaggedUsers', () => {
    it('retrieves flagged users successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockFlaggedUsers = [
        { id: '123', flaggedBy: 'officer1', reason: 'Fraudulent activity', flaggedAt: '2025-05-24T12:00:00Z' }
      ];
      db.getUser.mockResolvedValueOnce(mockOfficer);
      db.getFlaggedUsers.mockResolvedValueOnce(mockFlaggedUsers);

      const result = await AuditLogViewer.getFlaggedUsers('officer1');
      expect(result).toEqual([
        { userId: '123', flaggedBy: 'officer1', reason: 'Fraudulent activity', flaggedAt: '2025-05-24T12:00:00Z' }
      ]);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved flagged users'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(AuditLogViewer.getFlaggedUsers('officer1')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when no flagged users are found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' });
      db.getFlaggedUsers.mockResolvedValueOnce([]);
      await expect(AuditLogViewer.getFlaggedUsers('officer1')).rejects.toThrow('No flagged users found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No flagged users found'));
    });
  });
});

