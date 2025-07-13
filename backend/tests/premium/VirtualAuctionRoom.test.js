// File: VirtualAuctionRoom.test.js
// Path: C:\CFH\backend\tests\premium\VirtualAuctionRoom.test.js
// Purpose: Unit tests for VirtualAuctionRoom service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const VirtualAuctionRoom = require('@services/premium/VirtualAuctionRoom');
const db = require('@services/db');
const vr = require('@services/vr');
const AuctionManager = require('@services/auction/AuctionManager');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/vr');
jest.mock('@services/auction/AuctionManager');
jest.mock('@utils/logger');

describe('VirtualAuctionRoom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    it('creates VR room successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = { id: '789', status: 'active' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      vr.createRoom.mockResolvedValueOnce({ id: 'vr-room-123', url: 'vr://room-123' });

      const result = await VirtualAuctionRoom.createRoom('123', '789');
      expect(result).toEqual({ roomId: 'vr-room-123', vrUrl: 'vr://room-123' });
      expect(vr.createRoom).toHaveBeenCalledWith('123', '789');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Created VR room'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(VirtualAuctionRoom.createRoom('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not active', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce({ id: '789', status: 'unsold' });
      await expect(VirtualAuctionRoom.createRoom('123', '789')).rejects.toThrow('Active auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Active auction not found'));
    });
  });

  describe('placeBidInVR', () => {
    it('places bid in VR successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockRoom = { userId: '123', auctionId: '789' };
      db.getUser.mockResolvedValueOnce(mockUser);
      vr.getRoom.mockResolvedValueOnce(mockRoom);
      AuctionManager.placeBid.mockResolvedValueOnce({ status: 'bid placed' });
      vr.notifyRoom.mockResolvedValueOnce({});

      const result = await VirtualAuctionRoom.placeBidInVR('123', 'vr-room-123', 10000);
      expect(result).toEqual({ status: 'bid placed', amount: 10000, auctionId: '789' });
      expect(AuctionManager.placeBid).toHaveBeenCalledWith('789', '123', 10000);
      expect(vr.notifyRoom).toHaveBeenCalledWith('vr-room-123', 'User 123 placed a bid of $10000');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Placed bid in VR'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(VirtualAuctionRoom.placeBidInVR('123', 'vr-room-123', 10000)).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error for invalid room', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      vr.getRoom.mockResolvedValueOnce(null);
      await expect(VirtualAuctionRoom.placeBidInVR('123', 'vr-room-123', 10000)).rejects.toThrow('Invalid room');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid room'));
    });
  });
});

