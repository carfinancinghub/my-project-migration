// File: AuctionMetrics.js
// Path: C:\CFH\backend\services\auction\AuctionMetrics.js
// Purpose: Track and calculate auction metrics for analytics
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const AuctionMetrics = {
  async calculateMetrics(auctionId) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[AuctionMetrics] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const { bids, reservePrice, startTime, endTime } = auction;
      const metrics = {
        totalBids: bids.length,
        highestBid: bids.length > 0 ? Math.max(...bids.map(bid => bid.amount)) : 0,
        averageBid: bids.length > 0 ? bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length : 0,
        bidIncrement: bids.length > 1 ? (bids[bids.length - 1].amount - bids[bids.length - 2].amount) : 0,
        reserveMet: bids.length > 0 && Math.max(...bids.map(bid => bid.amount)) >= reservePrice,
        durationHours: endTime && startTime ? (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60) : 0
      };

      logger.info(`[AuctionMetrics] Calculated metrics for auctionId: ${auctionId}`);
      return metrics;
    } catch (err) {
      logger.error(`[AuctionMetrics] Failed to calculate metrics for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  },

  async aggregateMetrics(sellerId) {
    try {
      const auctions = await db.getSellerAuctions(sellerId);
      if (!auctions || auctions.length === 0) {
        logger.error(`[AuctionMetrics] No auctions found for sellerId: ${sellerId}`);
        throw new Error('No auctions found');
      }

      const metrics = {
        totalAuctions: auctions.length,
        activeAuctions: auctions.filter(a => a.status === 'active').length,
        totalRevenue: auctions.filter(a => a.status === 'sold').reduce((sum, a) => sum + (a.finalBid || 0), 0),
        avgBid: auctions.reduce((sum, a) => sum + (a.bids.length > 0 ? a.bids.reduce((bSum, b) => bSum + b.amount, 0) / a.bids.length : 0), 0) / auctions.length
      };

      logger.info(`[AuctionMetrics] Aggregated metrics for sellerId: ${sellerId}`);
      return metrics;
    } catch (err) {
      logger.error(`[AuctionMetrics] Failed to aggregate metrics for sellerId ${sellerId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = AuctionMetrics;