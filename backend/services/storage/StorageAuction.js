// File: StorageAuction.js
// Path: C:\CFH\backend\services\storage\StorageAuction.js
// Purpose: Allow Storage Providers to auction storage spots for vehicles
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/websocket

const logger = require('@utils/logger');
const db = require('@services/db');
const websocket = require('@services/websocket');

const StorageAuction = {
  async createStorageAuction(providerId, storageData) {
    try {
      const provider = await db.getUser(providerId);
      if (!provider || provider.role !== 'storage_provider') {
        logger.error(`[StorageAuction] Storage Provider access required for providerId: ${providerId}`);
        throw new Error('Storage Provider access required');
      }

      const storageAuction = {
        providerId,
        location: storageData.location,
        duration: storageData.duration, // e.g., "daily", "weekly", "monthly"
        pricePerDay: storageData.pricePerDay,
        availableSlots: storageData.availableSlots,
        status: 'open',
        bids: [],
        timestamp: new Date().toISOString()
      };

      const auctionId = await db.saveStorageAuction(storageAuction);
      await websocket.broadcast('storage_auctions', { type: 'new_storage_auction', auctionId });
      logger.info(`[StorageAuction] Created storage auction for providerId: ${providerId}, auctionId: ${auctionId}`);
      return { auctionId, status: 'created' };
    } catch (err) {
      logger.error(`[StorageAuction] Failed to create storage auction for providerId ${providerId}: ${err.message}`, err);
      throw err;
    }
  },

  async placeStorageBid(userId, auctionId, bidAmount) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[StorageAuction] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const storageAuction = await db.getStorageAuction(auctionId);
      if (!storageAuction || storageAuction.status !== 'open') {
        logger.error(`[StorageAuction] Storage auction not found or closed for auctionId: ${auctionId}`);
        throw new Error('Storage auction not found or closed');
      }

      const bid = {
        userId,
        bidAmount,
        timestamp: new Date().toISOString()
      };

      storageAuction.bids.push(bid);
      await db.updateStorageAuction(auctionId, { bids: storageAuction.bids });
      await websocket.broadcast(`storage_auction:${auctionId}`, { type: 'new_storage_bid', bid });
      logger.info(`[StorageAuction] Placed storage bid for userId: ${userId}, auctionId: ${auctionId}`);
      return { bid, status: 'placed' };
    } catch (err) {
      logger.error(`[StorageAuction] Failed to place storage bid for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async endStorageAuction(providerId, auctionId, winningBidderId) {
    try {
      const provider = await db.getUser(providerId);
      if (!provider || provider.role !== 'storage_provider') {
        logger.error(`[StorageAuction] Storage Provider access required for providerId: ${providerId}`);
        throw new Error('Storage Provider access required');
      }

      const storageAuction = await db.getStorageAuction(auctionId);
      if (!storageAuction || storageAuction.status !== 'open') {
        logger.error(`[StorageAuction] Storage auction not found or closed for auctionId: ${auctionId}`);
        throw new Error('Storage auction not found or closed');
      }

      const winningBid = storageAuction.bids.find(bid => bid.userId === winningBidderId);
      if (!winningBid) {
        logger.error(`[StorageAuction] Winning bid not found for auctionId: ${auctionId}, bidderId: ${winningBidderId}`);
        throw new Error('Winning bid not found');
      }

      await db.updateStorageAuction(auctionId, { status: 'closed', winner: winningBidderId });
      await websocket.broadcast(`storage_auction:${auctionId}`, { type: 'storage_auction_ended', winner: winningBidderId });
      logger.info(`[StorageAuction] Ended storage auction for auctionId: ${auctionId}, winner: ${winningBidderId}`);
      return { status: 'closed', winner: winningBidderId };
    } catch (err) {
      logger.error(`[StorageAuction] Failed to end storage auction for providerId ${providerId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = StorageAuction;