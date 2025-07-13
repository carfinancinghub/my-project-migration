// File: MobileBidHandler.js
// Path: C:\CFH\backend\services\mobile\MobileBidHandler.js
// Purpose: Handle bids from mobile users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/auction

const logger = require('@utils/logger');
const db = require('@services/db');
const AuctionManager = require('@services/auction/AuctionManager');

const MobileBidHandler = {
  async placeBid(userId, auctionId, amount, deviceInfo) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[MobileBidHandler] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const result = await AuctionManager.placeBid(auctionId, userId, amount);
      await db.logMobileAction(userId, 'place_bid', { auctionId, amount, deviceInfo });

      logger.info(`[MobileBidHandler] Mobile bid placed for userId: ${userId}, auctionId: ${auctionId}, amount: ${amount}`);
      return { status: 'bid placed', bid: result.bid };
    } catch (err) {
      logger.error(`[MobileBidHandler] Failed to place mobile bid for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getBidHistory(userId, auctionId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[MobileBidHandler] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[MobileBidHandler] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const bids = auction.bids.filter(bid => bid.bidderId === userId);
      logger.info(`[MobileBidHandler] Retrieved bid history for userId: ${userId}, auctionId: ${auctionId}`);
      return bids.map(bid => ({
        amount: bid.amount,
        timestamp: bid.timestamp
      }));
    } catch (err) {
      logger.error(`[MobileBidHandler] Failed to retrieve bid history for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = MobileBidHandler;