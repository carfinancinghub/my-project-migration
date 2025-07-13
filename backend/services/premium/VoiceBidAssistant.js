// File: VoiceBidAssistant.js
// Path: C:\CFH\backend\services\premium\VoiceBidAssistant.js
// Purpose: Enable voice-activated bidding for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/voice

const logger = require('@utils/logger');
const db = require('@services/db');
const voice = require('@services/voice');
const AuctionManager = require('@services/auction/AuctionManager');

const VoiceBidAssistant = {
  async startVoiceSession(userId, auctionId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[VoiceBidAssistant] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction || auction.status !== 'active') {
        logger.error(`[VoiceBidAssistant] Active auction not found for auctionId: ${auctionId}`);
        throw new Error('Active auction not found');
      }

      const session = await voice.startSession(userId, auctionId);
      logger.info(`[VoiceBidAssistant] Started voice session for userId: ${userId}, auctionId: ${auctionId}`);
      return { sessionId: session.id };
    } catch (err) {
      logger.error(`[VoiceBidAssistant] Failed to start voice session for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async processVoiceBid(userId, sessionId, voiceCommand) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[VoiceBidAssistant] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const session = await voice.getSession(sessionId);
      if (!session || session.userId !== userId) {
        logger.error(`[VoiceBidAssistant] Invalid session for userId: ${userId}, sessionId: ${sessionId}`);
        throw new Error('Invalid session');
      }

      const { auctionId } = session;
      const amount = await voice.parseBidAmount(voiceCommand);
      if (!amount || amount <= 0) {
        logger.error(`[VoiceBidAssistant] Invalid bid amount from voice command for userId: ${userId}`);
        throw new Error('Invalid bid amount');
      }

      const result = await AuctionManager.placeBid(auctionId, userId, amount);
      logger.info(`[VoiceBidAssistant] Processed voice bid for userId: ${userId}, auctionId: ${auctionId}, amount: ${amount}`);
      return { status: 'bid placed', amount, auctionId };
    } catch (err) {
      logger.error(`[VoiceBidAssistant] Failed to process voice bid for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = VoiceBidAssistant;