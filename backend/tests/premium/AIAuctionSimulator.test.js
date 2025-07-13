// File: AIAuctionSimulator.test.js
// Path: C:\CFH\backend\tests\premium\AIAuctionSimulator.test.js
// Purpose: Unit tests for AIAuctionSimulator service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const AIAuctionSimulator = require('@services/premium/AIAuctionSimulator');
const db = require('@services/db');
const ai = require('@services/ai');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/ai');
jest.mock('@utils/logger');

describe('AIAuctionSimulator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('simulateAuction', () => {
    it('simulates auction successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = {
        id: '789',
        currentBid: 10000,
        bids: [{ bidderId: '123', amount: 9000, timestamp: '2025-05-24T12:00:00Z' }],
        timeRemaining: 3600
      };
      const mockSimulation = { outcome: 'win', winProbability: 0.75, suggestedBid: 11000 };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      ai.simulateAuction.mockResolvedValueOnce(mockSimulation);

      const result = await AIAuctionSimulator.simulateAuction('123', '789', 'aggressive');
      expect(result).toEqual({ predictedOutcome: 'win', winProbability: 0.75, suggestedBid: 11000 });
      expect(ai.simulateAuction).toHaveBeenCalledWith(expect.objectContaining({ userBidStrategy: 'aggressive' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Simulated auction'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(AIAuctionSimulator.simulateAuction('123', '789', 'aggressive')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(AIAuctionSimulator.simulateAuction('123', '789', 'aggressive')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('simulateMarketImpact', () => {
    it('simulates market impact successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuctions = [
        { bids: [{ amount: 9000 }], finalBid: 9500 },
        { bids: [{ amount: 10000 }], finalBid: 10500 }
      ];
      const mockImpact = { demand: 'high', priceImpact: 0.1, recommendation: 'Increase reserve slightly' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getRecentAuctionsByType.mockResolvedValueOnce(mockAuctions);
      ai.simulateMarketImpact.mockResolvedValueOnce(mockImpact);

      const result = await AIAuctionSimulator.simulateMarketImpact('123', 'sedan', 10000);
      expect(result).toEqual({ expectedDemand: 'high', priceImpact: 0.1, recommendation: 'Increase reserve slightly' });
      expect(db.getRecentAuctionsByType).toHaveBeenCalledWith('sedan', 20);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Simulated market impact'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(AIAuctionSimulator.simulateMarketImpact('123', 'sedan', 10000)).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });
  });
});

