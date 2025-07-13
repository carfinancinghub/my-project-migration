// File: DynamicPricing.js
// Path: C:\CFH\backend\services\premium\DynamicPricing.js
// Purpose: Provide real-time pricing suggestions for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/ai

const logger = require('@utils/logger');
const db = require('@services/db');
const ai = require('@services/ai');

const DynamicPricing = {
  async getDynamicPrice(userId, auctionId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[DynamicPricing] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[DynamicPricing] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const liveData = {
        currentBid: auction.currentBid,
        bids: auction.bids.map(bid => ({ amount: bid.amount, timestamp: bid.timestamp })),
        timeRemaining: auction.timeRemaining,
        bidderCount: new Set(auction.bids.map(bid => bid.bidderId)).size,
        marketTrends: await db.getRecentAuctionPrices(auction.vehicleDetails?.type || 'unknown', 5) // Last 5 similar auctions
      };

      const pricing = await ai.calculateDynamicPrice(liveData);
      logger.info(`[DynamicPricing] Generated dynamic price for userId: ${userId}, auctionId: ${auctionId}`);
      return {
        suggestedBid: pricing.suggestedBid,
        confidence: pricing.confidence,
        marketTrend: pricing.trend
      };
    } catch (err) {
      logger.error(`[DynamicPricing] Failed to generate dynamic price for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async updatePricingModel(userId, auctionId, userFeedback) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[DynamicPricing] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[DynamicPricing] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      await ai.updatePricingModel({ auctionId, userFeedback });
      logger.info(`[DynamicPricing] Updated pricing model with feedback for userId: ${userId}, auctionId: ${auctionId}`);
      return { status: 'model_updated' };
    } catch (err) {
      logger.error(`[DynamicPricing] Failed to update pricing model for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = DynamicPricing;