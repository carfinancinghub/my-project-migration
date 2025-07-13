// File: PerformanceOptimizer.js
// Path: C:\CFH\backend\services\operational\PerformanceOptimizer.js
// Purpose: Optimize API performance for the platform
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/cache

const logger = require('@utils/logger');
const db = require('@services/db');
const cache = require('@services/cache');

const PerformanceOptimizer = {
  async cacheAuctionData(auctionId) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[PerformanceOptimizer] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      await cache.set(`auction:${auctionId}`, auction, 300); // Cache for 5 minutes
      logger.info(`[PerformanceOptimizer] Cached auction data for auctionId: ${auctionId}`);
      return { status: 'cached', auctionId };
    } catch (err) {
      logger.error(`[PerformanceOptimizer] Failed to cache auction data for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  },

  async getCachedAuctionData(auctionId) {
    try {
      const cachedData = await cache.get(`auction:${auctionId}`);
      if (cachedData) {
        logger.info(`[PerformanceOptimizer] Retrieved cached auction data for auctionId: ${auctionId}`);
        return { data: cachedData, source: 'cache' };
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[PerformanceOptimizer] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      await this.cacheAuctionData(auctionId);
      logger.info(`[PerformanceOptimizer] Fetched and cached auction data for auctionId: ${auctionId}`);
      return { data: auction, source: 'database' };
    } catch (err) {
      logger.error(`[PerformanceOptimizer] Failed to retrieve auction data for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = PerformanceOptimizer;