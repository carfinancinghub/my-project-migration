// File: PremiumSupportChat.js
// Path: C:\CFH\backend\services\premium\PremiumSupportChat.js
// Purpose: Provide real-time support chat for premium users (Updated for WebSocket)
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/websocket

const logger = require('@utils/logger');
const db = require('@services/db');
const websocket = require('@services/websocket');

const PremiumSupportChat = {
  async startChatSession(userId, officerId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[PremiumSupportChat] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[PremiumSupportChat] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const session = await websocket.startStream(`chat:${userId}:${officerId}`);
      logger.info(`[PremiumSupportChat] Started chat session for userId: ${userId}, officerId: ${officerId}`);
      return { sessionId: session.id, status: 'started' };
    } catch (err) {
      logger.error(`[PremiumSupportChat] Failed to start chat session for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async sendMessage(userId, sessionId, message) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[PremiumSupportChat] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      await websocket.sendMessage(sessionId, userId, message);
      await db.logChatMessage(sessionId, userId, message);
      logger.info(`[PremiumSupportChat] Sent message in session ${sessionId} for userId: ${userId}`);
      return { status: 'message_sent' };
    } catch (err) {
      logger.error(`[PremiumSupportChat] Failed to send message for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = PremiumSupportChat;