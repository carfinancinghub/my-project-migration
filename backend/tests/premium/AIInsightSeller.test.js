// File: AIInsightSeller.test.js
// Path: C:\CFH\backend\tests\premium\AIInsightSeller.test.js
// Purpose: Unit tests for AIInsightSeller service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const AIInsightSeller = require('@services/premium/AIInsightSeller');
const db = require('@services/db');
const ai = require('@services/ai');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/ai');
jest.mock('@utils/logger');

describe('AIInsightSeller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('optimizeReservePrice', () => {
    it('optimizes reserve price successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = {
        id: '789',
        vehicleDetails: { type: 'sedan' },
        reservePrice: 10000,
        bids: [{ amount: 9000 }, { amount: 11000 }]
      };
      const mockMarketPrices = [9500, 10500];
      const mockOptimization = { value: 10200, confidence: 0.9 };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      db.getRecentAuctionPrices.mockResolvedValueOnce(mockMarketPrices);
      ai.optimizeReservePrice.mockResolvedValueOnce(mockOptimization);

      const result = await AIInsightSeller.optimizeReservePrice('123', '789');
      expect(result).toEqual({ suggestedReserve: 10200, confidence: 0.9 });
      expect(db.getRecentAuctionPrices).toHaveBeenCalledWith('sedan', 10);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated reserve price optimization'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(AIInsightSeller.optimizeReservePrice('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(AIInsightSeller.optimizeReservePrice('123', '789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('getSellerPerformance', () => {
    it('gets seller performance successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuctions = [
        { finalBid: 12000, reservePrice: 10000 },
        { finalBid: 8000, reservePrice: 9000 }
      ];
      const mockInsights = { recommendations: ['Increase reserve price for better margins'] };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getSellerAuctions.mockResolvedValueOnce(mockAuctions);
      ai.analyzeSellerPerformance.mockResolvedValueOnce(mockInsights);

      const result = await AIInsightSeller.getSellerPerformance('123');
      expect(result).toEqual({
        performance: { totalAuctions: 2, successfulAuctions: 1, averageFinalBid: 10000 },
        recommendations: ['Increase reserve price for better margins']
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated seller performance insights'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(AIInsightSeller.getSellerPerformance('123')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when no auctions are found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getSellerAuctions.mockResolvedValueOnce([]);
      await expect(AIInsightSeller.getSellerPerformance('123')).rejects.toThrow('No auctions found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No auctions found'));
    });
  });
});

