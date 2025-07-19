/**
 * © 2025 CFH, All Rights Reserved
 * File: PredictionEngine.test.ts
 * Path: backend/tests/services/ai/PredictionEngine.test.ts
 * Purpose: Unit tests for PredictionEngine service, covering predictions and recommendations.
 * Author: Cod1 Team
 * Date: 2025-07-18 [2314]
 * Version: 1.0.1
 * Version ID: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 * Save Location: backend/tests/services/ai/PredictionEngine.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with jest.Mock typing for models and services
 * - Added edge cases for missing parameters and model failures
 * - Suggest extracting mock data to test utils for DRY
 * - Suggest integration tests with real DB/ML
 * - Improved: Typed inputData and result expectations
 * - Suggest: Add performance tests for prediction latency
 */
/**
 * Side Note / Suggestions:
 * - Test Utility DRY: Move repeated mocks and test data to separate utils for reusability.
 * - Integration Coverage: Add E2E or integration tests with live ML model and DB.
 * - Performance Tests: Track prediction response time (latency) and log/report slow predictions.
 * - Free: Core unit test coverage, error path coverage.
 * - Premium: Advanced prediction, analytics on prediction accuracy, customizable ML model use.
 * - Wow++: Live retraining triggers if accuracy drops, in-dashboard latency stats for admins, predictive logging for big auctions.
 */


// 👑 Crown Certified Test — PredictionEngine.test.ts
// Path: backend/tests/services/ai/PredictionEngine.test.ts
// Purpose: Unit tests for PredictionEngine service, covering predictions and recommendations.

import * as PredictionEngine from '@services/ai/PredictionEngine';
import * as Auction from '@models/auction.model';
import * as Bid from '@models/bid.model';
import * as Escrow from '@models/escrow.model';
import * as MLModel from '@services/ai/MLModel';
import logger from '@utils/logger';

jest.mock('@models/auction.model');
jest.mock('@models/bid.model');
jest.mock('@models/escrow.model');
jest.mock('@services/ai/MLModel');
jest.mock('@utils/logger', () => ({ error: jest.fn(), }));

