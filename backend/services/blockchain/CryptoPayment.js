// File: CryptoPayment.js
// Path: C:\CFH\backend\services\blockchain\CryptoPayment.js
// Purpose: Handle cryptocurrency payments for auctions
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/blockchain

const logger = require('@utils/logger');
const db = require('@services/db');
const blockchain = require('@services/blockchain');

const CryptoPayment = {
  async processCryptoPayment(userId, auctionId, amount, currency) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[CryptoPayment] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[CryptoPayment] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const supportedCurrencies = ['BTC', 'ETH'];
      if (!supportedCurrencies.includes(currency)) {
        logger.error(`[CryptoPayment] Unsupported currency ${currency} for userId: ${userId}`);
        throw new Error('Unsupported cryptocurrency');
      }

      const payment = await blockchain.processCryptoPayment(userId, amount, currency);
      await db.logPayment({ userId, auctionId, amount, currency, txHash: payment.txHash, status: 'completed' });

      logger.info(`[CryptoPayment] Processed crypto payment for userId: ${userId}, auctionId: ${auctionId}, currency: ${currency}`);
      return { txHash: payment.txHash, status: 'completed' };
    } catch (err) {
      logger.error(`[CryptoPayment] Failed to process crypto payment for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = CryptoPayment;