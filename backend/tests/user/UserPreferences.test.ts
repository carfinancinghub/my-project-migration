/**
 * © 2025 CFH, All Rights Reserved
 * File: UserPreferences.test.ts
 * Path: backend/tests/user/UserPreferences.test.ts
 * Purpose: Unit tests for UserPreferences service
 * Author: Cod1 Team
 * Date: 2025-07-18 [0815]
 * Version: 1.0.1
 * Version ID: u1i2o3p4a5s6d7f8g9h0j1k2l3m4n5b6
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: u1i2o3p4a5s6d7f8g9h0j1k2l3m4n5b6
 * Save Location: backend/tests/user/UserPreferences.test.ts
 */

import UserPreferences from '@services/user/UserPreferences';
import * as db from '@services/db';
import * as logger from '@utils/logger';

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
        preferences: {
          currency: 'EUR',
          vehicleType: 'sedan',
          priceRange: { min: 5000, max: 30000 },
          location: 'EU',
        },
      };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await UserPreferences.getPreferences('123');
      expect(result).toEqual({
        currency: 'EUR',
        vehicleType: 'sedan',
        priceRange: { min: 5000, max: 30000 },
        location: 'EU',
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved preferences'));
    });

    it('returns default preferences for user without preferences', async () => {
      const mockUser = { id: '123' };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await UserPreferences.getPreferences('123');
      expect(result).toEqual({
        currency: 'USD',
        vehicleType: 'all',
        priceRange: { min: 0, max: 100000 },
        location: 'all',
      });
    });

    it('throws error when user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce(null);
      await expect(UserPreferences.getPreferences('123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  describe('updatePreferences', () => {
    it('updates user preferences successfully', async () => {
      const mockUser = {
        id: '123',
        preferences: {
          currency: 'USD',
          vehicleType: 'all',
          priceRange: { min: 0, max: 100000 },
          location: 'all',
        },
      };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (db.updateUser as jest.Mock).mockResolvedValueOnce({});

      const updates = { currency: 'EUR', vehicleType: 'sedan' };
      const result = await UserPreferences.updatePreferences('123', updates);
      expect(result.status).toBe('updated');
      expect(result.preferences).toEqual({
        currency: 'EUR',
        vehicleType: 'sedan',
        priceRange: { min: 0, max: 100000 },
        location: 'all',
      });
      expect(db.updateUser).toHaveBeenCalledWith('123', expect.objectContaining({ preferences: expect.any(Object) }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Updated preferences'));
    });

    it('throws error for invalid update fields', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123' });
      await expect(
        UserPreferences.updatePreferences('123', { email: 'new@example.com' })
      ).rejects.toThrow('Invalid update fields');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid update fields'));
    });

    it('throws error when user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce(null);
      await expect(
        UserPreferences.updatePreferences('123', { currency: 'EUR' })
      ).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});
