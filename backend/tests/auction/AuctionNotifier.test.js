// File: AuctionNotifier.test.js
// Path: C:\CFH\backend\tests\auction\AuctionNotifier.test.js
// Purpose: Unit tests for AuctionNotifier service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const AuctionNotifier = require('@services/auction/AuctionNotifier');
const db = require('@services/db');
const notifications = require('@services/notifications');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/notifications');
jest.mock('@utils/logger');

describe('AuctionNotifier', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notifyBidPlaced', () => {
    it('notifies seller of new bid successfully', async () => {
      db.getAuction.mockResolvedValueOnce({ sellerId: '456', title: 'Test Auction' });
      notifications.sendNotification.mockResolvedValueOnce({});
      const result = await AuctionNotifier.notifyBidPlaced('789', '123', 10000);
      expect(result.status).toBe('notified');
      expect(notifications.sendNotification).toHaveBeenCalledWith('456', expect.stringContaining('New bid of $10000'), 'Bid');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Notified seller'));
    });

    it('throws error when auction is not found', async () => {
      db.getAuction.mockResolvedValueOnce(null);
      await expect(AuctionNotifier.notifyBidPlaced('789', '123', 10000)).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('logs error on notification failure', async () => {
      db.getAuction.mockResolvedValueOnce({ sellerId: '456', title: 'Test Auction' });
      notifications.sendNotification.mockRejectedValueOnce(new Error('Notification error'));
      await expect(AuctionNotifier.notifyBidPlaced('789', '123', 10000)).rejects.toThrow('Notification error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to notify bid placed'));
    });
  });

  describe('notifyAuctionEnded', () => {
    it('notifies seller of auction end successfully', async () => {
      db.getAuction.mockResolvedValueOnce({ sellerId: '456', title: 'Test Auction' });
      notifications.sendNotification.mockResolvedValueOnce({});
      const result = await AuctionNotifier.notifyAuctionEnded('789', 'sold', 15000);
      expect(result.status).toBe('notified');
      expect(notifications.sendNotification).toHaveBeenCalledWith('456', expect.stringContaining('Your auction Test Auction has ended: sold'), 'Auction');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Notified seller'));
    });

    it('throws error when auction is not found', async () => {
      db.getAuction.mockResolvedValueOnce(null);
      await expect(AuctionNotifier.notifyAuctionEnded('789', 'sold', 15000)).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('logs error on notification failure', async () => {
      db.getAuction.mockResolvedValueOnce({ sellerId: '456', title: 'Test Auction' });
      notifications.sendNotification.mockRejectedValueOnce(new Error('Notification error'));
      await expect(AuctionNotifier.notifyAuctionEnded('789', 'sold', 15000)).rejects.toThrow('Notification error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to notify auction ended'));
    });
  });
});

