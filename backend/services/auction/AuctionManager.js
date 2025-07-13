// File: AuctionManager.js
// Path: C:\CFH\backend\services\auction\AuctionManager.js
// Purpose: Manage auction lifecycle (start, end, bidding)
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const AuctionManager = {
  async startAuction(auctionId) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[AuctionManager] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }
      if (auction.status === 'active') {
        logger.warn(`[AuctionManager] Auction already active for auctionId: ${auctionId}`);
        return { status: 'already active' };
      }

      await db.updateAuction(auctionId, { status: 'active', startTime: new Date().toISOString() });
      logger.info(`[AuctionManager] Started auction for auctionId: ${auctionId}`);
      return { status: 'started' };
    } catch (err) {
      logger.error(`[AuctionManager] Failed to start auction for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  },

  async endAuction(auctionId) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[AuctionManager] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }
      if (auction.status !== 'active') {
        logger.warn(`[AuctionManager] Auction not active for auctionId: ${auctionId}`);
        return { status: 'not active' };
      }

      const highestBid = auction.bids.length > 0 ? Math.max(...auction.bids.map(bid => bid.amount)) : 0;
      const sold = highestBid >= auction.reservePrice;
      await db.updateAuction(auctionId, {
        status: sold ? 'sold' : 'unsold',
        endTime: new Date().toISOString(),
        finalBid: highestBid
      });

      logger.info(`[AuctionManager] Ended auction for auctionId: ${auctionId}, status: ${sold ? 'sold' : 'unsold'}, final bid: ${highestBid}`);
      return { status: sold ? 'sold' : 'unsold', finalBid: highestBid };
    } catch (err) {
      logger.error(`[AuctionManager] Failed to end auction for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  },

  async placeBid(auctionId, bidderId, amount) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[AuctionManager] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }
      if (auction.status !== 'active') {
        logger.error(`[AuctionManager] Auction not active for auctionId: ${auctionId}`);
        throw new Error('Auction not active');
      }

      const newBid = { bidderId, amount, timestamp: new Date().toISOString() };
      await db.addBid(auctionId, newBid);
      logger.info(`[AuctionManager] Bid placed for auctionId: ${auctionId}, bidderId: ${bidderId}, amount: ${amount}`);
      return { status: 'bid placed', bid: newBid };
    } catch (err) {
      logger.error(`[AuctionManager] Failed to place bid for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = AuctionManager;