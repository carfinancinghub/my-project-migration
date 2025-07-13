// File: Heatmap.test.js
// Path: C:\CFH\backend\tests\ai\Heatmap.test.js
// Purpose: Unit tests for Heatmap service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const Heatmap = require('@services/ai/Heatmap');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('Heatmap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates heatmap data successfully', async () => {
    const mockAuctionData = {
      bids: [{ amount: 12000 }, { amount: 8000 }]
    };
    db.getAuctionData.mockResolvedValueOnce(mockAuctionData);

    const result = await Heatmap.generateHeatmapData('789');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      time: 0,
      count: 12,
      intensity: 0.8
    });
    expect(result[1]).toEqual({
      time: 24,
      count: 8,
      intensity: 0.4
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated heatmap data'));
  });

  it('throws error when auction data is not found', async () => {
    db.getAuctionData.mockResolvedValueOnce(null);
    await expect(Heatmap.generateHeatmapData('789')).rejects.toThrow('Auction data not found');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction data not found'));
  });

  it('handles fetch failure gracefully', async () => {
    db.getAuctionData.mockRejectedValueOnce(new Error('DB error'));
    await expect(Heatmap.generateHeatmapData('789')).rejects.toThrow('DB error');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to generate heatmap data'));
  });

  it('handles empty bids gracefully', async () => {
    const mockAuctionData = { bids: [] };
    db.getAuctionData.mockResolvedValueOnce(mockAuctionData);
    const result = await Heatmap.generateHeatmapData('789');
    expect(result).toEqual([]);
  });

  it('applies correct intensity based on bid amount', async () => {
    const mockAuctionData = { bids: [{ amount: 5000 }] };
    db.getAuctionData.mockResolvedValueOnce(mockAuctionData);
    const result = await Heatmap.generateHeatmapData('789');
    expect(result[0].intensity).toBe(0.4);
  });
});

