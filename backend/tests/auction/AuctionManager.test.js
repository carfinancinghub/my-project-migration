// File: AuctionManager.test.js
// Path: C:\CFH\backend\tests\auction\AuctionManager.test.js
// Purpose: Unit tests for AuctionManager service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const AuctionManager = require('@services/auction/AuctionManager');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('AuctionManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startAuction', () => {
    it('starts auction successfully', async () => {
      db.getAuction.mockResolvedValueOnce({ status: 'pending' });
      db.updateAuction.mockResolvedValueOnce({});
      const result = await AuctionManager.startAuction('789');
      expect(result.status).toBe('started');
      expect(db.updateAuction).toHaveBeenCalledWith('789', expect.objectContaining({ status: 'active' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Started auction'));
    });

    it('returns already active status for active auction', async () => {
      db.getAuction.mockResolvedValueOnce({ status: 'active' });
      const result = await AuctionManager.startAuction('789');
      expect(result.status).toBe('already active');
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Auction already active'));
    });

    it('throws error when auction is not found', async () => {
      db.getAuction.mockResolvedValueOnce(null);
      await expect(AuctionManager.startAuction('789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('endAuction', () => {
    it('ends auction successfully as sold', async () => {
      db.getAuction.mockResolvedValueOnce({
        status: 'active',
        bids: [{ amount: 15000 }],
        reservePrice: 10000
      });
      db.updateAuction.mockResolvedValueOnce({});
      const result = await AuctionManager.endAuction('789');
      expect(result.status).toBe('sold');
      expect(result.finalBid).toBe(15000);
      expect(db.updateAuction).toHaveBeenCalledWith('789', expect.objectContaining({ status: 'sold', finalBid: 15000 }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Ended auction'));
    });

    it('ends auction as unsold when bid is below reserve', async () => {
      db.getAuction.mockResolvedValueOnce({
        status: 'active',
        bids: [{ amount: 5000 }],
        reservePrice: 10000
      });
      db.updateAuction.mockResolvedValueOnce({});
      const result = await AuctionManager.endAuction('789');
      expect(result.status).toBe('unsold');
      expect(result.finalBid).toBe(5000);
    });

    it('returns not active status for non-active auction', async () => {
      db.getAuction.mockResolvedValueOnce({ status: 'unsold' });
      const result = await AuctionManager.endAuction('789');
      expect(result.status).toBe('not active');
    });

    it('throws error when auction is not found', async () => {
      db.getAuction.mockResolvedValueOnce(null);
      await expect(AuctionManager.endAuction('789')).rejects.toThrow('Auction not found');
    });
  });

  describe('placeBid', () => {
    it('places bid successfully', async () => {
      db.getAuction.mockResolvedValueOnce({ status: 'active', bids: [] });
      db.addBid.mockResolvedValueOnce({});
      const result = await AuctionManager.placeBid('789', '123', 10000);
      expect(result.status).toBe('bid placed');
      expect(db.addBid).toHaveBeenCalledWith('789', expect.objectContaining({ bidderId: '123', amount: 10000 }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Bid placed'));
    });

    it('throws error when auction is not active', async () => {
      db.getAuction.mockResolvedValueOnce({ status: 'unsold' });
      await expect(AuctionManager.placeBid('789', '123', 10000)).rejects.toThrow('Auction not active');
    });

    it('throws error when auction is not found', async () => {
      db.getAuction.mockResolvedValueOnce(null);
      await expect(AuctionManager.placeBid('789', '123', 10000)).rejects.toThrow('Auction not found');
    });
  });
});

