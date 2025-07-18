/**
 * © 2025 CFH, All Rights Reserved
 * File: AuctionMetrics.test.ts
 * Path: C:\CFH\backend\tests\auction\AuctionMetrics.test.ts
 * Purpose: Unit tests for AuctionMetrics service
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [0803]
 * Version: 1.0.1
 * Version ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 * Save Location: C:\CFH\backend\tests\auction\AuctionMetrics.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - TypeScript with strong type annotations for mocks & auction objects.
 * - Suggest: Move mock data/types to a separate test utils file.
 * - Suggest: Add edge case tests (invalid auction ID, corrupted data).
 * - Suggest: Use @validation/auction.validation for input schema in services.
 * - Suggest: Add negative path tests for error handling.
 */

import AuctionMetrics from '@services/auction/AuctionMetrics';
import * as db from '@services/db';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('AuctionMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateMetrics', () => {
    it('calculates metrics successfully', async () => {
      const mockAuction = {
        bids: [{ amount: 10000 }, { amount: 12000 }],
        reservePrice: 11000,
        startTime: '2025-05-24T12:00:00Z',
        endTime: '2025-05-24T14:00:00Z',
      };
      (db.getAuction as jest.Mock).mockResolvedValueOnce(mockAuction);

      const result = await AuctionMetrics.calculateMetrics('789');
      expect(result.totalBids).toBe(2);
      expect(result.highestBid).toBe(12000);
      expect(result.averageBid).toBe(11000);
      expect(result.bidIncrement).toBe(2000);
      expect(result.reserveMet).toBe(true);
      expect(result.durationHours).toBe(2);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Calculated metrics'));
    });

    it('handles auction with no bids', async () => {
      const mockAuction = {
        bids: [],
        reservePrice: 11000,
        startTime: '2025-05-24T12:00:00Z',
        endTime: '2025-05-24T14:00:00Z',
      };
      (db.getAuction as jest.Mock).mockResolvedValueOnce(mockAuction);

      const result = await AuctionMetrics.calculateMetrics('789');
      expect(result.totalBids).toBe(0);
      expect(result.highestBid).toBe(0);
      expect(result.averageBid).toBe(0);
      expect(result.bidIncrement).toBe(0);
      expect(result.reserveMet).toBe(false);
    });

    it('throws error when auction is not found', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
      await expect(AuctionMetrics.calculateMetrics('789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('aggregateMetrics', () => {
    it('aggregates metrics successfully', async () => {
      const mockAuctions = [
        { status: 'sold', finalBid: 15000, bids: [{ amount: 10000 }, { amount: 15000 }] },
        { status: 'active', bids: [{ amount: 8000 }] },
      ];
      (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce(mockAuctions);

      const result = await AuctionMetrics.aggregateMetrics('456');
      expect(result.totalAuctions).toBe(2);
      expect(result.activeAuctions).toBe(1);
      expect(result.totalRevenue).toBe(15000);
      expect(result.avgBid).toBeGreaterThan(0);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Aggregated metrics'));
    });

    it('throws error when no auctions are found', async () => {
      (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce([]);
      await expect(AuctionMetrics.aggregateMetrics('456')).rejects.toThrow('No auctions found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No auctions found'));
    });

    it('handles auctions with no bids', async () => {
      const mockAuctions = [
        { status: 'sold', finalBid: 15000, bids: [] },
        { status: 'active', bids: [] },
      ];
      (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce(mockAuctions);

      const result = await AuctionMetrics.aggregateMetrics('456');
      expect(result.avgBid).toBe(0);
    });
  });
});
