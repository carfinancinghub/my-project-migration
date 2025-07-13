// File: PlatformMonitor.js
// Path: C:\CFH\backend\services\officer\PlatformMonitor.js
// Purpose: Monitor platform activity for officers
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const PlatformMonitor = {
  async getPlatformStats(officerId) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[PlatformMonitor] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const activeAuctions = await db.getActiveAuctionsCount();
      const totalUsers = await db.getTotalUsers();
      const recentActivity = await db.getRecentActivity(100); // Last 100 actions

      const stats = {
        activeAuctions,
        totalUsers,
        recentActivity: recentActivity.map(activity => ({
          userId: activity.userId,
          action: activity.action,
          timestamp: activity.timestamp
        }))
      };

      logger.info(`[PlatformMonitor] Retrieved platform stats for officerId: ${officerId}`);
      return stats;
    } catch (err) {
      logger.error(`[PlatformMonitor] Failed to retrieve platform stats for officerId ${officerId}: ${err.message}`, err);
      throw err;
    }
  },

  async flagSuspiciousActivity(officerId, userId, reason) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[PlatformMonitor] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[PlatformMonitor] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      await db.flagUser(userId, { flaggedBy: officerId, reason, flaggedAt: new Date().toISOString() });
      logger.info(`[PlatformMonitor] Flagged suspicious activity for userId: ${userId} by officerId: ${officerId}`);
      return { userId, status: 'flagged', reason };
    } catch (err) {
      logger.error(`[PlatformMonitor] Failed to flag suspicious activity for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = PlatformMonitor;