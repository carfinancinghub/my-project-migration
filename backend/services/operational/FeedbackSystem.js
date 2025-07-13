// File: FeedbackSystem.js
// Path: C:\CFH\backend\services\operational\FeedbackSystem.js
// Purpose: Collect and manage user feedback post-auction
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const FeedbackSystem = {
  async submitFeedback(userId, auctionId, rating, comments) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[FeedbackSystem] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[FeedbackSystem] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      if (rating < 1 || rating > 5) {
        logger.error(`[FeedbackSystem] Invalid rating ${rating} for userId: ${userId}`);
        throw new Error('Rating must be between 1 and 5');
      }

      const feedback = {
        userId,
        auctionId,
        rating,
        comments,
        submittedAt: new Date().toISOString()
      };
      const feedbackId = await db.saveFeedback(feedback);

      logger.info(`[FeedbackSystem] Submitted feedback for userId: ${userId}, auctionId: ${auctionId}, feedbackId: ${feedbackId}`);
      return { feedbackId, status: 'submitted' };
    } catch (err) {
      logger.error(`[FeedbackSystem] Failed to submit feedback for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getFeedbackForAuction(auctionId) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[FeedbackSystem] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const feedback = await db.getFeedbackByAuction(auctionId);
      if (!feedback || feedback.length === 0) {
        logger.error(`[FeedbackSystem] No feedback found for auctionId: ${auctionId}`);
        throw new Error('No feedback found');
      }

      logger.info(`[FeedbackSystem] Retrieved feedback for auctionId: ${auctionId}`);
      return feedback.map(f => ({
        userId: f.userId,
        rating: f.rating,
        comments: f.comments,
        submittedAt: f.submittedAt
      }));
    } catch (err) {
      logger.error(`[FeedbackSystem] Failed to retrieve feedback for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = FeedbackSystem;