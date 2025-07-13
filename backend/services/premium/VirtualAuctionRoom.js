// File: VirtualAuctionRoom.js
// Path: C:\CFH\backend\services\premium\VirtualAuctionRoom.js
// Purpose: Provide VR auction rooms for premium users (Updated for WebSocket)
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/websocket

const logger = require('@utils/logger');
const db = require('@services/db');
const websocket = require('@services/websocket');

const VirtualAuctionRoom = {
  async joinRoom(userId, auctionId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[VirtualAuctionRoom] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[VirtualAuctionRoom] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const room = await websocket.startStream(`vr-room:${auctionId}`);
      logger.info(`[VirtualAuctionRoom] User ${userId} joined VR room for auctionId: ${auctionId}`);
      return { roomId: room.id, status: 'joined' };
    } catch (err) {
      logger.error(`[VirtualAuctionRoom] Failed to join VR room for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async broadcastRoomUpdate(auctionId, update) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[VirtualAuctionRoom] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      await websocket.broadcast(`vr-room:${auctionId}`, update);
      logger.info(`[VirtualAuctionRoom] Broadcasted update for VR room, auctionId: ${auctionId}`);
      return { status: 'broadcasted' };
    } catch (err) {
      logger.error(`[VirtualAuctionRoom] Failed to broadcast update for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = VirtualAuctionRoom;