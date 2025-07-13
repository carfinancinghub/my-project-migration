// File: UserPreferences.test.js
// Path: C:\CFH\backend\tests\user\UserPreferences.test.js
// Purpose: Unit tests for UserPreferences service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const UserPreferences = require('@services/user/UserPreferences');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('UserPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPreferences', () => {
    it('retrieves user preferences successfully with existing preferences', async () => {
      const mockUser = {
        id: '123',
        preferences: { currency: 'EUR', vehicleType: 'sedan', priceRange: { min: 5000, max: 30000 }, location: 'EU' }
      };
      db.getUser.mockResolvedValueOnce(mockUser);

      const result = await UserPreferences.getPreferences('123');
      expect(result).toEqual({ currency: 'EUR', vehicleType: 'sedan', priceRange: { min: 5000, max: 30000 }, location: 'EU' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved preferences'));
    });

    it('returns default preferences for user without preferences', async () => {
      const mockUser = { id: '123' };
      db.getUser.mockResolvedValueOnce(mockUser);

      const result = await UserPreferences.getPreferences('123');
      expect(result).toEqual({ currency: 'USD', vehicleType: 'all', priceRange: { min: 0, max: 100000 }, location: 'all' });
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(UserPreferences.getPreferences('123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  describe('updatePreferences', () => {
    it('updates user preferences successfully', async () => {
      const mockUser = {
        id: '123',
        preferences: { currency: 'USD', vehicleType: 'all', priceRange: { min: 0, max: 100000 }, location: 'all' }
      };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.updateUser.mockResolvedValueOnce({});

      const updates = { currency: 'EUR', vehicleType: 'sedan' };
      const result = await UserPreferences.updatePreferences('123', updates);
      expect(result.status).toBe('updated');
      expect(result.preferences).toEqual({
        currency: 'EUR',
        vehicleType: 'sedan',
        priceRange: { min: 0, max: 100000 },
        location: 'all'
      });
      expect(db.updateUser).toHaveBeenCalledWith('123', expect.objectContaining({ preferences: expect.any(Object) }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Updated preferences'));
    });

    it('throws error for invalid update fields', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      await expect(UserPreferences.updatePreferences('123', { invalidField: 'value' })).rejects.toThrow('Invalid update fields');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid update fields'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(UserPreferences.updatePreferences('123', { currency: 'EUR' })).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

