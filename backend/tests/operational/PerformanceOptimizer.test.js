// File: PerformanceOptimizer.test.js
// Path: C:\CFH\backend\tests\operational\PerformanceOptimizer.test.js
// Purpose: Unit tests for PerformanceOptimizer service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const PerformanceOptimizer = require('@services/operational/PerformanceOptimizer');
const db = require('@services/db');
const cache = require('@services/cache');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/cache');
jest.mock('@utils/logger');

describe('PerformanceOptimizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cacheAuctionData', () => {
    it('caches auction data successfully', async () => {
      const mockAuction = { id: '789', title: 'Test Auction' };
      db.getAuction.mockResolvedValueOnce(mockAuction);
      cache.set.mockResolvedValueOnce({});

      const result = await PerformanceOptimizer.cacheAuctionData('789');
      expect(result).toEqual({ status: 'cached', auctionId: '789' });
      expect(cache.set).toHaveBeenCalledWith('auction:789', mockAuction, 300);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Cached auction data'));
    });

    it('throws error when auction is not found', async () => {
      db.getAuction.mockResolvedValueOnce(null);
      await expect(PerformanceOptimizer.cacheAuctionData('789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('getCachedAuctionData', () => {
    it('retrieves data from cache successfully', async () => {
      const mockAuction = { id: '789', title: 'Test Auction' };
      cache.get.mockResolvedValueOnce(mockAuction);

      const result = await PerformanceOptimizer.getCachedAuctionData('789');
      expect(result).toEqual({ data: mockAuction, source: 'cache' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved cached auction data'));
    });

    it('fetches from database and caches if not in cache', async () => {
      const mockAuction = { id: '789', title: 'Test Auction' };
      cache.get.mockResolvedValueOnce(null);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      cache.set.mockResolvedValueOnce({});

      const result = await PerformanceOptimizer.getCachedAuctionData('789');
      expect(result).toEqual({ data: mockAuction, source: 'database' });
      expect(cache.set).toHaveBeenCalledWith('auction:789', mockAuction, 300);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Fetched and cached auction data'));
    });

    it('throws error when auction is not found', async () => {
      cache.get.mockResolvedValueOnce(null);
      db.getAuction.mockResolvedValueOnce(null);
      await expect(PerformanceOptimizer.getCachedAuctionData('789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });
});

