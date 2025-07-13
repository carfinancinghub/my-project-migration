// File: AIInsightBuyer.test.js
// Path: C:\CFH\backend\tests\premium\AIInsightBuyer.test.js
// Purpose: Unit tests for AIInsightBuyer service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const AIInsightBuyer = require('@services/premium/AIInsightBuyer');
const db = require('@services/db');
const ai = require('@services/ai');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/ai');
jest.mock('@utils/logger');

describe('AIInsightBuyer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBiddingStrategy', () => {
    it('generates bidding strategy successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = {
        id: '789',
        bids: [
          { bidderId: '123', amount: 10000, timestamp: '2025-05-24T12:00:00Z' },
          { bidderId: '456', amount: 12000, timestamp: '2025-05-24T12:01:00Z' }
        ],
        timeRemaining: 3600,
        currentBid: 12000
      };
      const mockStrategy = { recommendation: 'Increase bid by 10%', confidence: 0.85 };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      ai.generateBiddingStrategy.mockResolvedValueOnce(mockStrategy);

      const result = await AIInsightBuyer.getBiddingStrategy('123', '789');
      expect(result).toEqual({ strategy: 'Increase bid by 10%', confidence: 0.85 });
      expect(ai.generateBiddingStrategy).toHaveBeenCalledWith(expect.objectContaining({ currentBid: 12000 }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated bidding strategy'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(AIInsightBuyer.getBiddingStrategy('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(AIInsightBuyer.getBiddingStrategy('123', '789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('getMarketTrends', () => {
    it('generates market trends successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuctions = [
        { finalBid: 10000, vehicleDetails: { type: 'sedan' }, bids: [{}], endTime: '2025-05-24T12:00:00Z' }
      ];
      const mockTrends = { insights: 'Sedans are trending', topVehicleTypes: ['sedan'] };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getRecentAuctions.mockResolvedValueOnce(mockAuctions);
      ai.analyzeMarketTrends.mockResolvedValueOnce(mockTrends);

      const result = await AIInsightBuyer.getMarketTrends('123');
      expect(result).toEqual({ trends: 'Sedans are trending', topVehicleTypes: ['sedan'] });
      expect(db.getRecentAuctions).toHaveBeenCalledWith(100);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated market trends'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(AIInsightBuyer.getMarketTrends('123')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error on trends generation failure', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getRecentAuctions.mockRejectedValueOnce(new Error('DB error'));
      await expect(AIInsightBuyer.getMarketTrends('123')).rejects.toThrow('DB error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to generate market trends'));
    });
  });
});

