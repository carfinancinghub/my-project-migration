// File: BlindInvestor.js
// Path: C:\CFH\backend\services\financing\BlindInvestor.js
// Purpose: Manage anonymous investments for buyers
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/websocket

const logger = require('@utils/logger');
const db = require('@services/db');
const websocket = require('@services/websocket');

const BlindInvestor = {
  async offerInvestment(investorId, auctionId, investmentAmount) {
    try {
      const investor = await db.getUser(investorId);
      if (!investor || investor.role !== 'blind_investor') {
        logger.error(`[BlindInvestor] Blind Investor access required for investorId: ${investorId}`);
        throw new Error('Blind Investor access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[BlindInvestor] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const investment = {
        investorId,
        auctionId,
        amount: investmentAmount,
        status: 'offered',
        timestamp: new Date().toISOString()
      };

      const investmentId = await db.saveInvestment(investment);
      await websocket.broadcast(`auction:${auctionId}`, { type: 'investment_offered', investmentId, amount: investmentAmount });
      logger.info(`[BlindInvestor] Offered investment for auctionId: ${auctionId} by investorId: ${investorId}`);
      return { investmentId, status: 'offered' };
    } catch (err) {
      logger.error(`[BlindInvestor] Failed to offer investment for investorId ${investorId}: ${err.message}`, err);
      throw err;
    }
  },

  async acceptInvestment(buyerId, investmentId) {
    try {
      const buyer = await db.getUser(buyerId);
      if (!buyer) {
        logger.error(`[BlindInvestor] Buyer not found for buyerId: ${buyerId}`);
        throw new Error('Buyer not found');
      }

      const investment = await db.getInvestment(investmentId);
      if (!investment || investment.status !== 'offered') {
        logger.error(`[BlindInvestor] Investment not found or not offered for investmentId: ${investmentId}`);
        throw new Error('Investment not found or not offered');
      }

      await db.updateInvestment(investmentId, { status: 'accepted', buyerId });
      await websocket.broadcast(`auction:${investment.auctionId}`, { type: 'investment_accepted', investmentId, buyerId });
      logger.info(`[BlindInvestor] Accepted investment for investmentId: ${investmentId} by buyerId: ${buyerId}`);
      return { status: 'accepted' };
    } catch (err) {
      logger.error(`[BlindInvestor] Failed to accept investment for buyerId ${buyerId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = BlindInvestor;