// File: DisputeManager.js
// Path: C:\CFH\backend\services\officer\DisputeManager.js
// Purpose: Manage disputes raised by users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const DisputeManager = {
  async createDispute(officerId, userId, auctionId, reason) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[DisputeManager] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[DisputeManager] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[DisputeManager] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const dispute = {
        userId,
        auctionId,
        officerId,
        reason,
        status: 'open',
        createdAt: new Date().toISOString()
      };
      const disputeId = await db.createDispute(dispute);

      logger.info(`[DisputeManager] Created dispute for userId: ${userId}, auctionId: ${auctionId}, disputeId: ${disputeId}`);
      return { disputeId, status: 'created' };
    } catch (err) {
      logger.error(`[DisputeManager] Failed to create dispute for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async resolveDispute(officerId, disputeId, resolution) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[DisputeManager] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const dispute = await db.getDispute(disputeId);
      if (!dispute) {
        logger.error(`[DisputeManager] Dispute not found for disputeId: ${disputeId}`);
        throw new Error('Dispute not found');
      }

      await db.updateDispute(disputeId, { status: 'resolved', resolution, resolvedAt: new Date().toISOString() });
      logger.info(`[DisputeManager] Resolved dispute for disputeId: ${disputeId} by officerId: ${officerId}`);
      return { disputeId, status: 'resolved', resolution };
    } catch (err) {
      logger.error(`[DisputeManager] Failed to resolve dispute for disputeId ${disputeId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = DisputeManager;