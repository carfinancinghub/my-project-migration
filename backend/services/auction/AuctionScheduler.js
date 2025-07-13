// File: AuctionScheduler.js
// Path: C:\CFH\backend\services\auction\AuctionScheduler.js
// Purpose: Schedule auction start and end times with cron jobs
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, node-cron

const logger = require('@utils/logger');
const db = require('@services/db');
const cron = require('node-cron');
const AuctionManager = require('@services/auction/AuctionManager');

const AuctionScheduler = {
  scheduleAuctions() {
    // Run every minute to check for auctions to start or end
    cron.schedule('* * * * *', async () => {
      try {
        const now = new Date();
        const pendingAuctions = await db.getPendingAuctions();
        const activeAuctions = await db.getActiveAuctions();

        // Start pending auctions
        for (const auction of pendingAuctions) {
          if (new Date(auction.startTime) <= now) {
            await AuctionManager.startAuction(auction.id);
            logger.info(`[AuctionScheduler] Scheduled start for auctionId: ${auction.id}`);
          }
        }

        // End active auctions
        for (const auction of activeAuctions) {
          if (new Date(auction.endTime) <= now) {
            await AuctionManager.endAuction(auction.id);
            logger.info(`[AuctionScheduler] Scheduled end for auctionId: ${auction.id}`);
          }
        }
      } catch (err) {
        logger.error(`[AuctionScheduler] Failed to schedule auctions: ${err.message}`, err);
      }
    });
    logger.info('[AuctionScheduler] Auction scheduling started');
  },

  async scheduleAuction(auctionId, startTime, endTime) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[AuctionScheduler] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      await db.updateAuction(auctionId, { startTime, endTime });
      logger.info(`[AuctionScheduler] Scheduled auctionId: ${auctionId} to start at ${startTime} and end at ${endTime}`);
      return { status: 'scheduled' };
    } catch (err) {
      logger.error(`[AuctionScheduler] Failed to schedule auction for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = AuctionScheduler;