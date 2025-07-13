// File: RealTimePredictor.test.js
// Path: C:\CFH\backend\tests\premium\RealTimePredictor.test.js
// Purpose: Unit tests for RealTimePredictor service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const RealTimePredictor = require('@services/premium/RealTimePredictor');
const db = require('@services/db');
const ai = require('@services/ai');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/ai');
jest.mock('@utils/logger');

describe('RealTimePredictor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('predictNextBid', () => {
    it('predicts next bid successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = {
        bids: [{ amount: 10000, timestamp: '2025-05-24T12:00:00Z' }],
        timeRemaining: 3600
      };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      ai.predictNextBid.mockResolvedValueOnce({ amount: 11000, confidence: 0.85 });

      const result = await RealTimePredictor.predictNextBid('789', '123');
      expect(result).toEqual({ predictedBid: 11000, confidence: 0.85 });
      expect(ai.predictNextBid).toHaveBeenCalledWith(
        [{ amount: 10000, timestamp: '2025-05-24T12:00:00Z' }],
        3600
      );
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Predicted next bid'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(RealTimePredictor.predictNextBid('789', '123')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(RealTimePredictor.predictNextBid('789', '123')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('getBiddingSuggestions', () => {
    it('generates bidding suggestions with high confidence', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = {
        bids: [{ amount: 10000, timestamp: '2025-05-24T12:00:00Z' }],
        timeRemaining: 3600
      };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      ai.predictNextBid.mockResolvedValueOnce({ amount: 11000, confidence: 0.85 });

      const result = await RealTimePredictor.getBiddingSuggestions('789', '123');
      expect(result.suggestions).toContain('Consider bidding $11100 to stay competitive.');
      expect(result.prediction).toEqual({ amount: 11000, confidence: 0.85 });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated bidding suggestions'));
    });

    it('generates cautious suggestion with low confidence', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = {
        bids: [{ amount: 10000, timestamp: '2025-05-24T12:00:00Z' }],
        timeRemaining: 3600
      };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      ai.predictNextBid.mockResolvedValueOnce({ amount: 11000, confidence: 0.6 });

      const result = await RealTimePredictor.getBiddingSuggestions('789', '123');
      expect(result.suggestions).toContain('Bidding competition is unpredictable. Bid cautiously.');
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(RealTimePredictor.getBiddingSuggestions('789', '123')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });
  });
});

