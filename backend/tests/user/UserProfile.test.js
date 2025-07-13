// File: UserProfile.test.js
// Path: C:\CFH\backend\tests\user\UserProfile.test.js
// Purpose: Unit tests for UserProfile service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const UserProfile = require('@services/user/UserProfile');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('UserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('retrieves user profile successfully', async () => {
      const mockUser = { id: '123', email: 'test@example.com', role: 'buyer', name: 'John Doe', createdAt: '2025-05-24T12:00:00Z' };
      db.getUser.mockResolvedValueOnce(mockUser);

      const result = await UserProfile.getProfile('123');
      expect(result).toEqual({
        userId: '123',
        email: 'test@example.com',
        role: 'buyer',
        name: 'John Doe',
        createdAt: '2025-05-24T12:00:00Z'
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved profile'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(UserProfile.getProfile('123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  describe('updateProfile', () => {
    it('updates user profile successfully', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      db.updateUser.mockResolvedValueOnce({});
      const result = await UserProfile.updateProfile('123', { name: 'Jane Doe' });
      expect(result.status).toBe('updated');
      expect(db.updateUser).toHaveBeenCalledWith('123', { name: 'Jane Doe' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Updated profile'));
    });

    it('throws error for invalid update fields', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      await expect(UserProfile.updateProfile('123', { email: 'new@example.com' })).rejects.toThrow('Invalid update fields');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid update fields'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(UserProfile.updateProfile('123', { name: 'Jane Doe' })).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

