// File: PreferencesSetup.test.js
// Path: C:\CFH\backend\tests\onboarding\PreferencesSetup.test.js
// Purpose: Unit tests for PreferencesSetup service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const PreferencesSetup = require('@services/onboarding/PreferencesSetup');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('PreferencesSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setPreferences', () => {
    it('sets preferences successfully', async () => {
      const mockUser = { id: '123' };
      const preferences = { currency: 'EUR', vehicleType: 'sedan', priceRange: { min: 5000, max: 30000 }, location: 'EU' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.updateUser.mockResolvedValueOnce({});

      const result = await PreferencesSetup.setPreferences('123', preferences);
      expect(result).toEqual({ status: 'preferences_set' });
      expect(db.updateUser).toHaveBeenCalledWith('123', { preferences });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Set preferences'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(PreferencesSetup.setPreferences('123', { currency: 'EUR' })).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error for invalid preference fields', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      const preferences = { invalidField: 'value' };
      await expect(PreferencesSetup.setPreferences('123', preferences)).rejects.toThrow('Invalid preference fields: invalidField');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid preference fields'));
    });
  });

  describe('getDefaultPreferences', () => {
    it('retrieves default preferences successfully', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });

      const result = await PreferencesSetup.getDefaultPreferences('123');
      expect(result).toEqual({
        currency: 'USD',
        vehicleType: 'all',
        priceRange: { min: 0, max: 100000 },
        location: 'all'
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved default preferences'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(PreferencesSetup.getDefaultPreferences('123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

