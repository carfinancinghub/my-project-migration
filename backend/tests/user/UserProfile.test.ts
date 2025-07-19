/**
 * © 2025 CFH, All Rights Reserved
 * File: UserProfile.test.ts
 * Path: backend/tests/user/UserProfile.test.ts
 * Purpose: Unit tests for UserProfile service
 * Author: Cod1 Team
 * Date: 2025-07-18 [0815]
 * Version: 1.0.1
 * Version ID: v2b3n4m5l6k7j8h9g0f1d2s3a4q5w6e7
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: v2b3n4m5l6k7j8h9g0f1d2s3a4q5w6e7
 * Save Location: backend/tests/user/UserProfile.test.ts
 */

import UserProfile from '@services/user/UserProfile';
import * as db from '@services/db';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('UserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('retrieves user profile successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'buyer',
        name: 'John Doe',
        createdAt: '2025-05-24T12:00:00Z',
      };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await UserProfile.getProfile('123');
      expect(result).toEqual({
        userId: '123',
        email: 'test@example.com',
        role: 'buyer',
        name: 'John Doe',
        createdAt: '2025-05-24T12:00:00Z',
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved profile'));
    });

    it('throws error when user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce(null);
      await expect(UserProfile.getProfile('123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  describe('updateProfile', () => {
    it('updates user profile successfully', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123' });
      (db.updateUser as jest.Mock).mockResolvedValueOnce({});
      const result = await UserProfile.updateProfile('123', { name: 'Jane Doe' });
      expect(result.status).toBe('updated');
      expect(db.updateUser).toHaveBeenCalledWith('123', { name: 'Jane Doe' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Updated profile'));
    });

    it('throws error for invalid update fields', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123' });
      await expect(
        UserProfile.updateProfile('123', { email: 'new@example.com' })
      ).rejects.toThrow('Invalid update fields');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid update fields'));
    });

    it('throws error when user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce(null);
      await expect(
        UserProfile.updateProfile('123', { name: 'Jane Doe' })
      ).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});
