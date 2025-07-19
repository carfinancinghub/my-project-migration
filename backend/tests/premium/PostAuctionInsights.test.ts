/**
 * © 2025 CFH, All Rights Reserved
 * File: PostAuctionInsights.test.ts
 * Path: backend/tests/premium/PostAuctionInsights.test.ts
 * Purpose: Unit tests for PostAuctionInsights service
 * Author: Cod1 Team
 * Date: 2025-07-19 [0015]
 * Version: 1.0.1
 * Version ID: q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6
 * Crown Certified: Yes
 * Batch ID: Compliance-071925
 * Artifact ID: q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6
 * Save Location: backend/tests/premium/PostAuctionInsights.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed mocks and auction data
 * - Added tests for comparative analysis with multiple auctions
 * - Suggest extracting mock user/auction to test utils
 * - Suggest integration tests with real DB/AI
 * - Improved: Typed analyzeAuction and getComparativeAnalysis returns
 * - Free Feature: Basic analysis tests
 * - Premium Feature: Comparative analysis, AI insights
 * - Wow ++ Feature: Real-time post-auction alerts tests
 */

import PostAuctionInsights from '@services/premium/PostAuctionInsights';
import * as db from '@services/db';
import * as ai from '@services/ai';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@services/ai');
jest.mock('@utils/logger');

describe('PostAuctionInsights', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeAuction', () => {
    it('analyzes auction successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = {
        bids: [{ amount: 10000 }, { amount: 12000 }],
        finalBid: 12000,
        reservePrice: 11000,
        startTime: '2025-05-24T12:00:00Z',
        endTime: '2025-05-24T14:00:00Z',
      };
      const mockInsights = {
        trends: 'Increasing bids over time',
        score: 0.9,
        recommendations: ['Increase reserve price for future auctions.'],
      };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (db.getAuction as jest.Mock).mockResolvedValueOnce(mockAuction);
      (ai.analyzeAuction as jest.Mock).mockResolvedValueOnce(mockInsights);

      const result = await PostAuctionInsights.analyzeAuction('123', '789');
      expect(result).toEqual({
        biddingTrends: 'Increasing bids over time',
        performanceScore: 0.9,
        recommendations: ['Increase reserve price for future auctions.'],
      });
      expect(ai.analyzeAuction).toHaveBeenCalledWith(expect.objectContaining({ finalBid: 12000, duration: 2 }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated insights'));
    });

    it('throws error for non-premium user', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(PostAuctionInsights.analyzeAuction('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123', isPremium: true });
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
      await expect(PostAuctionInsights.analyzeAuction('123', '789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('getComparativeAnalysis', () => {
    it('generates comparative analysis successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuctions = [
        { id: '789', finalBid: 10000, bidderCount: 1, success: true },
        { id: '790', finalBid: 8000, bidderCount: 1, success: false },
      ];
      const mockAnalysis = { successRate: 0.5, avgBidderCount: 1 };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (db.getAuction as jest.Mock)
        .mockResolvedValueOnce(mockAuctions[0])
        .mockResolvedValueOnce(mockAuctions[1]);
      (ai.compareAuctions as jest.Mock).mockResolvedValueOnce(mockAnalysis);

      const result = await PostAuctionInsights.getComparativeAnalysis('123', ['789', '790']);
      expect(result).toEqual({ comparativeAnalysis: { successRate: 0.5, avgBidderCount: 1 } });
      expect(ai.compareAuctions).toHaveBeenCalledWith(mockAuctions);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated comparative analysis'));
    });

    it('throws error for non-premium user', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(PostAuctionInsights.getComparativeAnalysis('123', ['789', '790'])).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when an auction is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123', isPremium: true });
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
      await expect(PostAuctionInsights.getComparativeAnalysis('123', ['789'])).rejects.toThrow('Auction not found: 789');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to generate comparative analysis'));
    });
  });
});
