// File: CrossBorderCommerce.js
// Path: C:\CFH\backend\services\premium\CrossBorderCommerce.js
// Purpose: Support cross-border commerce for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/exchange, @services/shipping

const logger = require('@utils/logger');
const db = require('@services/db');
const exchange = require('@services/exchange');
const shipping = require('@services/shipping');

const CrossBorderCommerce = {
  async convertCurrency(userId, amount, fromCurrency, toCurrency) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[CrossBorderCommerce] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const convertedAmount = await exchange.convert(amount, fromCurrency, toCurrency);
      logger.info(`[CrossBorderCommerce] Converted ${amount} ${fromCurrency} to ${convertedAmount} ${toCurrency} for userId: ${userId}`);
      return { convertedAmount, fromCurrency, toCurrency };
    } catch (err) {
      logger.error(`[CrossBorderCommerce] Failed to convert currency for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async estimateShipping(userId, vehicleId, destinationCountry) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[CrossBorderCommerce] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const vehicle = await db.getVehicle(vehicleId);
      if (!vehicle) {
        logger.error(`[CrossBorderCommerce] Vehicle not found for vehicleId: ${vehicleId}`);
        throw new Error('Vehicle not found');
      }

      const shippingEstimate = await shipping.estimateCost(vehicle, destinationCountry);
      const taxEstimate = await shipping.estimateTax(vehicle, destinationCountry);
      logger.info(`[CrossBorderCommerce] Estimated shipping for userId: ${userId}, vehicleId: ${vehicleId}, destination: ${destinationCountry}`);
      return { shippingCost: shippingEstimate.cost, taxEstimate, currency: shippingEstimate.currency };
    } catch (err) {
      logger.error(`[CrossBorderCommerce] Failed to estimate shipping for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = CrossBorderCommerce;