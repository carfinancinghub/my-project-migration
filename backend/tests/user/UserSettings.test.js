// File: UserSettings.test.js
// Path: C:\CFH\backend\tests\user\UserSettings.test.js
// Purpose: Unit tests for UserSettings service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const UserSettings = require('@services/user/UserSettings');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('UserSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettings', () => {
    it('retrieves user settings successfully with existing settings', async () => {
      const mockUser = {
        id: '123',
        settings: { notifications: { email: true, push: false }, theme: 'dark', language: 'en' }
      };
      db.getUser.mockResolvedValueOnce(mockUser);

      const result = await UserSettings.getSettings('123');
      expect(result).toEqual({ notifications: { email: true, push: false }, theme: 'dark', language: 'en' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved settings'));
    });

    it('returns default settings for user without settings', async () => {
      const mockUser = { id: '123' };
      db.getUser.mockResolvedValueOnce(mockUser);

      const result = await UserSettings.getSettings('123');
      expect(result).toEqual({ notifications: { email: true, push: false }, theme: 'light', language: 'en' });
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(UserSettings.getSettings('123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  describe('updateSettings', () => {
    it('updates user settings successfully', async () => {
      const mockUser = { id: '123', settings: { notifications: { email: true, push: false }, theme: 'light', language: 'en' } };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.updateUser.mockResolvedValueOnce({});

      const updates = { theme: 'dark', notifications: { email: false, push: true } };
      const result = await UserSettings.updateSettings('123', updates);
      expect(result.status).toBe('updated');
      expect(result.settings).toEqual({ notifications: { email: false, push: true }, theme: 'dark', language: 'en' });
      expect(db.updateUser).toHaveBeenCalledWith('123', expect.objectContaining({ settings: expect.any(Object) }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Updated settings'));
    });

    it('throws error for invalid update fields', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      await expect(UserSettings.updateSettings('123', { invalidField: 'value' })).rejects.toThrow('Invalid update fields');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid update fields'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(UserSettings.updateSettings('123', { theme: 'dark' })).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

