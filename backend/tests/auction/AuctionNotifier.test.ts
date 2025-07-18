/**
 * © 2025 CFH, All Rights Reserved
 * File: AuctionNotifier.test.ts
 * Path: C:\CFH\backend\tests\auction\AuctionNotifier.test.ts
 * Purpose: Unit tests for AuctionNotifier service
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [0803]
 * Version: 1.0.1
 * Version ID: g7h8i9j0-k1l2-3456-7890-123456789012
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: g7h8i9j0-k1l2-3456-7890-123456789012
 * Save Location: C:\CFH\backend\tests\auction\AuctionNotifier.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with jest.Mock typing
 * - Added more notification failure scenarios and timeout tests
 * - Suggest extracting mock data to test utils
 * - Suggest using @validation/notification.validation for inputs
 * - Improved: Added test for notification timeout
 */

import AuctionNotifier from '@services/auction/AuctionNotifier';
import * as db from '@services/db';
import * as notifications from '@services/notifications';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@services/notifications');
jest.mock('@utils/logger');

describe('AuctionNotifier', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notifyBidPlaced', () => {
    it('notifies seller of new bid successfully', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce({ sellerId: '456', title: 'Test Auction' });
      (notifications.sendNotification as jest.Mock).mockResolvedValueOnce({});
      const result = await AuctionNotifier.notifyBidPlaced('789', '123', 10000);
      expect(result.status).toBe('notified');
      expect(notifications.sendNotification).toHaveBeenCalledWith('456', expect.stringContaining('New bid of $10000'), 'Bid');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Notified seller'));
    });

    it('throws error when auction is not found', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
      await expect(AuctionNotifier.notifyBidPlaced('789', '123', 10000)).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('logs error on notification failure', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce({ sellerId: '456', title: 'Test Auction' });
      (notifications.sendNotification as jest.Mock).mockRejectedValueOnce(new Error('Notification error'));
      await expect(AuctionNotifier.notifyBidPlaced('789', '123', 10000)).rejects.toThrow('Notification error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to notify bid placed'));
    });

    // Added: Notification timeout scenario
    it('handles notification timeout', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce({ sellerId: '456', title: 'Test Auction' });
      (notifications.sendNotification as jest.Mock).mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      );
      await expect(AuctionNotifier.notifyBidPlaced('789', '123', 10000)).rejects.toThrow('Timeout');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to notify bid placed'));
    });
  });

  describe('notifyAuctionEnded', () => {
    it('notifies seller of auction end successfully', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce({ sellerId: '456', title: 'Test Auction' });
      (notifications.sendNotification as jest.Mock).mockResolvedValueOnce({});
      const result = await AuctionNotifier.notifyAuctionEnded('789', 'sold', 15000);
      expect(result.status).toBe('notified');
      expect(notifications.sendNotification).toHaveBeenCalledWith('456', expect.stringContaining('Your auction Test Auction has ended: sold'), 'Auction');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Notified seller'));
    });

    it('throws error when auction is not found', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
      await expect(AuctionNotifier.notifyAuctionEnded('789', 'sold', 15000)).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('logs error on notification failure', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce({ sellerId: '456', title: 'Test Auction' });
      (notifications.sendNotification as jest.Mock).mockRejectedValueOnce(new Error('Notification error'));
      await expect(AuctionNotifier.notifyAuctionEnded('789', 'sold', 15000)).rejects.toThrow('Notification error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to notify auction ended'));
    });
  });
});
