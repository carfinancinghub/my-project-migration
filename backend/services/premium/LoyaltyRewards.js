// File: LoyaltyRewards.js
// Path: C:\CFH\backend\services\premium\LoyaltyRewards.js
// Purpose: Manage gamified loyalty rewards for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const LoyaltyRewards = {
  async addPoints(userId, action, points) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[LoyaltyRewards] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const currentPoints = user.points || 0;
      const newPoints = currentPoints + points;
      await db.updateUser(userId, { points: newPoints });

      const reward = { userId, action, points, timestamp: new Date().toISOString() };
      await db.logReward(reward);

      logger.info(`[LoyaltyRewards] Added ${points} points for userId: ${userId}, action: ${action}`);
      return { status: 'points added', totalPoints: newPoints };
    } catch (err) {
      logger.error(`[LoyaltyRewards] Failed to add points for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async redeemReward(userId, rewardType) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[LoyaltyRewards] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const rewardCosts = { discount: 100, exclusiveAccess: 500 };
      const cost = rewardCosts[rewardType];
      if (!cost) {
        logger.error(`[LoyaltyRewards] Invalid reward type ${rewardType} for userId: ${userId}`);
        throw new Error('Invalid reward type');
      }

      const currentPoints = user.points || 0;
      if (currentPoints < cost) {
        logger.error(`[LoyaltyRewards] Insufficient points for userId: ${userId}, required: ${cost}, available: ${currentPoints}`);
        throw new Error('Insufficient points');
      }

      const newPoints = currentPoints - cost;
      await db.updateUser(userId, { points: newPoints });
      await db.logRewardRedemption({ userId, rewardType, cost, timestamp: new Date().toISOString() });

      logger.info(`[LoyaltyRewards] Redeemed ${rewardType} for userId: ${userId}, cost: ${cost} points`);
      return { status: 'redeemed', remainingPoints: newPoints, rewardType };
    } catch (err) {
      logger.error(`[LoyaltyRewards] Failed to redeem reward for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = LoyaltyRewards;