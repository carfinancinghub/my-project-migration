// File: UserOnboarding.test.js
// Path: C:\CFH\backend\tests\onboarding\UserOnboarding.test.js
// Purpose: Unit tests for UserOnboarding service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const UserOnboarding = require('@services/onboarding/UserOnboarding');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('UserOnboarding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('completeProfile', () => {
    it('completes profile successfully', async () => {
      const mockUser = { id: '123' };
      const profileData = { name: 'John Doe', email: 'john@example.com', phone: '1234567890' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.updateUser.mockResolvedValueOnce({});

      const result = await UserOnboarding.completeProfile('123', profileData);
      expect(result).toEqual({ status: 'profile_completed' });
      expect(db.updateUser).toHaveBeenCalledWith('123', { profile: profileData, onboarded: true });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Completed profile'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(UserOnboarding.completeProfile('123', { name: 'John Doe' })).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error for missing required fields', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      const profileData = { name: 'John Doe' };
      await expect(UserOnboarding.completeProfile('123', profileData)).rejects.toThrow('Missing required fields: email, phone');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Missing required fields'));
    });
  });

  describe('getOnboardingStatus', () => {
    it('retrieves onboarding status successfully', async () => {
      const mockUser = { id: '123', onboarded: true, profile: { name: 'John Doe' } };
      db.getUser.mockResolvedValueOnce(mockUser);

      const result = await UserOnboarding.getOnboardingStatus('123');
      expect(result).toEqual({ onboarded: true, profile: { name: 'John Doe' } });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved onboarding status'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(UserOnboarding.getOnboardingStatus('123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

