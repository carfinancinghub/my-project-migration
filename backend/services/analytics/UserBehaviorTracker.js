// File: UserBehaviorTracker.js
// Path: C:\CFH\backend\services\analytics\UserBehaviorTracker.js
// Purpose: Track user behavior for analytics and insights
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const UserBehaviorTracker = {
  async trackAction(userId, action, details) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserBehaviorTracker] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const behavior = {
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
      };
      await db.logBehavior(behavior);

      logger.info(`[UserBehaviorTracker] Tracked action for userId: ${userId}, action: ${action}`);
      return { status: 'tracked' };
    } catch (err) {
      logger.error(`[UserBehaviorTracker] Failed to track action for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getUserBehavior(userId, startDate, endDate) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserBehaviorTracker] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const behaviors = await db.getBehaviorsByUser(userId, startDate, endDate);
      if (!behaviors || behaviors.length === 0) {
        logger.error(`[UserBehaviorTracker] No behavior data found for userId: ${userId}`);
        throw new Error('No behavior data found');
      }

      logger.info(`[UserBehaviorTracker] Retrieved behavior data for userId: ${userId}`);
      return behaviors;
    } catch (err) {
      logger.error(`[UserBehaviorTracker] Failed to retrieve behavior data for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = UserBehaviorTracker;