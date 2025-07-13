// File: UserActivity.test.js
// Path: C:\CFH\backend\tests\user\UserActivity.test.js
// Purpose: Unit tests for UserActivity service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const UserActivity = require('@services/user/UserActivity');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('UserActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logActivity', () => {
    it('logs activity successfully', async () => {
      db.logActivity.mockResolvedValueOnce({});
      const result = await UserActivity.logActivity('123', 'login', { ip: '192.168.1.1' });
      expect(result.status).toBe('logged');
      expect(db.logActivity).toHaveBeenCalledWith(expect.objectContaining({ userId: '123', action: 'login' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Logged activity'));
    });

    it('throws error on logging failure', async () => {
      db.logActivity.mockRejectedValueOnce(new Error('DB error'));
      await expect(UserActivity.logActivity('123', 'login', { ip: '192.168.1.1' })).rejects.toThrow('DB error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to log activity'));
    });
  });

  describe('getActivity', () => {
    it('retrieves user activities successfully', async () => {
      const mockActivities = [
        { userId: '123', action: 'login', details: { ip: '192.168.1.1' }, timestamp: '2025-05-24T12:00:00Z' }
      ];
      db.getActivitiesByUser.mockResolvedValueOnce(mockActivities);

      const result = await UserActivity.getActivity('123');
      expect(result).toEqual(mockActivities);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved activities'));
    });

    it('throws error when no activities are found', async () => {
      db.getActivitiesByUser.mockResolvedValueOnce(null);
      await expect(UserActivity.getActivity('123')).rejects.toThrow('No activities found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No activities found'));
    });

    it('handles empty activities gracefully', async () => {
      db.getActivitiesByUser.mockResolvedValueOnce([]);
      await expect(UserActivity.getActivity('123')).rejects.toThrow('No activities found');
    });
  });
});

