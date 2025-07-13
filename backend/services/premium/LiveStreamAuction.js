// File: LiveStreamAuction.js
// Path: C:\CFH\backend\services\premium\LiveStreamAuction.js
// Purpose: Provide live streaming for auctions to premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/websocket

const logger = require('@utils/logger');
const db = require('@services/db');
const websocket = require('@services/websocket');

const LiveStreamAuction = {
  async startStream(auctionId) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[LiveStreamAuction] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const stream = await websocket.startStream(auctionId);
      logger.info(`[LiveStreamAuction] Started live stream for auctionId: ${auctionId}`);
      return { streamId: stream.id, status: 'started' };
    } catch (err) {
      logger.error(`[LiveStreamAuction] Failed to start live stream for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  },

  async broadcastUpdate(auctionId, update) {
    try {
      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[LiveStreamAuction] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      await websocket.broadcast(auctionId, update);
      logger.info(`[LiveStreamAuction] Broadcasted update for auctionId: ${auctionId}`);
      return { status: 'broadcasted' };
    } catch (err) {
      logger.error(`[LiveStreamAuction] Failed to broadcast update for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = LiveStreamAuction;