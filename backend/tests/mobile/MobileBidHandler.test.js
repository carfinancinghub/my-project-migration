// File: MobileBidHandler.test.js
// Path: C:\CFH\backend\tests\mobile\MobileBidHandler.test.js
// Purpose: Unit tests for MobileBidHandler service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const MobileBidHandler = require('@services/mobile/MobileBidHandler');
const db = require('@services/db');
const AuctionManager = require('@services/auction/AuctionManager');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/auction/AuctionManager');
jest.mock('@utils/logger');

describe('MobileBidHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('placeBid', () => {
    it('places mobile bid successfully', async () => {
      const mockUser = { id: '123' };
      const mockBidResult = { status: 'bid placed', bid: { amount: 10000, timestamp: '2025-05-24T12:00:00Z' } };
      db.getUser.mockResolvedValueOnce(mockUser);
      AuctionManager.placeBid.mockResolvedValueOnce(mockBidResult);
      db.logMobileAction.mockResolvedValueOnce({});

      const result = await MobileBidHandler.placeBid('123', '789', 10000, { device: 'iPhone', os: 'iOS 16' });
      expect(result).toEqual({ status: 'bid placed', bid: { amount: 10000, timestamp: '2025-05-24T12:00:00Z' } });
      expect(AuctionManager.placeBid).toHaveBeenCalledWith('789', '123', 10000);
      expect(db.logMobileAction).toHaveBeenCalledWith('123', 'place_bid', { auctionId: '789', amount: 10000, deviceInfo: { device: 'iPhone', os: 'iOS 16' } });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Mobile bid placed'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(MobileBidHandler.placeBid('123', '789', 10000, { device: 'iPhone', os: 'iOS 16' })).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error on bid placement failure', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      AuctionManager.placeBid.mockRejectedValueOnce(new Error('Auction error'));
      await expect(MobileBidHandler.placeBid('123', '789', 10000, { device: 'iPhone', os: 'iOS 16' })).rejects.toThrow('Auction error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to place mobile bid'));
    });
  });

  describe('getBidHistory', () => {
    it('retrieves bid history successfully', async () => {
      const mockUser = { id: '123' };
      const mockAuction = {
        id: '789',
        bids: [
          { bidderId: '123', amount: 10000, timestamp: '2025-05-24T12:00:00Z' },
          { bidderId: '456', amount: 12000, timestamp: '2025-05-24T12:01:00Z' }
        ]
      };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);

      const result = await MobileBidHandler.getBidHistory('123', '789');
      expect(result).toEqual([{ amount: 10000, timestamp: '2025-05-24T12:00:00Z' }]);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved bid history'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(MobileBidHandler.getBidHistory('123', '789')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(MobileBidHandler.getBidHistory('123', '789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });
});

