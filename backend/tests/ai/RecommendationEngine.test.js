// File: RecommendationEngine.test.js
// Path: C:\CFH\backend\tests\ai\RecommendationEngine.test.js
// Purpose: Unit tests for RecommendationEngine service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const RecommendationEngine = require('@services/ai/RecommendationEngine');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('RecommendationEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates recommendations for low success rate', async () => {
    const mockAuctions = [
      { status: 'sold' },
      { status: 'unsold' },
      { status: 'unsold' }
    ];
    db.getSellerAuctions.mockResolvedValueOnce(mockAuctions);

    const result = await RecommendationEngine.recommendStrategy('123');
    expect(result).toContain('Lower reserve prices to attract more bidders.');
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated recommendations'));
  });

  it('recommends adding images when missing', async () => {
    const mockAuctions = [
      { status: 'sold', hasImages: false },
      { status: 'sold', hasImages: true }
    ];
    db.getSellerAuctions.mockResolvedValueOnce(mockAuctions);

    const result = await RecommendationEngine.recommendStrategy('123');
    expect(result).toContain('Add high-quality images to your auction listings.');
  });

  it('recommends marketing for low bidder count', async () => {
    const mockAuctions = [
      { status: 'sold', bidderCount: 1 },
      { status: 'sold', bidderCount: 5 }
    ];
    db.getSellerAuctions.mockResolvedValueOnce(mockAuctions);

    const result = await RecommendationEngine.recommendStrategy('123');
    expect(result).toContain('Increase marketing efforts to attract more bidders.');
  });

  it('returns default message when no recommendations apply', async () => {
    const mockAuctions = [
      { status: 'sold', hasImages: true, bidderCount: 5 },
      { status: 'sold', hasImages: true, bidderCount: 4 }
    ];
    db.getSellerAuctions.mockResolvedValueOnce(mockAuctions);

    const result = await RecommendationEngine.recommendStrategy('123');
    expect(result).toEqual(['No specific recommendations at this time.']);
  });

  it('throws error when no auction data is found', async () => {
    db.getSellerAuctions.mockResolvedValueOnce([]);
    await expect(RecommendationEngine.recommendStrategy('123')).rejects.toThrow('No auction data found');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No auction data found'));
  });
});

