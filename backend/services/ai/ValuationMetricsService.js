```
// 👑 Crown Certified Service — ValuationMetricsService.js
// Path: backend/services/ai/ValuationMetricsService.js
// Purpose: Provides backend valuation metrics for auctions, integrating with PredictionEngine for real-time insights.
// Author: Rivers Auction Team — May 17, 2025

const Auction = require('@models/Auction');
const Bid = require('@models/Bid');
const PredictionEngine = require('@services/ai/PredictionEngine');
const logger = require('@utils/logger');

/**
 * Calculates valuation metrics for an auction
 * @param {string} auctionId
 * @param {boolean} isPremium - Includes advanced metrics for premium users
 * @returns {Object} - { data: { estimatedValue, advancedMetrics (premium) } }
 */
async function calculateValuationMetrics(auctionId, isPremium) {
  try {
    if (!auctionId) {
      throw new Error('Auction ID required');
    }

    const auction = await Auction.findOne({ auctionId });
    if (!auction) {
      throw new Error('Auction not found');
    }

    const bids = await Bid.find({ auctionId });
    const estimatedValue = bids.length
      ? bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length
      : auction.reservePrice || 0;

    let advancedMetrics = null;
    if (isPremium) {
      const prediction = await PredictionEngine.getAdvancedPrediction({ auctionId, userId: 'aggregate' });
      advancedMetrics = {
        titleProcessingDelay: prediction.data.prediction.titleProcessingDelay,
        escrowSyncTiming: prediction.data.prediction.escrowSyncTiming,
        marketTrend: prediction.data.prediction.successProbability > 0.7 ? 'Bullish' : 'Stable',
      };
    }

    logger.info(`Valuation metrics calculated for auction ${auctionId}`);
    return { data: { estimatedValue, advancedMetrics } };
  } catch (err) {
    logger.error(`Failed to calculate valuation metrics for auction ${auctionId}`, err);
    throw new Error('Valuation metrics calculation failed');
  }
}

/**
 * Subscribes to live valuation updates via WebSocket
 * @param {string} auctionId
 * @returns {Object} - { data: { subscriptionId } }
 */
async function subscribeToLiveUpdates(auctionId) {
  try {
    if (!auctionId) {
      throw new Error('Auction ID required');
    }

    // Placeholder for WebSocket subscription (e.g., Redis pub/sub)
    const subscriptionId = `val-${auctionId}-${Date.now()}`;
    logger.info(`Subscribed to live valuation updates for auction ${auctionId}: ${subscriptionId}`);
    return { data: { subscriptionId } };
  } catch (err) {
    logger.error(`Failed to subscribe to live updates for auction ${auctionId}`, err);
    throw new Error('Live updates subscription failed');
  }
}

module.exports = {
  calculateValuationMetrics,
  subscribeToLiveUpdates,
};

/*
Functions Summary:
- calculateValuationMetrics
  - Purpose: Calculate valuation metrics for an auction
  - Input: auctionId (string), isPremium (boolean)
  - Output: { data: { estimatedValue, advancedMetrics (premium) } }
- subscribeToLiveUpdates
  - Purpose: Subscribe to live valuation updates via WebSocket
  - Input: auctionId (string)
  - Output: { data: { subscriptionId } }
- Dependencies: @models/Auction, @models/Bid, @services/ai/PredictionEngine, @utils/logger
*/
```