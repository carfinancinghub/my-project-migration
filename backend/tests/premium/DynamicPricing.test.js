// File: DynamicPricing.test.js
// Path: C:\CFH\backend\tests\premium\DynamicPricing.test.js
// Purpose: Unit tests for DynamicPricing service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const DynamicPricing = require('@services/premium/DynamicPricing');
const db = require('@services/db');
const ai = require('@services/ai');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/ai');
jest.mock('@utils/logger');

describe('DynamicPricing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDynamicPrice', () => {
    it('gets dynamic price successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = {
        id: '789',
        currentBid: 10000,
        bids: [{ bidderId: '123', amount: 9000, timestamp: '2025-05-24T12:00:00Z' }],
        timeRemaining: 3600,
        vehicleDetails: { type: 'sedan' }
      };
      const mockMarketPrices = [9500, 10500];
      const mockPricing = { suggestedBid: 11000, confidence: 0.85, trend: 'increasing' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      db.getRecentAuctionPrices.mockResolvedValueOnce(mockMarketPrices);
      ai.calculateDynamicPrice.mockResolvedValueOnce(mockPricing);

      const result = await DynamicPricing.getDynamicPrice('123', '789');
      expect(result).toEqual({ suggestedBid: 11000, confidence: 0.85, trend: 'increasing' });
      expect(db.getRecentAuctionPrices).toHaveBeenCalledWith('sedan', 5);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated dynamic price'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(DynamicPricing.getDynamicPrice('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(DynamicPricing.getDynamicPrice('123', '789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('updatePricingModel', () => {
    it('updates pricing model successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = { id: '789' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      ai.updatePricingModel.mockResolvedValueOnce({});

      const result = await DynamicPricing.updatePricingModel('123', '789', { feedback: 'helpful' });
      expect(result).toEqual({ status: 'model_updated' });
      expect(ai.updatePricingModel).toHaveBeenCalledWith({ auctionId: '789', userFeedback: { feedback: 'helpful' } });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Updated pricing model'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(DynamicPricing.updatePricingModel('123', '789', { feedback: 'helpful' })).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(DynamicPricing.updatePricingModel('123', '789', { feedback: 'helpful' })).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });
});

