// File: AuctionHistory.js
// Path: C:\CFH\backend\services\auction\AuctionHistory.js
// Purpose: Track and retrieve auction history for users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const AuctionHistory = {
  async getSellerHistory(sellerId) {
    try {
      const auctions = await db.getSellerAuctions(sellerId);
      if (!auctions) {
        logger.error(`[AuctionHistory] No auction history found for sellerId: ${sellerId}`);
        throw new Error('No auction history found');
      }

      const history = auctions.map(auction => ({
        id: auction.id,
        title: auction.title,
        status: auction.status,
        finalBid: auction.finalBid || 0,
        endTime: auction.endTime || 'N/A'
      }));

      logger.info(`[AuctionHistory] Retrieved seller history for sellerId: ${sellerId}`);
      return history;
    } catch (err) {
      logger.error(`[AuctionHistory] Failed to retrieve seller history for sellerId ${sellerId}: ${err.message}`, err);
      throw err;
    }
  },

  async getBidderHistory(bidderId) {
    try {
      const bids = await db.getBidsByUser(bidderId);
      if (!bids) {
        logger.error(`[AuctionHistory] No bid history found for bidderId: ${bidderId}`);
        throw new Error('No bid history found');
      }

      const history = await Promise.all(bids.map(async bid => {
        const auction = await db.getAuction(bid.auctionId);
        return {
          auctionId: bid.auctionId,
          title: auction ? auction.title : 'Unknown Auction',
          bidAmount: bid.amount,
          timestamp: bid.timestamp,
          status: auction ? auction.status : 'Unknown'
        };
      }));

      logger.info(`[AuctionHistory] Retrieved bidder history for bidderId: ${bidderId}`);
      return history;
    } catch (err) {
      logger.error(`[AuctionHistory] Failed to retrieve bidder history for bidderId ${bidderId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = AuctionHistory;