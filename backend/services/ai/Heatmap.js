// File: Heatmap.js
// Path: C:\CFH\backend\services\ai\Heatmap.js
// Purpose: Generate heatmap data for auction activity visualization
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const Heatmap = {
  async generateHeatmapData(auctionId) {
    try {
      const auctionData = await db.getAuctionData(auctionId);
      if (!auctionData) {
        logger.error(`[Heatmap] Auction data not found for auctionId: ${auctionId}`);
        throw new Error('Auction data not found');
      }

      const { bids } = auctionData;
      const heatmapData = bids.map((bid, index) => ({
        time: index * 24, // Hours since start
        count: bid.amount / 1000, // Scaled for visualization
        intensity: bid.amount > 10000 ? 0.8 : 0.4
      }));

      logger.info(`[Heatmap] Generated heatmap data for auctionId: ${auctionId}`);
      return heatmapData;
    } catch (err) {
      logger.error(`[Heatmap] Failed to generate heatmap data for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = Heatmap;