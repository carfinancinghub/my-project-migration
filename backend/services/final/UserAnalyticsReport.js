// File: UserAnalyticsReport.js
// Path: C:\CFH\backend\services\final\UserAnalyticsReport.js
// Purpose: Generate user analytics reports for final review
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const UserAnalyticsReport = {
  async generateActivityReport(startDate, endDate) {
    try {
      const userActivity = await db.getUserActivity(startDate, endDate);
      if (!userActivity || userActivity.length === 0) {
        logger.error(`[UserAnalyticsReport] No user activity found for date range ${startDate} to ${endDate}`);
        throw new Error('No user activity found');
      }

      const report = {
        totalUsers: new Set(userActivity.map(a => a.userId)).size,
        totalActions: userActivity.length,
        actionsByType: userActivity.reduce((acc, action) => {
          acc[action.action] = (acc[action.action] || 0) + 1;
          return acc;
        }, {}),
        dateRange: { startDate, endDate }
      };

      logger.info(`[UserAnalyticsReport] Generated activity report for date range ${startDate} to ${endDate}`);
      return report;
    } catch (err) {
      logger.error(`[UserAnalyticsReport] Failed to generate activity report: ${err.message}`, err);
      throw err;
    }
  },

  async generateEngagementReport(startDate, endDate) {
    try {
      const auctions = await db.getAuctionsByDate(startDate, endDate);
      if (!auctions || auctions.length === 0) {
        logger.error(`[UserAnalyticsReport] No auctions found for date range ${startDate} to ${endDate}`);
        throw new Error('No auctions found');
      }

      const report = {
        totalAuctions: auctions.length,
        totalBids: auctions.reduce((sum, a) => sum + a.bids.length, 0),
        averageBidsPerAuction: auctions.reduce((sum, a) => sum + a.bids.length, 0) / auctions.length,
        activeUsers: new Set(auctions.flatMap(a => a.bids.map(b => b.bidderId))).size,
        dateRange: { startDate, endDate }
      };

      logger.info(`[UserAnalyticsReport] Generated engagement report for date range ${startDate} to ${endDate}`);
      return report;
    } catch (err) {
      logger.error(`[UserAnalyticsReport] Failed to generate engagement report: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = UserAnalyticsReport;