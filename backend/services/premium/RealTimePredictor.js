// File: RealTimePredictor.js
// Path: C:\CFH\backend\services\premium\RealTimePredictor.js
// Purpose: Provide real-time AI bidding predictions for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/ai

const logger = require('@utils/logger');
const db = require('@services/db');
const ai = require('@services/ai');

const RealTimePredictor = {
  async predictNextBid(auctionId, userId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[RealTimePredictor] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[RealTimePredictor] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const { bids, timeRemaining } = auction;
      const bidData = bids.map(bid => ({ amount: bid.amount, timestamp: bid.timestamp }));
      const prediction = await ai.predictNextBid(bidData, timeRemaining);

      logger.info(`[RealTimePredictor] Predicted next bid for auctionId: ${auctionId}, userId: ${userId}`);
      return { predictedBid: prediction.amount, confidence: prediction.confidence };
    } catch (err) {
      logger.error(`[RealTimePredictor] Failed to predict next bid for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getBiddingSuggestions(auctionId, userId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[RealTimePredictor] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const prediction = await this.predictNextBid(auctionId, userId);
      const suggestions = [];
      if (prediction.confidence > 0.7) {
        suggestions.push(`Consider bidding $${prediction.predictedBid + 100} to stay competitive.`);
      } else {
        suggestions.push('Bidding competition is unpredictable. Bid cautiously.');
      }

      logger.info(`[RealTimePredictor] Generated bidding suggestions for auctionId: ${auctionId}, userId: ${userId}`);
      return { suggestions, prediction };
    } catch (err) {
      logger.error(`[RealTimePredictor] Failed to generate bidding suggestions for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = RealTimePredictor;