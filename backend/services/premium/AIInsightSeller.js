// File: AIInsightSeller.js
// Path: C:\CFH\backend\services\premium\AIInsightSeller.js
// Purpose: Provide AI-driven insights for premium sellers
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/ai

const logger = require('@utils/logger');
const db = require('@services/db');
const ai = require('@services/ai');

const AIInsightSeller = {
  async optimizeReservePrice(userId, auctionId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[AIInsightSeller] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[AIInsightSeller] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const auctionData = {
        vehicleType: auction.vehicleDetails?.type || 'unknown',
        currentReserve: auction.reservePrice,
        recentBids: auction.bids.map(bid => bid.amount),
        marketTrends: await db.getRecentAuctionPrices(auction.vehicleDetails?.type, 10) // Last 10 similar auctions
      };

      const optimalPrice = await ai.optimizeReservePrice(auctionData);
      logger.info(`[AIInsightSeller] Generated reserve price optimization for userId: ${userId}, auctionId: ${auctionId}`);
      return { suggestedReserve: optimalPrice.value, confidence: optimalPrice.confidence };
    } catch (err) {
      logger.error(`[AIInsightSeller] Failed to optimize reserve price for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getSellerPerformance(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[AIInsightSeller] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auctions = await db.getSellerAuctions(userId);
      if (!auctions || auctions.length === 0) {
        logger.error(`[AIInsightSeller] No auctions found for userId: ${userId}`);
        throw new Error('No auctions found');
      }

      const performanceData = {
        totalAuctions: auctions.length,
        successfulAuctions: auctions.filter(a => a.finalBid >= a.reservePrice).length,
        averageFinalBid: auctions.reduce((sum, a) => sum + (a.finalBid || 0), 0) / auctions.length
      };

      const insights = await ai.analyzeSellerPerformance(performanceData);
      logger.info(`[AIInsightSeller] Generated seller performance insights for userId: ${userId}`);
      return { performance: performanceData, recommendations: insights.recommendations };
    } catch (err) {
      logger.error(`[AIInsightSeller] Failed to get seller performance for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = AIInsightSeller;