// 👑 Crown Certified Module — InsightsService.js
// Path: backend/services/ai/InsightsService.js
// Purpose: Backend service to provide platform metrics, predictive insights, and AI recommendations.
// Author: Rivers Auction Team — May 16, 2025

const Auction = require('@models/Auction');
const Bid = require('@models/Bid');
const PredictionEngine = require('@services/ai/PredictionEngine');
const logger = require('@utils/logger');

/**
 * Fetch core platform metrics accessible to all users.
 * @returns {Object} - Platform stats: activeAuctions, totalBids, uniqueUsers
 */
async function getPlatformMetrics() {
  try {
    const activeAuctions = await Auction.countDocuments({ status: 'open' });
    const totalBids = await Bid.countDocuments();
    const uniqueUsers = await Bid.distinct('userId');

    return {
      activeAuctions,
      totalBids,
      uniqueUsers: uniqueUsers.length,
    };
  } catch (err) {
    logger.error('InsightsService.getPlatformMetrics failed', err);
    throw new Error('Unable to load platform metrics');
  }
}

/**
 * Generate predictive metrics for premium users.
 * @returns {Object} - Forecast data (e.g., bid volume, success trends)
 */
async function getPredictiveInsights() {
  try {
    const bidVolumeForecast = await PredictionEngine.forecastBidVolume();
    const auctionSuccessRate = await PredictionEngine.forecastSuccessRate();
    return { bidVolumeForecast, auctionSuccessRate };
  } catch (err) {
    logger.error('InsightsService.getPredictiveInsights failed', err);
    return {};
  }
}

/**
 * Provide personalized suggestions for bidding, alerts, or market trends.
 * @param {string} userId - Optional: Target user ID
 * @returns {Array<string>} - Text-based AI recommendations
 */
async function getRecommendations(userId = null) {
  try {
    return await PredictionEngine.generateRecommendations(userId);
  } catch (err) {
    logger.error('InsightsService.getRecommendations failed', err);
    return [];
  }
}

/**
 * Main service dispatcher for /api/insights
 * @param {boolean} isPremium - Whether user has premium access
 * @param {string|null} userId - User ID for personalized recs
 * @returns {Object} - Aggregated insights
 */
async function getInsights({ isPremium = false, userId = null }) {
  try {
    const metrics = await getPlatformMetrics();
    let predictions = {};
    let recommendations = [];

    if (isPremium) {
      predictions = await getPredictiveInsights();
      recommendations = await getRecommendations(userId);
    }

    return { metrics, predictions, recommendations };
  } catch (err) {
    logger.error('InsightsService.getInsights failed', err);
    throw new Error('Insights service unavailable');
  }
}

module.exports = {
  getInsights,
  getPlatformMetrics,
  getPredictiveInsights,
  getRecommendations,
};
