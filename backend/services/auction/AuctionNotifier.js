// File: AuctionNotifier.js
// Path: C:\CFH\backend\services\auction\AuctionNotifier.js
// Purpose: Notify users about auction updates
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/notifications

const logger = require('@utils/logger');
const db = require('@services/db');
const notifications = require('@services/notifications');

const AuctionNotifier = {
  async notifyBidPlaced(auctionId, bidderId, amount) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[AuctionNotifier] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const sellerId = auction.sellerId;
      const message = `New bid of $${amount} placed on your auction ${auction.title} by bidder ${bidderId}`;
      await notifications.sendNotification(sellerId, message, 'Bid');
      logger.info(`[AuctionNotifier] Notified seller ${sellerId} of new bid on auctionId: ${auctionId}`);
      return { status: 'notified' };
    } catch (err) {
      logger.error(`[AuctionNotifier] Failed to notify bid placed for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  },

  async notifyAuctionEnded(auctionId, status, finalBid) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[AuctionNotifier] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const sellerId = auction.sellerId;
      const message = `Your auction ${auction.title} has ended: ${status} with a final bid of $${finalBid}`;
      await notifications.sendNotification(sellerId, message, 'Auction');
      logger.info(`[AuctionNotifier] Notified seller ${sellerId} of auction end for auctionId: ${auctionId}`);
      return { status: 'notified' };
    } catch (err) {
      logger.error(`[AuctionNotifier] Failed to notify auction ended for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = AuctionNotifier;