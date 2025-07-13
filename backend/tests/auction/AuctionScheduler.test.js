// File: AuctionScheduler.test.js
// Path: C:\CFH\backend\tests\auction\AuctionScheduler.test.js
// Purpose: Unit tests for AuctionScheduler service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const AuctionScheduler = require('@services/auction/AuctionScheduler');
const AuctionManager = require('@services/auction/AuctionManager');
const db = require('@services/db');
const logger = require('@utils/logger');
const cron = require('node-cron');

jest.mock('@services/db');
jest.mock('@utils/logger');
jest.mock('node-cron');
jest.mock('@services/auction/AuctionManager');

describe('AuctionScheduler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scheduleAuctions', () => {
    it('schedules auctions and triggers cron job', () => {
      const mockSchedule = jest.fn();
      cron.schedule.mockImplementation(mockSchedule);
      AuctionScheduler.scheduleAuctions();
      expect(mockSchedule).toHaveBeenCalledWith('* * * * *', expect.any(Function));
      expect(logger.info).toHaveBeenCalledWith('[AuctionScheduler] Auction scheduling started');
    });

    it('starts pending auctions', async () => {
      const now = new Date('2025-05-24T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => now);
      db.getPendingAuctions.mockResolvedValueOnce([{ id: '789', startTime: '2025-05-24T11:00:00Z' }]);
      db.getActiveAuctions.mockResolvedValueOnce([]);
      AuctionManager.startAuction.mockResolvedValueOnce({ status: 'started' });

      const mockSchedule = jest.fn((_, fn) => fn());
      cron.schedule.mockImplementation(mockSchedule);
      AuctionScheduler.scheduleAuctions();

      await new Promise(resolve => setImmediate(resolve));
      expect(AuctionManager.startAuction).toHaveBeenCalledWith('789');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Scheduled start for auctionId: 789'));
    });

    it('ends active auctions', async () => {
      const now = new Date('2025-05-24T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => now);
      db.getPendingAuctions.mockResolvedValueOnce([]);
      db.getActiveAuctions.mockResolvedValueOnce([{ id: '789', endTime: '2025-05-24T11:00:00Z' }]);
      AuctionManager.endAuction.mockResolvedValueOnce({ status: 'sold', finalBid: 15000 });

      const mockSchedule = jest.fn((_, fn) => fn());
      cron.schedule.mockImplementation(mockSchedule);
      AuctionScheduler.scheduleAuctions();

      await new Promise(resolve => setImmediate(resolve));
      expect(AuctionManager.endAuction).toHaveBeenCalledWith('789');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Scheduled end for auctionId: 789'));
    });

    it('logs error on failure', async () => {
      db.getPendingAuctions.mockRejectedValueOnce(new Error('DB error'));
      const mockSchedule = jest.fn((_, fn) => fn());
      cron.schedule.mockImplementation(mockSchedule);
      AuctionScheduler.scheduleAuctions();
      await new Promise(resolve => setImmediate(resolve));
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to schedule auctions'));
    });
  });

  describe('scheduleAuction', () => {
    it('schedules auction successfully', async () => {
      db.getAuction.mockResolvedValueOnce({ id: '789' });
      db.updateAuction.mockResolvedValueOnce({});
      const result = await AuctionScheduler.scheduleAuction('789', '2025-05-25T12:00:00Z', '2025-05-26T12:00:00Z');
      expect(result.status).toBe('scheduled');
      expect(db.updateAuction).toHaveBeenCalledWith('789', {
        startTime: '2025-05-25T12:00:00Z',
        endTime: '2025-05-26T12:00:00Z'
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Scheduled auctionId: 789'));
    });

    it('throws error when auction is not found', async () => {
      db.getAuction.mockResolvedValueOnce(null);
      await expect(AuctionScheduler.scheduleAuction('789', '2025-05-25T12:00:00Z', '2025-05-26T12:00:00Z')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });
});

