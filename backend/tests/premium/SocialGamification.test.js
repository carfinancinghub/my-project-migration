// File: SocialGamification.test.js
// Path: C:\CFH\backend\tests\premium\SocialGamification.test.js
// Purpose: Unit tests for SocialGamification service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const SocialGamification = require('@services/premium/SocialGamification');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('SocialGamification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLeaderboard', () => {
    it('retrieves leaderboard successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockLeaderboard = [
        { userId: '123', score: 50, rank: 1 },
        { userId: '456', score: 40, rank: 2 }
      ];
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getLeaderboard.mockResolvedValueOnce(mockLeaderboard);

      const result = await SocialGamification.getLeaderboard('123', 'bids');
      expect(result).toEqual([
        { userId: '123', score: 50, rank: 1 },
        { userId: '456', score: 40, rank: 2 }
      ]);
      expect(db.getLeaderboard).toHaveBeenCalledWith('bids', 10);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved bids leaderboard'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(SocialGamification.getLeaderboard('123', 'bids')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error for invalid leaderboard type', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      await expect(SocialGamification.getLeaderboard('123', 'invalid')).rejects.toThrow('Invalid leaderboard type');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid leaderboard type'));
    });
  });

  describe('awardBadge', () => {
    it('awards badge successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.awardBadge.mockResolvedValueOnce({});

      const result = await SocialGamification.awardBadge('123', 'top_bidder');
      expect(result).toEqual({ userId: '123', badgeType: 'top_bidder', status: 'awarded' });
      expect(db.awardBadge).toHaveBeenCalledWith('123', 'top_bidder', expect.any(String));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Awarded badge top_bidder'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(SocialGamification.awardBadge('123', 'top_bidder')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error for invalid badge type', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      await expect(SocialGamification.awardBadge('123', 'invalid')).rejects.toThrow('Invalid badge type');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid badge type'));
    });
  });
});

