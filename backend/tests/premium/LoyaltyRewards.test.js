// File: LoyaltyRewards.test.js
// Path: C:\CFH\backend\tests\premium\LoyaltyRewards.test.js
// Purpose: Unit tests for LoyaltyRewards service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const LoyaltyRewards = require('@services/premium/LoyaltyRewards');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('LoyaltyRewards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addPoints', () => {
    it('adds points successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true, points: 50 };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.updateUser.mockResolvedValueOnce({});
      db.logReward.mockResolvedValueOnce({});

      const result = await LoyaltyRewards.addPoints('123', 'bid', 10);
      expect(result).toEqual({ status: 'points added', totalPoints: 60 });
      expect(db.updateUser).toHaveBeenCalledWith('123', { points: 60 });
      expect(db.logReward).toHaveBeenCalledWith(expect.objectContaining({ userId: '123', action: 'bid', points: 10 }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Added 10 points'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(LoyaltyRewards.addPoints('123', 'bid', 10)).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('handles user with no existing points', async () => {
      const mockUser = { id: '123', isPremium: true };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.updateUser.mockResolvedValueOnce({});
      db.logReward.mockResolvedValueOnce({});

      const result = await LoyaltyRewards.addPoints('123', 'bid', 10);
      expect(result.totalPoints).toBe(10);
    });
  });

  describe('redeemReward', () => {
    it('redeems reward successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true, points: 150 };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.updateUser.mockResolvedValueOnce({});
      db.logRewardRedemption.mockResolvedValueOnce({});

      const result = await LoyaltyRewards.redeemReward('123', 'discount');
      expect(result).toEqual({ status: 'redeemed', remainingPoints: 50, rewardType: 'discount' });
      expect(db.updateUser).toHaveBeenCalledWith('123', { points: 50 });
      expect(db.logRewardRedemption).toHaveBeenCalledWith(expect.objectContaining({ rewardType: 'discount', cost: 100 }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Redeemed discount'));
    });

    it('throws error for insufficient points', async () => {
      const mockUser = { id: '123', isPremium: true, points: 50 };
      db.getUser.mockResolvedValueOnce(mockUser);
      await expect(LoyaltyRewards.redeemReward('123', 'discount')).rejects.toThrow('Insufficient points');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Insufficient points'));
    });

    it('throws error for invalid reward type', async () => {
      const mockUser = { id: '123', isPremium: true, points: 150 };
      db.getUser.mockResolvedValueOnce(mockUser);
      await expect(LoyaltyRewards.redeemReward('123', 'invalid')).rejects.toThrow('Invalid reward type');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid reward type'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(LoyaltyRewards.redeemReward('123', 'discount')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });
  });
});

