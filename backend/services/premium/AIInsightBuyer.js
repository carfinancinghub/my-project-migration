// File: AIInsightBuyer.js
// Path: C:\CFH\backend\services\premium\AIInsightBuyer.js
// Purpose: Provide AI-driven insights for premium buyers
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/ai

const logger = require('@utils/logger');
const db = require('@services/db');
const ai = require('@services/ai');

const AIInsightBuyer = {
  async getBiddingStrategy(userId, auctionId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[AIInsightBuyer] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[AIInsightBuyer] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const userBids = auction.bids.filter(bid => bid.bidderId === userId);
      const bidData = {
        userBids: userBids.map(bid => ({ amount: bid.amount, timestamp: bid.timestamp })),
        auctionBids: auction.bids.map(bid => ({ amount: bid.amount, timestamp: bid.timestamp })),
        timeRemaining: auction.timeRemaining,
        currentBid: auction.currentBid
      };

      const strategy = await ai.generateBiddingStrategy(bidData);
      logger.info(`[AIInsightBuyer] Generated bidding strategy for userId: ${userId}, auctionId: ${auctionId}`);
      return { strategy: strategy.recommendation, confidence: strategy.confidence };
    } catch (err) {
      logger.error(`[AIInsightBuyer] Failed to generate bidding strategy for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getMarketTrends(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[AIInsightBuyer] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const recentAuctions = await db.getRecentAuctions(100); // Last 100 auctions
      const marketData = recentAuctions.map(auction => ({
        finalBid: auction.finalBid || 0,
        vehicleType: auction.vehicleDetails?.type || 'unknown',
        bidderCount: auction.bids.length,
        timestamp: auction.endTime
      }));

      const trends = await ai.analyzeMarketTrends(marketData);
      logger.info(`[AIInsightBuyer] Generated market trends for userId: ${userId}`);
      return { trends: trends.insights, topVehicleTypes: trends.topVehicleTypes };
    } catch (err) {
      logger.error(`[AIInsightBuyer] Failed to generate market trends for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = AIInsightBuyer;