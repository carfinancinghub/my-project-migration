// File: BlockchainLedger.js
// Path: C:\CFH\backend\services\blockchain\BlockchainLedger.js
// Purpose: Record auction transactions on a blockchain for transparency
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/blockchain

const logger = require('@utils/logger');
const db = require('@services/db');
const blockchain = require('@services/blockchain');

const BlockchainLedger = {
  async recordBid(auctionId, bidderId, amount) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[BlockchainLedger] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const transaction = {
        auctionId,
        bidderId,
        amount,
        timestamp: new Date().toISOString(),
        type: 'bid'
      };

      const txHash = await blockchain.recordTransaction(transaction);
      await db.logBlockchainTransaction({ ...transaction, txHash });
      logger.info(`[BlockchainLedger] Recorded bid on blockchain for auctionId: ${auctionId}, txHash: ${txHash}`);
      return { txHash, status: 'recorded' };
    } catch (err) {
      logger.error(`[BlockchainLedger] Failed to record bid for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  },

  async getTransactionHistory(auctionId) {
    try {
      const transactions = await db.getBlockchainTransactions(auctionId);
      if (!transactions || transactions.length === 0) {
        logger.error(`[BlockchainLedger] No transactions found for auctionId: ${auctionId}`);
        throw new Error('No transactions found');
      }

      logger.info(`[BlockchainLedger] Retrieved transaction history for auctionId: ${auctionId}`);
      return transactions.map(tx => ({
        txHash: tx.txHash,
        type: tx.type,
        bidderId: tx.bidderId,
        amount: tx.amount,
        timestamp: tx.timestamp
      }));
    } catch (err) {
      logger.error(`[BlockchainLedger] Failed to retrieve transaction history for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = BlockchainLedger;