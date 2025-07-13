// File: BidValidator.test.js
// Path: C:\CFH\backend\tests\auction\BidValidator.test.js
// Purpose: Unit tests for BidValidator service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const BidValidator = require('@services/auction/BidValidator');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('BidValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates bid successfully', async () => {
    db.getAuction.mockResolvedValueOnce({ status: 'active', bids: [{ amount: 5000 }] });
    db.getUser.mockResolvedValueOnce({ id: '123' });
    const result = await BidValidator.validateBid('789', '123', 10000);
    expect(result.valid).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Bid validated'));
  });

  it('throws error when auction is not found', async () => {
    db.getAuction.mockResolvedValueOnce(null);
    await expect(BidValidator.validateBid('789', '123', 10000)).rejects.toThrow('Auction not found');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
  });

  it('throws error when auction is not active', async () => {
    db.getAuction.mockResolvedValueOnce({ status: 'unsold', bids: [] });
    await expect(BidValidator.validateBid('789', '123', 10000)).rejects.toThrow('Auction not active');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not active'));
  });

  it('throws error when bidder is not found', async () => {
    db.getAuction.mockResolvedValueOnce({ status: 'active', bids: [] });
    db.getUser.mockResolvedValueOnce(null);
    await expect(BidValidator.validateBid('789', '123', 10000)).rejects.toThrow('Bidder not found');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Bidder not found'));
  });

  it('throws error when bid amount is not higher than current highest bid', async () => {
    db.getAuction.mockResolvedValueOnce({ status: 'active', bids: [{ amount: 15000 }] });
    db.getUser.mockResolvedValueOnce({ id: '123' });
    await expect(BidValidator.validateBid('789', '123', 10000)).rejects.toThrow('Bid must be higher than the current highest bid');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Bid amount 10000 is not higher'));
  });
});

