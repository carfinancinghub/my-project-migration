// File: MessagingService.js
// Path: C:\CFH\backend\services\communication\MessagingService.js
// Purpose: Enable direct messaging between roles
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/websocket

const logger = require('@utils/logger');
const db = require('@services/db');
const websocket = require('@services/websocket');

const MessagingService = {
  async sendMessage(senderId, receiverId, messageContent, context) {
    try {
      const sender = await db.getUser(senderId);
      const receiver = await db.getUser(receiverId);
      if (!sender || !receiver) {
        logger.error(`[MessagingService] Invalid sender (${senderId}) or receiver (${receiverId})`);
        throw new Error('Invalid sender or receiver');
      }

      const message = {
        senderId,
        receiverId,
        content: messageContent,
        context, // e.g., { auctionId: "123", type: "inspection_report" }
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      const messageId = await db.saveMessage(message);
      await websocket.broadcast(`user:${receiverId}`, { type: 'new_message', messageId, message });
      logger.info(`[MessagingService] Sent message from senderId: ${senderId} to receiverId: ${receiverId}`);
      return { messageId, status: 'sent' };
    } catch (err) {
      logger.error(`[MessagingService] Failed to send message from senderId ${senderId}: ${err.message}`, err);
      throw err;
    }
  },

  async getMessages(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[MessagingService] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const messages = await db.getMessagesForUser(userId);
      logger.info(`[MessagingService] Retrieved messages for userId: ${userId}`);
      return messages;
    } catch (err) {
      logger.error(`[MessagingService] Failed to retrieve messages for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = MessagingService;