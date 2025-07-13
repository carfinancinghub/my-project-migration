// File: PredictionEngine.test.js
// Path: C:\CFH\backend\tests\ai\PredictionEngine.test.js
// Purpose: Unit tests for PredictionEngine service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const PredictionEngine = require('@services/ai/PredictionEngine');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('PredictionEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('predicts auction outcome successfully', async () => {
    const mockAuctionData = {
      bids: [{ amount: 15000 }, { amount: 16000 }],
      reservePrice: 10000,
      timeRemaining: 24 * 60 * 60 // 1 day in seconds
    };
    db.getAuctionData.mockResolvedValueOnce(mockAuctionData);

    const result = await PredictionEngine.predictAuctionOutcome('789');
    expect(result.outcome).toBe('Likely to Sell');
    expect(result.predictionScore).toBeGreaterThan(0.8);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Predicted outcome'));
  });

  it('throws error when auction data is not found', async () => {
    db.getAuctionData.mockResolvedValueOnce(null);
    await expect(PredictionEngine.predictAuctionOutcome('789')).rejects.toThrow('Auction data not found');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction data not found'));
  });

  it('handles fetch failure gracefully', async () => {
    db.getAuctionData.mockRejectedValueOnce(new Error('DB error'));
    await expect(PredictionEngine.predictAuctionOutcome('789')).rejects.toThrow('DB error');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to predict outcome'));
  });

  it('trains model successfully', async () => {
    db.getHistoricalAuctionData.mockResolvedValueOnce([{ id: '1' }, { id: '2' }]);
    const result = await PredictionEngine.trainModel();
    expect(result.status).toBe('Model trained successfully');
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Training model'));
  });

  it('logs error on training failure', async () => {
    db.getHistoricalAuctionData.mockRejectedValueOnce(new Error('DB error'));
    await expect(PredictionEngine.trainModel()).rejects.toThrow('DB error');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to train model'));
  });
});