describe('PredictionEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBasicPrediction', () => {
    const inputData = { auctionId: 'a1', bidAmount: 1000 };

    it('should return basic prediction for bid success', async () => {
      (Auction.findOne as jest.Mock).mockResolvedValue({ auctionId: 'a1', status: 'active' });
      (Bid.find as jest.Mock).mockResolvedValue([{ bidAmount: 900 }, { bidAmount: 950 }]);
      (MLModel.predict as jest.Mock).mockReturnValue({ successProbability: 0.75 });

      const result = await PredictionEngine.getBasicPrediction(inputData);

      expect(result).toEqual({
        success: true,
        data: { prediction: { successProbability: 0.75 } },
        version: 'v1',
      });
      expect(Auction.findOne).toHaveBeenCalledWith({ auctionId: 'a1' });
      expect(Bid.find).toHaveBeenCalledWith({ auctionId: 'a1' });
      expect(MLModel.predict).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should throw error for missing parameters', async () => {
      await expect(PredictionEngine.getBasicPrediction({})).rejects.toThrow(/Missing required parameters/);
      expect(logger.error).toHaveBeenCalledWith('Prediction failed: Missing parameters', expect.any(Error));
    });

    it('should throw error on model failure', async () => {
      (Auction.findOne as jest.Mock).mockResolvedValue({ auctionId: 'a1' });
      (Bid.find as jest.Mock).mockResolvedValue([]);
      (MLModel.predict as jest.Mock).mockImplementation(() => { throw new Error('Model error'); });

      await expect(PredictionEngine.getBasicPrediction(inputData)).rejects.toThrow('Prediction failed');
      expect(logger.error).toHaveBeenCalledWith('Prediction failed: Model error', expect.any(Error));
    });
  });

  describe('getAdvancedPrediction', () => {
    const inputData = { auctionId: 'a1', userId: 'u1' };

    it('should return advanced prediction for premium user', async () => {
      (Auction.findOne as jest.Mock).mockResolvedValue({ auctionId: 'a1', status: 'active' });
      (Escrow.find as jest.Mock).mockResolvedValue([{ transactionId: 'tx1', status: 'pending' }]);
      (MLModel.predictAdvanced as jest.Mock).mockReturnValue({
        titleProcessingDelay: '2 days',
        escrowSyncTiming: '1 hour',
      });

      const result = await PredictionEngine.getAdvancedPrediction(inputData);

      expect(result).toEqual({
        success: true,
        data: { prediction: { titleProcessingDelay: '2 days', escrowSyncTiming: '1 hour' } },
        version: 'v1',
      });
      expect(Auction.findOne).toHaveBeenCalledWith({ auctionId: 'a1' });
      expect(Escrow.find).toHaveBeenCalledWith({ userId: 'u1' });
      expect(MLModel.predictAdvanced).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should throw error for missing parameters', async () => {
      await expect(PredictionEngine.getAdvancedPrediction({})).rejects.toThrow('Missing required parameters');
      expect(logger.error).toHaveBeenCalledWith('Advanced prediction failed: Missing parameters', expect.any(Error));
    });

    it('should throw error on model failure', async () => {
      (Auction.findOne as jest.Mock).mockResolvedValue({ auctionId: 'a1' });
      (Escrow.find as jest.Mock).mockResolvedValue([]);
      (MLModel.predictAdvanced as jest.Mock).mockImplementation(() => { throw new Error('Model error'); });

      await expect(PredictionEngine.getAdvancedPrediction(inputData)).rejects.toThrow('Advanced prediction failed');
      expect(logger.error).toHaveBeenCalledWith('Advanced prediction failed: Model error', expect.any(Error));
    });
  });

  describe('getRecommendation', () => {
    const inputData = { auctionId: 'a1', bidAmount: 1000 };

    it('should return recommendation for premium user', async () => {
      (Auction.findOne as jest.Mock).mockResolvedValue({ auctionId: 'a1', status: 'active' });
      (Bid.find as jest.Mock).mockResolvedValue([{ bidAmount: 900 }, { bidAmount: 950 }]);
      (MLModel.recommend as jest.Mock).mockReturnValue({ message: 'Increase bid by 5% to improve winning odds' });

      const result = await PredictionEngine.getRecommendation(inputData);

      expect(result).toEqual({
        success: true,
        data: { recommendation: { message: 'Increase bid by 5% to improve winning odds' } },
        version: 'v1',
      });
      expect(Auction.findOne).toHaveBeenCalledWith({ auctionId: 'a1' });
      expect(Bid.find).toHaveBeenCalledWith({ auctionId: 'a1' });
      expect(MLModel.recommend).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should throw error for missing parameters', async () => {
      await expect(PredictionEngine.getRecommendation({})).rejects.toThrow('Missing required parameters');
      expect(logger.error).toHaveBeenCalledWith('Recommendation failed: Missing parameters', expect.any(Error));
    });

    it('should throw error on model failure', async () => {
      (Auction.findOne as jest.Mock).mockResolvedValue({ auctionId: 'a1' });
      (Bid.find as jest.Mock).mockResolvedValue([]);
      (MLModel.recommend as jest.Mock).mockImplementation(() => { throw new Error('Model error'); });

      await expect(PredictionEngine.getRecommendation(inputData)).rejects.toThrow('Recommendation failed');
      expect(logger.error).toHaveBeenCalledWith('Recommendation failed: Model error', expect.any(Error));
    });
  });
});

/*
Functions Summary:
- describe('PredictionEngine')
  - Purpose: Test suite for PredictionEngine service methods
  - Tests:
    - getBasicPrediction: Bid success probability, missing parameters, model failure
    - getAdvancedPrediction: Title/escrow predictions, missing parameters, model failure
    - getRecommendation: Strategic recommendations, missing parameters, model failure
  - Dependencies: @models/Auction, @models/Bid, @models/Escrow, @services/ai/MLModel, @utils/logger
*/
