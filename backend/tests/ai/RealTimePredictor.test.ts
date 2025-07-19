/**
 * © 2025 CFH, All Rights Reserved
 * File: RealTimePredictor.test.ts
 * Path: backend/tests/ai/RealTimePredictor.test.ts
 * Purpose: Jest tests for RealTimePredictor service (real-time auction value prediction)
 * Author: Cod1 Team
 * Date: 2025-07-19 [0022]
 * Version: 1.0.0
 * Version ID: x1y2z3a4b5c6d7e8f9g0
 * Crown Certified: Yes
 * Batch ID: Compliance-071925
 * Artifact ID: x1y2z3a4b5c6d7e8f9g0
 * Save Location: backend/tests/ai/RealTimePredictor.test.ts
 */
/**
 * Side Note: Cod1+ Suggestions
 * - Move mock auction/user data to test utils for DRY.
 * - Add integration/E2E test with real AI model when available.
 * - Add latency and performance assertions for Wow++.
 * - Free: Core success/fail prediction, error handling.
 * - Premium: Predict confidence & explanation coverage.
 * - Wow++: Live streaming and latency alerts.
 */

import RealTimePredictor from '@services/ai/RealTimePredictor';
import * as ai from '@services/ai';
import * as db from '@services/db';
import * as logger from '@utils/logger';

jest.mock('@services/ai');
jest.mock('@services/db');
jest.mock('@utils/logger');

describe('RealTimePredictor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('predictAuctionValue', () => {
    it('predicts value successfully for a live auction', async () => {
      const mockAuction = { id: 'live123', currentBid: 10000, status: 'live' };
      const mockPrediction = { value: 11500, confidence: 0.92, explanation: 'High bid activity.' };
      (db.getAuction as jest.Mock).mockResolvedValueOnce(mockAuction);
      (ai.runPredictionModel as jest.Mock).mockResolvedValueOnce(mockPrediction);

      const result = await RealTimePredictor.predictAuctionValue('live123');
      expect(result).toEqual(mockPrediction);
      expect(ai.runPredictionModel).toHaveBeenCalledWith(mockAuction);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Prediction completed'));
    });

    it('returns error if auction is not found', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
      await expect(RealTimePredictor.predictAuctionValue('badid')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('handles AI model errors gracefully', async () => {
      const mockAuction = { id: 'live123', currentBid: 9000, status: 'live' };
      (db.getAuction as jest.Mock).mockResolvedValueOnce(mockAuction);
      (ai.runPredictionModel as jest.Mock).mockRejectedValueOnce(new Error('Model failure'));

      await expect(RealTimePredictor.predictAuctionValue('live123')).rejects.toThrow('Model failure');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Model failure'));
    });
  });
});
