// File: PostAuctionInsights.js
// Path: C:\CFH\backend\services\premium\PostAuctionInsights.js
// Purpose: Provide AI-driven post-auction insights for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/ai

const logger = require('@utils/logger');
const db = require('@services/db');
const ai = require('@services/ai');

const PostAuctionInsights = {
  async analyzeAuction(userId, auctionId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[PostAuctionInsights] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[PostAuctionInsights] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const auctionData = {
        bids: auction.bids,
        finalBid: auction.finalBid || 0,
        reservePrice: auction.reservePrice,
        bidderCount: auction.bids.length,
        duration: (new Date(auction.endTime) - new Date(auction.startTime)) / (1000 * 60 * 60) // in hours
      };

      const insights = await ai.analyzeAuction(auctionData);
      const report = {
        biddingTrends: insights.trends,
        performanceScore: insights.score,
        recommendations: insights.recommendations || ['No recommendations available.']
      };

      logger.info(`[PostAuctionInsights] Generated insights for userId: ${userId}, auctionId: ${auctionId}`);
      return report;
    } catch (err) {
      logger.error(`[PostAuctionInsights] Failed to analyze auction for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getComparativeAnalysis(userId, auctionIds) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[PostAuctionInsights] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auctions = await Promise.all(auctionIds.map(async id => {
        const auction = await db.getAuction(id);
        if (!auction) throw new Error(`Auction not found: ${id}`);
        return auction;
      }));

      const comparativeData = auctions.map(auction => ({
        auctionId: auction.id,
        finalBid: auction.finalBid || 0,
        bidderCount: auction.bids.length,
        success: auction.finalBid >= auction.reservePrice
      }));

      const analysis = await ai.compareAuctions(comparativeData);
      logger.info(`[PostAuctionInsights] Generated comparative analysis for userId: ${userId}, auctionIds: ${auctionIds.join(', ')}`);
      return { comparativeAnalysis: analysis };
    } catch (err) {
      logger.error(`[PostAuctionInsights] Failed to generate comparative analysis for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = PostAuctionInsights;