// File: BidValidator.js
// Path: C:\CFH\backend\services\auction\BidValidator.js
// Purpose: Validate bids for auctions
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const BidValidator = {
  async validateBid(auctionId, bidderId, amount) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[BidValidator] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }
      if (auction.status !== 'active') {
        logger.error(`[BidValidator] Auction not active for auctionId: ${auctionId}`);
        throw new Error('Auction not active');
      }

      const bidder = await db.getUser(bidderId);
      if (!bidder) {
        logger.error(`[BidValidator] Bidder not found for bidderId: ${bidderId}`);
        throw new Error('Bidder not found');
      }

      if (amount <= 0) {
        logger.error(`[BidValidator] Invalid bid amount: ${amount} for auctionId: ${auctionId}`);
        throw new Error('Bid amount must be greater than zero');
      }

      const currentHighestBid = auction.bids.length > 0 ? Math.max(...auction.bids.map(bid => bid.amount)) : 0;
      if (amount <= currentHighestBid) {
        logger.error(`[BidValidator] Bid amount ${amount} is not higher than current highest bid ${currentHighestBid} for auctionId: ${auctionId}`);
        throw new Error('Bid must be higher than the current highest bid');
      }

      logger.info(`[BidValidator] Bid validated for auctionId: ${auctionId}, bidderId: ${bidderId}, amount: ${amount}`);
      return { valid: true };
    } catch (err) {
      logger.error(`[BidValidator] Failed to validate bid for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = BidValidator;