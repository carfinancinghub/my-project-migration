// File: InsightGenerator.js
// Path: C:\CFH\backend\services\analytics\InsightGenerator.js
// Purpose: Generate actionable insights from analytics data
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/ai

const logger = require('@utils/logger');
const db = require('@services/db');
const ai = require('@services/ai');

const InsightGenerator = {
  async generateUserInsights(userId, startDate, endDate) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[InsightGenerator] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const behaviors = await db.getBehaviorsByUser(userId, startDate, endDate);
      if (!behaviors || behaviors.length === 0) {
        logger.error(`[InsightGenerator] No behavior data found for userId: ${userId}`);
        throw new Error('No behavior data found');
      }

      const userData = {
        actions: behaviors.map(b => ({ action: b.action, timestamp: b.timestamp, details: b.details })),
        totalActions: behaviors.length,
        userRole: user.role
      };

      const insights = await ai.generateInsights(userData);
      logger.info(`[InsightGenerator] Generated user insights for userId: ${userId}`);
      return { userId, insights: insights.recommendations || ['No insights available.'] };
    } catch (err) {
      logger.error(`[InsightGenerator] Failed to generate user insights for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async generateAuctionInsights(auctionId) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[InsightGenerator] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const auctionData = {
        bids: auction.bids,
        finalBid: auction.finalBid || 0,
        reservePrice: auction.reservePrice,
        bidderCount: new Set(auction.bids.map(bid => bid.bidderId)).size,
        duration: (new Date(auction.endTime) - new Date(auction.startTime)) / (1000 * 60 * 60) // in hours
      };

      const insights = await ai.generateAuctionInsights(auctionData);
      logger.info(`[InsightGenerator] Generated auction insights for auctionId: ${auctionId}`);
      return { auctionId, insights: insights.recommendations || ['No insights available.'] };
    } catch (err) {
      logger.error(`[InsightGenerator] Failed to generate auction insights for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = InsightGenerator;