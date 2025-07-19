/**
 * © 2025 CFH, All Rights Reserved
 * File: RecommendationEngine.test.ts
 * Path: backend/tests/ai/RecommendationEngine.test.ts
 * Purpose: Unit tests for RecommendationEngine service
 * Author: Cod1 Team
 * Date: 2025-07-18 [0815]
 * Version: 1.0.1
 * Version ID: z0x1c2v3b4n5m6l7k8j9h0g1f2d3s4a5
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: z0x1c2v3b4n5m6l7k8j9h0g1f2d3s4a5
 * Save Location: backend/tests/ai/RecommendationEngine.test.ts
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed mocks and auctions
 * - Added more scenarios (high success, mixed cases, edge/no data cases)
 * - Extracted mock auctions to test utils for reuse and DRY code - placeholder
 * - Suggest integration tests with real DB for production parity
 * - Suggest: Add assertion for logger output in each test to confirm side effects
 * - Improved: Typed recommendStrategy return
 * - Further: Suggest mocking logger to check calls
 */

import RecommendationEngine from '@services/ai/RecommendationEngine';
import * as db from '@services/db';
import * as logger from '@utils/logger';

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
    (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce(mockAuctions);

    const result: string[] = await RecommendationEngine.recommendStrategy('123');
    expect(result).toContain('Lower reserve prices to attract more bidders.');
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated recommendations'));
  });

  it('recommends adding images when missing', async () => {
    const mockAuctions = [
      { status: 'sold', hasImages: false },
      { status: 'sold', hasImages: true }
    ];
    (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce(mockAuctions);

    const result: string[] = await RecommendationEngine.recommendStrategy('123');
    expect(result).toContain('Add high-quality images to your auction listings.');
  });

  it('recommends marketing for low bidder count', async () => {
    const mockAuctions = [
      { status: 'sold', bidderCount: 1 },
      { status: 'sold', bidderCount: 5 }
    ];
    (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce(mockAuctions);

    const result: string[] = await RecommendationEngine.recommendStrategy('123');
    expect(result).toContain('Increase marketing efforts to attract more bidders.');
  });

  it('returns default message when no recommendations apply', async () => {
    const mockAuctions = [
      { status: 'sold', hasImages: true, bidderCount: 5 },
      { status: 'sold', hasImages: true, bidderCount: 4 }
    ];
    (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce(mockAuctions);

    const result: string[] = await RecommendationEngine.recommendStrategy('123');
    expect(result).toEqual(['No specific recommendations at this time.']);
  });

  it('throws error when no auction data is found', async () => {
    (db.getSellerAuctions as jest.Mock).mockResolvedValueOnce([]);
    await expect(RecommendationEngine.recommendStrategy('123')).rejects.toThrow('No auction data found');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No auction data found'));
  });
});
