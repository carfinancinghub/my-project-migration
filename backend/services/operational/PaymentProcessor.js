// File: PaymentProcessor.js
// Path: C:\CFH\backend\services\operational\PaymentProcessor.js
// Purpose: Handle payment processing and refunds
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/payment

const logger = require('@utils/logger');
const db = require('@services/db');
const payment = require('@services/payment');

const PaymentProcessor = {
  async processPayment(userId, auctionId, amount) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[PaymentProcessor] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[PaymentProcessor] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const transaction = await payment.process(userId, amount, 'Auction payment');
      await db.logTransaction({ userId, auctionId, amount, transactionId: transaction.id, status: 'completed' });

      logger.info(`[PaymentProcessor] Processed payment for userId: ${userId}, auctionId: ${auctionId}, amount: ${amount}`);
      return { transactionId: transaction.id, status: 'completed' };
    } catch (err) {
      logger.error(`[PaymentProcessor] Failed to process payment for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async processRefund(userId, transactionId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[PaymentProcessor] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const transaction = await db.getTransaction(transactionId);
      if (!transaction) {
        logger.error(`[PaymentProcessor] Transaction not found for transactionId: ${transactionId}`);
        throw new Error('Transaction not found');
      }

      await payment.refund(transactionId, transaction.amount);
      await db.updateTransaction(transactionId, { status: 'refunded', refundedAt: new Date().toISOString() });

      logger.info(`[PaymentProcessor] Processed refund for userId: ${userId}, transactionId: ${transactionId}`);
      return { transactionId, status: 'refunded' };
    } catch (err) {
      logger.error(`[PaymentProcessor] Failed to process refund for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = PaymentProcessor;