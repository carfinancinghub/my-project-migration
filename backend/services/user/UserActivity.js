// File: UserActivity.js
// Path: C:\CFH\backend\services\user\UserActivity.js
// Purpose: Track user activity for audit and analytics
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const UserActivity = {
  async logActivity(userId, action, details) {
    try {
      const activity = {
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
      };
      await db.logActivity(activity);
      logger.info(`[UserActivity] Logged activity for userId: ${userId}, action: ${action}`);
      return { status: 'logged' };
    } catch (err) {
      logger.error(`[UserActivity] Failed to log activity for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getActivity(userId) {
    try {
      const activities = await db.getActivitiesByUser(userId);
      if (!activities) {
        logger.error(`[UserActivity] No activities found for userId: ${userId}`);
        throw new Error('No activities found');
      }

      logger.info(`[UserActivity] Retrieved activities for userId: ${userId}`);
      return activities;
    } catch (err) {
      logger.error(`[UserActivity] Failed to retrieve activities for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = UserActivity;