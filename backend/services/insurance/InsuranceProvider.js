// File: InsuranceProvider.js
// Path: C:\CFH\backend\services\insurance\InsuranceProvider.js
// Purpose: Manage insurance offerings for vehicles and delivery
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/websocket

const logger = require('@utils/logger');
const db = require('@services/db');
const websocket = require('@services/websocket');

const InsuranceProvider = {
  async offerInsurance(providerId, auctionId, insuranceData) {
    try {
      const provider = await db.getUser(providerId);
      if (!provider || provider.role !== 'insurance_provider') {
        logger.error(`[InsuranceProvider] Insurance Provider access required for providerId: ${providerId}`);
        throw new Error('Insurance Provider access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[InsuranceProvider] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const insuranceOffer = {
        providerId,
        auctionId,
        coverageType: insuranceData.coverageType, // e.g., "vehicle", "delivery"
        premium: insuranceData.premium,
        duration: insuranceData.duration,
        status: 'offered',
        timestamp: new Date().toISOString()
      };

      const offerId = await db.saveInsuranceOffer(insuranceOffer);
      await websocket.broadcast(`auction:${auctionId}`, { type: 'insurance_offered', offerId });
      logger.info(`[InsuranceProvider] Offered insurance for auctionId: ${auctionId} by providerId: ${providerId}`);
      return { offerId, status: 'offered' };
    } catch (err) {
      logger.error(`[InsuranceProvider] Failed to offer insurance for providerId ${providerId}: ${err.message}`, err);
      throw err;
    }
  },

  async purchaseInsurance(userId, offerId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[InsuranceProvider] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const insuranceOffer = await db.getInsuranceOffer(offerId);
      if (!insuranceOffer || insuranceOffer.status !== 'offered') {
        logger.error(`[InsuranceProvider] Insurance offer not found or not offered for offerId: ${offerId}`);
        throw new Error('Insurance offer not found or not offered');
      }

      await db.updateInsuranceOffer(offerId, { status: 'purchased', userId });
      await websocket.broadcast(`auction:${insuranceOffer.auctionId}`, { type: 'insurance_purchased', offerId, userId });
      logger.info(`[InsuranceProvider] Purchased insurance for offerId: ${offerId} by userId: ${userId}`);
      return { status: 'purchased' };
    } catch (err) {
      logger.error(`[InsuranceProvider] Failed to purchase insurance for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = InsuranceProvider;