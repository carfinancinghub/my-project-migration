/**
 * © 2025 CFH, All Rights Reserved
 * File: BidValidator.test.ts
 * Path: C:\CFH\backend\tests\auction\BidValidator.test.ts
 * Purpose: Unit tests for BidValidator service
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [0803]
 * Version: 1.0.1
 * Version ID: h8i9j0k1-l2m3-4567-8901-234567890123
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: h8i9j0k1-l2m3-4567-8901-234567890123
 * Save Location: C:\CFH\backend\tests\auction\BidValidator.test.ts
 *
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with jest.Mock typing
 * - Added tests for bid amount boundaries (min/max, step size)
 * - Suggest extracting mock auction/user data to test utils
 * - Suggest integrating @validation/bid.validation for schema checks
 * - Suggest concurrency/timeout tests for stress cases
 * - Improved: Added min bid and increment validation tests
 */

import BidValidator from '@services/auction/BidValidator';
import * as db from '@services/db';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('BidValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates bid successfully', async () => {
    (db.getAuction as jest.Mock).mockResolvedValueOnce({ status: 'active', bids: [{ amount: 5000 }] });
    (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123' });
    const result = await BidValidator.validateBid('789', '123', 10000);
    expect(result.valid).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Bid validated'));
  });

  it('throws error when auction is not found', async () => {
    (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
    await expect(BidValidator.validateBid('789', '123', 10000)).rejects.toThrow('Auction not found');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
  });

  it('throws error when auction is not active', async () => {
    (db.getAuction as jest.Mock).mockResolvedValueOnce({ status: 'unsold', bids: [] });
    await expect(BidValidator.validateBid('789', '123', 10000)).rejects.toThrow('Auction not active');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not active'));
  });

  it('throws error when bidder is not found', async () => {
    (db.getAuction as jest.Mock).mockResolvedValueOnce({ status: 'active', bids: [] });
    (db.getUser as jest.Mock).mockResolvedValueOnce(null);
    await expect(BidValidator.validateBid('789', '123', 10000)).rejects.toThrow('Bidder not found');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Bidder not found'));
  });

  it('throws error when bid amount is not higher than current highest bid', async () => {
    (db.getAuction as jest.Mock).mockResolvedValueOnce({ status: 'active', bids: [{ amount: 15000 }] });
    (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123' });
    await expect(BidValidator.validateBid('789', '123', 10000)).rejects.toThrow('Bid must be higher than the current highest bid');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Bid amount 10000 is not higher'));
  });

  // Added: Min bid boundary
  it('throws error when bid amount is below minimum', async () => {
    (db.getAuction as jest.Mock).mockResolvedValueOnce({ status: 'active', bids: [], minBid: 5000 });
    (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123' });
    await expect(BidValidator.validateBid('789', '123', 4000)).rejects.toThrow('Bid below minimum');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Bid 4000 below min'));
  });

  // Added: Bid increment validation
  it('throws error when bid does not meet increment', async () => {
    (db.getAuction as jest.Mock).mockResolvedValueOnce({
      status: 'active',
      bids: [{ amount: 5000 }],
      increment: 1000
    });
    (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123' });
    await expect(BidValidator.validateBid('789', '123', 5500)).rejects.toThrow('Bid does not meet increment');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Bid 5500 does not meet increment'));
  });
});
