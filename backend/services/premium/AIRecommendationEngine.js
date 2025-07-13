// File: AIRecommendationEngine.js
// Path: C:\CFH\backend\services\premium\AIRecommendationEngine.js
// Purpose: Provide personalized auction recommendations for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/ai

const logger = require('@utils/logger');
const db = require('@services/db');
const ai = require('@services/ai');

const AIRecommendationEngine = {
  async getRecommendations(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[AIRecommendationEngine] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const userData = {
        preferences: user.preferences || {},
        pastBids: await db.getUserBids(userId, 10), // Last 10 bids
        pastViews: await db.getUserViews(userId, 10) // Last 10 viewed auctions
      };

      const recommendations = await ai.generateRecommendations(userData);
      const auctions = await Promise.all(
        recommendations.auctionIds.map(async auctionId => {
          const auction = await db.getAuction(auctionId);
          return auction || null;
        })
      );

      logger.info(`[AIRecommendationEngine] Generated recommendations for userId: ${userId}`);
      return auctions.filter(a => a !== null);
    } catch (err) {
      logger.error(`[AIRecommendationEngine] Failed to generate recommendations for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = AIRecommendationEngine;