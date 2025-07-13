// File: AuctionPerformance.js
// Path: C:\CFH\backend\services\analytics\AuctionPerformance.js
// Purpose: Analyze auction performance for insights
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const AuctionPerformance = {
  async calculatePerformance(auctionId) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[AuctionPerformance] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const performance = {
        totalBids: auction.bids.length,
        bidFrequency: auction.bids.length / ((new Date(auction.endTime) - new Date(auction.startTime)) / (1000 * 60 * 60)), // bids per hour
        success: auction.finalBid >= auction.reservePrice,
        finalBid: auction.finalBid || 0,
        reservePrice: auction.reservePrice,
        bidderCount: new Set(auction.bids.map(bid => bid.bidderId)).size
      };

      logger.info(`[AuctionPerformance] Calculated performance for auctionId: ${auctionId}`);
      return performance;
    } catch (err) {
      logger.error(`[AuctionPerformance] Failed to calculate performance for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  },

  async getPerformanceTrends(sellerId, startDate, endDate) {
    try {
      const auctions = await db.getSellerAuctionsByDate(sellerId, startDate, endDate);
      if (!auctions || auctions.length === 0) {
        logger.error(`[AuctionPerformance] No auctions found for sellerId: ${sellerId}`);
        throw new Error('No auctions found');
      }

      const trends = auctions.map(auction => ({
        auctionId: auction.id,
        success: auction.finalBid >= auction.reservePrice,
        bidderCount: new Set(auction.bids.map(bid => bid.bidderId)).size,
        finalBid: auction.finalBid || 0,
        timestamp: auction.endTime
      }));

      const successRate = trends.filter(t => t.success).length / trends.length;
      const avgBidderCount = trends.reduce((sum, t) => sum + t.bidderCount, 0) / trends.length;

      logger.info(`[AuctionPerformance] Generated performance trends for sellerId: ${sellerId}`);
      return { successRate, avgBidderCount, trends };
    } catch (err) {
      logger.error(`[AuctionPerformance] Failed to generate performance trends for sellerId ${sellerId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = AuctionPerformance;