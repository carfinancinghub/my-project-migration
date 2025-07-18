/**
 * © 2025 CFH, All Rights Reserved
 * File: AuctionScheduler.test.ts
 * Path: C:\CFH\backend\tests\auction\AuctionScheduler.test.ts
 * Purpose: Unit tests for AuctionScheduler service
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1348]
 * Version: 1.0.1
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: k1l2m3n4-o5p6-7890-1234-567890123456
 * Save Location: C:\CFH\backend\tests\auction\AuctionScheduler.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with jest.Mock for cron and Date
 * - Added tests for cron scheduling failures
 * - Suggest extracting date mocks to test utils
 * - Suggest using @validation/scheduler.validation for date inputs
 * - Suggest integration tests with real cron in separate suite
 * - Improved: Added failure simulation for cron schedule
 */

// (Test code from your previously posted file would go here, header only provided for brevity)


import AuctionScheduler from '@services/auction/AuctionScheduler';
import * as AuctionManager from '@services/auction/AuctionManager';
import * as db from '@services/db';
import * as logger from '@utils/logger';
import * as cron from 'node-cron';

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
      (cron.schedule as jest.Mock).mockImplementation(mockSchedule);
      AuctionScheduler.scheduleAuctions();
      expect(mockSchedule).toHaveBeenCalledWith('* * * * *', expect.any(Function));
      expect(logger.info).toHaveBeenCalledWith('[AuctionScheduler] Auction scheduling started');
    });

    it('starts pending auctions', async () => {
      const now = new Date('2025-05-24T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);
      (db.getPendingAuctions as jest.Mock).mockResolvedValueOnce([{ id: '789', startTime: '2025-05-24T11:00:00Z' }]);
      (db.getActiveAuctions as jest.Mock).mockResolvedValueOnce([]);
      (AuctionManager.startAuction as jest.Mock).mockResolvedValueOnce({ status: 'started' });

      const mockSchedule = jest.fn((_: string, fn: () => void) => fn());
      (cron.schedule as jest.Mock).mockImplementation(mockSchedule);
      AuctionScheduler.scheduleAuctions();

      await new Promise(resolve => setImmediate(resolve));
      expect(AuctionManager.startAuction).toHaveBeenCalledWith('789');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Scheduled start for auctionId: 789'));
    });

    it('ends active auctions', async () => {
      const now = new Date('2025-05-24T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);
      (db.getPendingAuctions as jest.Mock).mockResolvedValueOnce([]);
      (db.getActiveAuctions as jest.Mock).mockResolvedValueOnce([{ id: '789', endTime: '2025-05-24T11:00:00Z' }]);
      (AuctionManager.endAuction as jest.Mock).mockResolvedValueOnce({ status: 'sold', finalBid: 15000 });

      const mockSchedule = jest.fn((_: string, fn: () => void) => fn());
      (cron.schedule as jest.Mock).mockImplementation(mockSchedule);
      AuctionScheduler.scheduleAuctions();

      await new Promise(resolve => setImmediate(resolve));
      expect(AuctionManager.endAuction).toHaveBeenCalledWith('789');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Scheduled end for auctionId: 789'));
    });

    it('logs error on failure', async () => {
      (db.getPendingAuctions as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
      const mockSchedule = jest.fn((_: string, fn: () => void) => fn());
      (cron.schedule as jest.Mock).mockImplementation(mockSchedule);
      AuctionScheduler.scheduleAuctions();
      await new Promise(resolve => setImmediate(resolve));
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to schedule auctions'));
    });

    // Added: Cron scheduling failure
    it('handles cron scheduling error', () => {
      (cron.schedule as jest.Mock).mockImplementation(() => {
        throw new Error('Cron error');
      });
      expect(() => AuctionScheduler.scheduleAuctions()).toThrow('Cron error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to start scheduler'));
    });
  });

  describe('scheduleAuction', () => {
    it('schedules auction successfully', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce({ id: '789' });
      (db.updateAuction as jest.Mock).mockResolvedValueOnce({});
      const result = await AuctionScheduler.scheduleAuction('789', '2025-05-25T12:00:00Z', '2025-05-26T12:00:00Z');
      expect(result.status).toBe('scheduled');
      expect(db.updateAuction).toHaveBeenCalledWith('789', {
        startTime: '2025-05-25T12:00:00Z',
        endTime: '2025-05-26T12:00:00Z',
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Scheduled auctionId: 789'));
    });

    it('throws error when auction is not found', async () => {
      (db.getAuction as jest.Mock).mockResolvedValueOnce(null);
      await expect(
        AuctionScheduler.scheduleAuction('789', '2025-05-25T12:00:00Z', '2025-05-26T12:00:00Z')
      ).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });
});
