// File: AuctionHistory.test.js
// Path: C:\CFH\backend\tests\auction\AuctionHistory.test.js
// Purpose: Unit tests for AuctionHistory service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const AuctionHistory = require('@services/auction/AuctionHistory');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('AuctionHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSellerHistory', () => {
    it('retrieves seller history successfully', async () => {
      const mockAuctions = [
        { id: '789', title: 'Test Auction 1', status: 'sold', finalBid: 15000, endTime: '2025-05-24T12:00:00Z' },
        { id: '790', title: 'Test Auction 2', status: 'unsold', finalBid: 0, endTime: '2025-05-24T14:00:00Z' }
      ];
      db.getSellerAuctions.mockResolvedValueOnce(mockAuctions);

      const result = await AuctionHistory.getSellerHistory('456');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: '789',
        title: 'Test Auction 1',
        status: 'sold',
        finalBid: 15000,
        endTime: '2025-05-24T12:00:00Z'
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved seller history'));
    });

    it('throws error when no history is found', async () => {
      db.getSellerAuctions.mockResolvedValueOnce(null);
      await expect(AuctionHistory.getSellerHistory('456')).rejects.toThrow('No auction history found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No auction history found'));
    });

    it('handles empty history gracefully', async () => {
      db.getSellerAuctions.mockResolvedValueOnce([]);
      await expect(AuctionHistory.getSellerHistory('456')).rejects.toThrow('No auction history found');
    });
  });

  describe('getBidderHistory', () => {
    it('retrieves bidder history successfully', async () => {
      const mockBids = [
        { auctionId: '789', amount: 10000, timestamp: '2025-05-24T12:00:00Z' },
        { auctionId: '790', amount: 8000, timestamp: '2025-05-24T12:01:00Z' }
      ];
      db.getBidsByUser.mockResolvedValueOnce(mockBids);
      db.getAuction.mockResolvedValueOnce({ title: 'Test Auction 1', status: 'sold' });
      db.getAuction.mockResolvedValueOnce({ title: 'Test Auction 2', status: 'unsold' });

      const result = await AuctionHistory.getBidderHistory('123');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        auctionId: '789',
        title: 'Test Auction 1',
        bidAmount: 10000,
        timestamp: '2025-05-24T12:00:00Z',
        status: 'sold'
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved bidder history'));
    });

    it('throws error when no history is found', async () => {
      db.getBidsByUser.mockResolvedValueOnce(null);
      await expect(AuctionHistory.getBidderHistory('123')).rejects.toThrow('No bid history found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No bid history found'));
    });

    it('handles missing auctions gracefully', async () => {
      const mockBids = [{ auctionId: '789', amount: 10000, timestamp: '2025-05-24T12:00:00Z' }];
      db.getBidsByUser.mockResolvedValueOnce(mockBids);
      db.getAuction.mockResolvedValueOnce(null);

      const result = await AuctionHistory.getBidderHistory('123');
      expect(result[0].title).toBe('Unknown Auction');
      expect(result[0].status).toBe('Unknown');
    });
  });
});

