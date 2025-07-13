// File: FeedbackReport.js
// Path: C:\CFH\backend\services\operational\FeedbackReport.js
// Purpose: Generate feedback reports for officers
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const FeedbackReport = {
  async generateFeedbackReport(officerId, startDate, endDate) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[FeedbackReport] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const feedback = await db.getFeedbackByDate(startDate, endDate);
      if (!feedback || feedback.length === 0) {
        logger.error(`[FeedbackReport] No feedback found for date range ${startDate} to ${endDate}`);
        throw new Error('No feedback found');
      }

      const report = {
        totalFeedback: feedback.length,
        averageRating: feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length,
        feedbackByAuction: feedback.reduce((acc, f) => {
          acc[f.auctionId] = acc[f.auctionId] || [];
          acc[f.auctionId].push(f);
          return acc;
        }, {}),
        dateRange: { startDate, endDate }
      };

      logger.info(`[FeedbackReport] Generated feedback report for officerId: ${officerId}`);
      return report;
    } catch (err) {
      logger.error(`[FeedbackReport] Failed to generate feedback report for officerId ${officerId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = FeedbackReport;