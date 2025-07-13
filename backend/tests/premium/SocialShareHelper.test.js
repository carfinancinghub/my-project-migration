// File: SocialShareHelper.test.js
// Path: C:\CFH\backend\tests\premium\SocialShareHelper.test.js
// Purpose: Unit tests for SocialShareHelper service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const SocialShareHelper = require('@services/premium/SocialShareHelper');
const db = require('@services/db');
const social = require('@services/social');
const LoyaltyRewards = require('@services/premium/LoyaltyRewards');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/social');
jest.mock('@services/premium/LoyaltyRewards');
jest.mock('@utils/logger');

describe('SocialShareHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateShareLink', () => {
    it('generates share link successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = { id: '789' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      social.generateShareLink.mockResolvedValueOnce('https://share-link.com/auction/789');

      const result = await SocialShareHelper.generateShareLink('123', '789');
      expect(result).toEqual({ shareLink: 'https://share-link.com/auction/789' });
      expect(social.generateShareLink).toHaveBeenCalledWith('789', '123');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated share link'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(SocialShareHelper.generateShareLink('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(SocialShareHelper.generateShareLink('123', '789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('trackShare', () => {
    it('tracks share and awards points successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      db.getUser.mockResolvedValueOnce(mockUser);
      social.trackShare.mockResolvedValueOnce({});
      LoyaltyRewards.addPoints.mockResolvedValueOnce({ status: 'points added', totalPoints: 55 });

      const result = await SocialShareHelper.trackShare('123', '789', 'twitter');
      expect(result).toEqual({ status: 'share tracked', pointsEarned: 5 });
      expect(social.trackShare).toHaveBeenCalledWith('123', '789', 'twitter');
      expect(LoyaltyRewards.addPoints).toHaveBeenCalledWith('123', 'share_twitter', 5);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Tracked share'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(SocialShareHelper.trackShare('123', '789', 'twitter')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error on tracking failure', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      social.trackShare.mockRejectedValueOnce(new Error('Social error'));
      await expect(SocialShareHelper.trackShare('123', '789', 'twitter')).rejects.toThrow('Social error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to track share'));
    });
  });
});

