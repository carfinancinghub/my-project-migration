// File: BlockchainAudit.js
// Path: C:\CFH\backend\services\premium\BlockchainAudit.js
// Purpose: Provide blockchain audit trail for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/blockchain

const logger = require('@utils/logger');
const db = require('@services/db');
const blockchain = require('@services/blockchain');

const BlockchainAudit = {
  async logTransaction(userId, auctionId, transactionType, details) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[BlockchainAudit] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const transaction = {
        userId,
        auctionId,
        transactionType,
        details,
        timestamp: new Date().toISOString()
      };
      const hash = await blockchain.recordTransaction(transaction);
      await db.logBlockchainTransaction({ ...transaction, hash });

      logger.info(`[BlockchainAudit] Logged transaction for userId: ${userId}, auctionId: ${auctionId}, hash: ${hash}`);
      return { status: 'logged', hash };
    } catch (err) {
      logger.error(`[BlockchainAudit] Failed to log transaction for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getAuditTrail(userId, auctionId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[BlockchainAudit] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const transactions = await db.getBlockchainTransactions(auctionId);
      if (!transactions || transactions.length === 0) {
        logger.error(`[BlockchainAudit] No audit trail found for auctionId: ${auctionId}`);
        throw new Error('No audit trail found');
      }

      const verifiedTransactions = await Promise.all(transactions.map(async tx => {
        const isValid = await blockchain.verifyTransaction(tx.hash, tx);
        return { ...tx, isValid };
      }));

      logger.info(`[BlockchainAudit] Retrieved audit trail for userId: ${userId}, auctionId: ${auctionId}`);
      return verifiedTransactions;
    } catch (err) {
      logger.error(`[BlockchainAudit] Failed to retrieve audit trail for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = BlockchainAudit;