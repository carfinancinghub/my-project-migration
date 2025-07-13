// File: PostAuctionInsights.test.js
// Path: C:\CFH\backend\tests\premium\PostAuctionInsights.test.js
// Purpose: Unit tests for PostAuctionInsights service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const PostAuctionInsights = require('@services/premium/PostAuctionInsights');
const db = require('@services/db');
const ai = require('@services/ai');
const logger = require('@utils/logger');

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
        endTime: '2025-05-24T14:00:00Z'
      };
      const mockInsights = {
        trends: 'Increasing bids over time',
        score: 0.9,
        recommendations: ['Increase reserve price for future auctions.']
      };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      ai.analyzeAuction.mockResolvedValueOnce(mockInsights);

      const result = await PostAuctionInsights.analyzeAuction('123', '789');
      expect(result).toEqual({
        biddingTrends: 'Increasing bids over time',
        performanceScore: 0.9,
        recommendations: ['Increase reserve price for future auctions.']
      });
      expect(ai.analyzeAuction).toHaveBeenCalledWith(expect.objectContaining({ finalBid: 12000, duration: 2 }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated insights'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(PostAuctionInsights.analyzeAuction('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(PostAuctionInsights.analyzeAuction('123', '789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('getComparativeAnalysis', () => {
    it('generates comparative analysis successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuctions = [
        { id: '789', bids: [{ amount: 10000 }], finalBid: 10000, reservePrice: 9000 },
        { id: '790', bids: [{ amount: 8000 }], finalBid: 8000, reservePrice: 10000 }
      ];
      const mockAnalysis = { successRate: 0.5, avgBidderCount: 1 };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuctions[0]).mockResolvedValueOnce(mockAuctions[1]);
      ai.compareAuctions.mockResolvedValueOnce(mockAnalysis);

      const result = await PostAuctionInsights.getComparativeAnalysis('123', ['789', '790']);
      expect(result).toEqual({ comparativeAnalysis: { successRate: 0.5, avgBidderCount: 1 } });
      expect(ai.compareAuctions).toHaveBeenCalledWith([
        { auctionId: '789', finalBid: 10000, bidderCount: 1, success: true },
        { auctionId: '790', finalBid: 8000, bidderCount: 1, success: false }
      ]);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated comparative analysis'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(PostAuctionInsights.getComparativeAnalysis('123', ['789', '790'])).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when an auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(PostAuctionInsights.getComparativeAnalysis('123', ['789'])).rejects.toThrow('Auction not found: 789');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to generate comparative analysis'));
    });
  });
});

