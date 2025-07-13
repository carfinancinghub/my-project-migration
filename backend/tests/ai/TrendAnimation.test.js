// File: TrendAnimation.test.js
// Path: C:\CFH\backend\tests\ai\TrendAnimation.test.js
// Purpose: Unit tests for TrendAnimation service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const TrendAnimation = require('@services/ai/TrendAnimation');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('TrendAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates trend data successfully', async () => {
    const mockAuctionData = {
      bids: [{ amount: 12000 }, { amount: 8000 }],
      startTime: '2025-05-24T00:00:00Z'
    };
    db.getAuctionData.mockResolvedValueOnce(mockAuctionData);

    const result = await TrendAnimation.generateTrendData('789');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      date: new Date('2025-05-24T00:00:00Z').getTime(),
      count: 12000,
      style: 'gradient-red',
      hover: 'tooltip',
      animation: { type: 'fade-in', duration: '0.5s' }
    });
    expect(result[1]).toEqual({
      date: new Date('2025-05-24T00:00:00Z').getTime() + 3600 * 1000,
      count: 8000,
      style: 'gradient-blue',
      hover: 'tooltip',
      animation: { type: 'fade-in', duration: '0.5s' }
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated trend data'));
  });

  it('throws error when auction data is not found', async () => {
    db.getAuctionData.mockResolvedValueOnce(null);
    await expect(TrendAnimation.generateTrendData('789')).rejects.toThrow('Auction data not found');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction data not found'));
  });

  it('handles fetch failure gracefully', async () => {
    db.getAuctionData.mockRejectedValueOnce(new Error('DB error'));
    await expect(TrendAnimation.generateTrendData('789')).rejects.toThrow('DB error');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to generate trend data'));
  });

  it('handles empty bids gracefully', async () => {
    const mockAuctionData = { bids: [], startTime: '2025-05-24T00:00:00Z' };
    db.getAuctionData.mockResolvedValueOnce(mockAuctionData);
    const result = await TrendAnimation.generateTrendData('789');
    expect(result).toEqual([]);
  });

  it('applies correct styles based on bid amount', async () => {
    const mockAuctionData = { bids: [{ amount: 5000 }], startTime: '2025-05-24T00:00:00Z' };
    db.getAuctionData.mockResolvedValueOnce(mockAuctionData);
    const result = await TrendAnimation.generateTrendData('789');
    expect(result[0].style).toBe('gradient-blue');
  });
});

