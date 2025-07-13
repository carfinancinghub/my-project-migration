// File: ListingApproval.js
// Path: C:\CFH\backend\services\officer\ListingApproval.js
// Purpose: Manage approval of auction listings by officers
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const ListingApproval = {
  async approveListing(officerId, auctionId, comments) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[ListingApproval] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[ListingApproval] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      if (auction.status !== 'pending') {
        logger.error(`[ListingApproval] Auction is not in pending status for auctionId: ${auctionId}`);
        throw new Error('Auction is not in pending status');
      }

      await db.updateAuction(auctionId, { status: 'approved', approvedBy: officerId, approvedAt: new Date().toISOString(), comments });
      logger.info(`[ListingApproval] Approved listing for auctionId: ${auctionId} by officerId: ${officerId}`);
      return { auctionId, status: 'approved' };
    } catch (err) {
      logger.error(`[ListingApproval] Failed to approve listing for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  },

  async rejectListing(officerId, auctionId, reason) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[ListingApproval] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[ListingApproval] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      if (auction.status !== 'pending') {
        logger.error(`[ListingApproval] Auction is not in pending status for auctionId: ${auctionId}`);
        throw new Error('Auction is not in pending status');
      }

      await db.updateAuction(auctionId, { status: 'rejected', rejectedBy: officerId, rejectedAt: new Date().toISOString(), reason });
      logger.info(`[ListingApproval] Rejected listing for auctionId: ${auctionId} by officerId: ${officerId}`);
      return { auctionId, status: 'rejected', reason };
    } catch (err) {
      logger.error(`[ListingApproval] Failed to reject listing for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = ListingApproval;