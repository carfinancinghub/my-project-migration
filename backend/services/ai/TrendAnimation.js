// File: TrendAnimation.js
// Path: C:\CFH\backend\services\ai\TrendAnimation.js
// Purpose: Generate trend animations for auction data visualization
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const TrendAnimation = {
  async generateTrendData(auctionId) {
    try {
      const auctionData = await db.getAuctionData(auctionId);
      if (!auctionData) {
        logger.error(`[TrendAnimation] Auction data not found for auctionId: ${auctionId}`);
        throw new Error('Auction data not found');
      }

      const { bids, startTime } = auctionData;
      const trendData = bids.map((bid, index) => ({
        date: new Date(startTime).getTime() + index * 3600 * 1000, // Increment by hour
        count: bid.amount,
        style: bid.amount > 10000 ? 'gradient-red' : 'gradient-blue',
        hover: 'tooltip',
        animation: { type: 'fade-in', duration: '0.5s' }
      }));

      logger.info(`[TrendAnimation] Generated trend data for auctionId: ${auctionId}`);
      return trendData;
    } catch (err) {
      logger.error(`[TrendAnimation] Failed to generate trend data for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = TrendAnimation;