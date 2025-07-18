/**
 * © 2025 CFH, All Rights Reserved
 * File: AuctionHistory.test.ts
 * Path: C:\CFH\backend\tests\auction\AuctionHistory.test.ts
 * Purpose: Unit tests for AuctionHistory service
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [0803]
 * Version: 1.0.1
 * Version ID: c3d4e5f6-g7h8-90ab-cdef-123456789012
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: c3d4e5f6-g7h8-90ab-cdef-123456789012
 * Save Location: C:\CFH\backend\tests\auction\AuctionHistory.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Strong typing for mock data, responses, and all async results
 * - Enhanced error handling in tests
 * - Suggest: Extract types/interfaces for Auction and Bid mocks
 * - Suggest: Add edge-case tests for null/malformed responses
 * - Suggest: Move repeated mock setup to test utils
 */

import AuctionHistory from '@services/auction/AuctionHistory';
import * as db from '@services/db';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('AuctionHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSellerHistory', () => {
    it('retrieves seller history successfully', async () => {
      const mockAuctions = [
        {
          id: '789',
          title: 'Test Auction 1',
          status: 'sold',
          finalBid: 15000,
          endTime: '2025-05-24T12:00:00Z',
        },
        {
          id: '790',
          title: 'Test Auction 2',
          status: 'unsold',
          finalBid: 0,
          endTime: '2025-05-24T14:00:00Z',
        },
      ];
      (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce(mockAuctions);

      const result = await AuctionHistory.getSellerHistory('456');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: '789',
        title: 'Test Auction 1',
        status: 'sold',
        finalBid: 15000,
        endTime: '2025-05-24T12:00:00Z',
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved seller history'));
    });

    it('throws error when no history is found', async () => {
      (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce(null);
      await expect(AuctionHistory.getSellerHistory('456')).rejects.toThrow('No auction history found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No auction history found'));
    });

    it('handles empty history gracefully', async () => {
      (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce([]);
      await expect(AuctionHistory.getSellerHistory('456')).rejects.toThrow('No auction history found');
    });
  });

  describe('getBidderHistory', () => {
    it('retrieves bidder history successfully', async () => {
      const mockBids = [
        { auctionId: '789', amount: 10000, timestamp: '2025-05-24T12:00:00Z' },
        { auctionId: '790', amount: 8000, timestamp: '2025-05-24T12:01:00Z' },
      ];
      (db.getBidsByUser as jest.Mock).mockResolvedValueOnce(mockBids);
      (db.getAuction as jest.Mock).mockResolvedValueOnce({ title: 'Test Auction 1', status: 'sold' });
      (db.getAuction as jest.Mock).mockResolvedValueOnce({ title: 'Test Auction 2', status: 'unsold' });

      const result = await AuctionHistory.getBidderHistory('123');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        auctionId: '789',
        title: 'Test Auction 1',
        bidAmount: 10000,
        timestamp: '2025-05-24T12:00:00Z',
        status: 'sold',
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved bidder history'));
    });

    it('throws error when no history is found', async () => {
      (db.getBidsByUser as jest.Mock).mockResolvedValueOnce(null);
      await expect(AuctionHistory.getBidderHistory('123')).rejects.toThrow('No bid history found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No bid history found'));
    });

    it('handles missing auctions gracefully', async () => {
      const mockBids = [{ auctionId: '789', amount: 10000, timestamp: '2025-05-24T12:00:00Z' }];
      (db.getBidsByUser as jest.Mock).mockResolvedValueOnce(mockBids);
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);

      const result = await AuctionHistory.getBidderHistory('123');
      expect(result[0].title).toBe('Unknown Auction');
      expect(result[0].status).toBe('Unknown');
    });
  });
});
