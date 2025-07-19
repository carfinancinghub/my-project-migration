/**
 * © 2025 CFH, All Rights Reserved
 * File: AIInsightBuyer.test.ts
 * Path: backend/tests/premium/AIInsightBuyer.test.ts
 * Purpose: Unit tests for AIInsightBuyer service (bid suggestions, preference learning, buyer insights)
 * Author: Cod1 Team
 * Date: 2025-07-19 [0022]
 * Version: 1.1.0
 * Version ID: b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7
 * Crown Certified: Yes
 * Batch ID: Compliance-071925
 * Artifact ID: b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7
 * Save Location: backend/tests/premium/AIInsightBuyer.test.ts
 */
/**
 * Side Note: Cod1+ Merge
 * - Combined getBidSuggestions, learnBuyerPreferences, and insights tests.
 * - Added explicit Wow++ test placeholder for real-time, cross-auction learning.
 * - Suggest moving repeated mocks to test utils for DRY.
 * - Free: Basic AI recommendation test.
 * - Premium: Learning from user history, multiple auction types.
 * - Wow++: Real-time AI training, cross-auction, predictive coaching.
 */

import AIInsightBuyer from '@services/premium/AIInsightBuyer';
import * as db from '@services/db';
import * as ai from '@services/ai';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@services/ai');
jest.mock('@utils/logger');

describe('AIInsightBuyer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // === Free: Basic insights ===
  describe('getBuyerInsights', () => {
    it('returns AI insights for premium buyer', async () => {
      const mockUser = { id: 'buyer321', isPremium: true, searchHistory: ['sedan'] };
      const mockInsights = { recommendations: ['Focus on certified vehicles.'], risk: 'Low' };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (ai.generateBuyerInsights as jest.Mock).mockResolvedValueOnce(mockInsights);

      const result = await AIInsightBuyer.getBuyerInsights('buyer321');
      expect(result).toEqual(mockInsights);
      expect(ai.generateBuyerInsights).toHaveBeenCalledWith(mockUser);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('AI buyer insights'));
    });

    it('throws error for non-premium user', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'buyer321', isPremium: false });
      await expect(AIInsightBuyer.getBuyerInsights('buyer321')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error if user not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce(null);
      await expect(AIInsightBuyer.getBuyerInsights('buyer999')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  // === Premium: Bid suggestions and AI learning ===
  describe('getBidSuggestions', () => {
    it('provides bid suggestions successfully for premium buyer', async () => {
      const mockBuyer = { id: '321', isPremium: true, biddingHistory: [] };
      const mockAuction = { id: '456', status: 'open', currentBid: 10500, vehicleType: 'SUV' };
      const mockSuggestions = { suggestedBid: 11200, confidence: 0.93, nextStep: 'Wait for last minute' };

      (db.getUser as jest.Mock).mockResolvedValueOnce(mockBuyer);
      (db.getAuction as jest.Mock).mockResolvedValueOnce(mockAuction);
      (ai.suggestBid as jest.Mock).mockResolvedValueOnce(mockSuggestions);

      const result = await AIInsightBuyer.getBidSuggestions('321', '456');
      expect(result).toEqual(mockSuggestions);
      expect(ai.suggestBid).toHaveBeenCalledWith(expect.objectContaining({
        buyerId: '321',
        auctionId: '456',
        vehicleType: 'SUV',
        biddingHistory: []
      }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated bid suggestions'));
    });

    it('throws error for non-premium user', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '321', isPremium: false });
      await expect(AIInsightBuyer.getBidSuggestions('321', '456')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '321', isPremium: true });
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
      await expect(AIInsightBuyer.getBidSuggestions('321', '456')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('learnBuyerPreferences', () => {
    it('triggers AI learning for premium buyer', async () => {
      const mockBuyer = { id: '321', isPremium: true, biddingHistory: [{ auctionId: 'a1', bid: 10000 }] };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockBuyer);
      (ai.learnPreferences as jest.Mock).mockResolvedValueOnce({ status: 'learned', accuracy: 0.91 });

      const result = await AIInsightBuyer.learnBuyerPreferences('321');
      expect(result).toEqual({ status: 'learned', accuracy: 0.91 });
      expect(ai.learnPreferences).toHaveBeenCalledWith(expect.objectContaining({
        buyerId: '321',
        biddingHistory: mockBuyer.biddingHistory
      }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Buyer preferences learned'));
    });

    it('throws error for non-premium user', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '321', isPremium: false });
      await expect(AIInsightBuyer.learnBuyerPreferences('321')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when buyer is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce(null);
      await expect(AIInsightBuyer.learnBuyerPreferences('321')).rejects.toThrow('Buyer not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Buyer not found'));
    });
  });

  // === Wow++: Real-time learning and cross-auction insights ===
  describe('Wow++ Features', () => {
    it.skip('provides real-time predictive coaching across auctions (Wow++)', async () => {
      // Placeholder for future: Simulate AI model updating in real-time as auctions progress
      // Should validate live recommendation/adaptive learning logic, alerting, etc.
      expect(true).toBe(true);
    });
  });
});
