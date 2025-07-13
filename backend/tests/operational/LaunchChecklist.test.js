// File: LaunchChecklist.test.js
// Path: C:\CFH\backend\tests\operational\LaunchChecklist.test.js
// Purpose: Unit tests for LaunchChecklist service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const LaunchChecklist = require('@services/operational/LaunchChecklist');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('LaunchChecklist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('runChecklist', () => {
    it('runs checklist successfully with all passing checks', async () => {
      db.getActiveAuctionsCount.mockResolvedValueOnce(5);
      db.getTotalUsers.mockResolvedValueOnce(100);
      db.getErrorLogs.mockResolvedValueOnce([]);

      const result = await LaunchChecklist.runChecklist();
      expect(result.isReady).toBe(true);
      expect(result.checklist).toEqual([
        { name: 'Active Auctions Check', status: true, details: 'Found 5 active auctions' },
        { name: 'User Count Check', status: true, details: 'Found 100 users' },
        { name: 'Recent Errors Check', status: true, details: 'No errors in last 24 hours' }
      ]);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Ran launch checklist: Ready'));
    });

    it('runs checklist with failing checks', async () => {
      db.getActiveAuctionsCount.mockResolvedValueOnce(0);
      db.getTotalUsers.mockResolvedValueOnce(0);
      db.getErrorLogs.mockResolvedValueOnce([{ message: 'Test error' }]);

      const result = await LaunchChecklist.runChecklist();
      expect(result.isReady).toBe(false);
      expect(result.checklist).toEqual([
        { name: 'Active Auctions Check', status: true, details: 'Found 0 active auctions' },
        { name: 'User Count Check', status: false, details: 'Found 0 users' },
        { name: 'Recent Errors Check', status: false, details: '1 errors found in last 24 hours' }
      ]);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Ran launch checklist: Not ready'));
    });

    it('throws error on checklist failure', async () => {
      db.getActiveAuctionsCount.mockRejectedValueOnce(new Error('DB error'));
      await expect(LaunchChecklist.runChecklist()).rejects.toThrow('DB error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to run launch checklist'));
    });
  });

  describe('logChecklistResult', () => {
    it('logs checklist result successfully', async () => {
      const mockResult = {
        isReady: true,
        checklist: [{ name: 'Test Check', status: true, details: 'All good' }]
      };
      db.logChecklistResult.mockResolvedValueOnce({});

      const result = await LaunchChecklist.logChecklistResult(mockResult);
      expect(result).toEqual({ status: 'logged' });
      expect(db.logChecklistResult).toHaveBeenCalledWith(expect.objectContaining({ isReady: true }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Logged checklist result: Ready'));
    });

    it('throws error on logging failure', async () => {
      const mockResult = {
        isReady: true,
        checklist: [{ name: 'Test Check', status: true, details: 'All good' }]
      };
      db.logChecklistResult.mockRejectedValueOnce(new Error('DB error'));
      await expect(LaunchChecklist.logChecklistResult(mockResult)).rejects.toThrow('DB error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to log checklist result'));
    });
  });
});

