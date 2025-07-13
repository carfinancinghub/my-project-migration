// File: SocialShareHelper.js
// Path: C:\CFH\backend\services\premium\SocialShareHelper.js
// Purpose: Enable social sharing with incentives for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/social

const logger = require('@utils/logger');
const db = require('@services/db');
const social = require('@services/social');
const LoyaltyRewards = require('@services/premium/LoyaltyRewards');

const SocialShareHelper = {
  async generateShareLink(userId, auctionId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[SocialShareHelper] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[SocialShareHelper] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const shareLink = await social.generateShareLink(auctionId, userId);
      logger.info(`[SocialShareHelper] Generated share link for userId: ${userId}, auctionId: ${auctionId}`);
      return { shareLink };
    } catch (err) {
      logger.error(`[SocialShareHelper] Failed to generate share link for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async trackShare(userId, auctionId, platform) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[SocialShareHelper] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      await social.trackShare(userId, auctionId, platform);
      await LoyaltyRewards.addPoints(userId, `share_${platform}`, 5); // 5 points per share

      logger.info(`[SocialShareHelper] Tracked share for userId: ${userId}, auctionId: ${auctionId}, platform: ${platform}`);
      return { status: 'share tracked', pointsEarned: 5 };
    } catch (err) {
      logger.error(`[SocialShareHelper] Failed to track share for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = SocialShareHelper;