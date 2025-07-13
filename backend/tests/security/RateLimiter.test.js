// File: RateLimiter.test.js
// Path: C:\CFH\backend\tests\security\RateLimiter.test.js
// Purpose: Unit tests for RateLimiter service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const RateLimiter = require('@services/security/RateLimiter');
const cache = require('@services/cache');
const logger = require('@utils/logger');

jest.mock('@services/cache');
jest.mock('@utils/logger');

describe('RateLimiter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkRateLimit', () => {
    it('allows action within rate limit', async () => {
      cache.get.mockResolvedValueOnce(2);
      cache.increment.mockResolvedValueOnce(3);
      cache.expire.mockResolvedValueOnce({});

      const result = await RateLimiter.checkRateLimit('123', 'place_bid', 5, 60);
      expect(result).toEqual({ allowed: true, remaining: 2 });
      expect(cache.increment).toHaveBeenCalledWith('ratelimit:123:place_bid');
      expect(cache.expire).toHaveBeenCalledWith('ratelimit:123:place_bid', 60);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Rate limit check passed'));
    });

    it('blocks action when rate limit exceeded', async () => {
      cache.get.mockResolvedValueOnce(5);

      const result = await RateLimiter.checkRateLimit('123', 'place_bid', 5, 60);
      expect(result).toEqual({ allowed: false, remaining: 0 });
      expect(cache.increment).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Rate limit exceeded'));
    });

    it('throws error on cache failure', async () => {
      cache.get.mockRejectedValueOnce(new Error('Cache error'));
      await expect(RateLimiter.checkRateLimit('123', 'place_bid', 5, 60)).rejects.toThrow('Cache error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to check rate limit'));
    });
  });

  describe('resetRateLimit', () => {
    it('resets rate limit successfully', async () => {
      cache.delete.mockResolvedValueOnce({});

      const result = await RateLimiter.resetRateLimit('123', 'place_bid');
      expect(result).toEqual({ status: 'reset' });
      expect(cache.delete).toHaveBeenCalledWith('ratelimit:123:place_bid');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Reset rate limit'));
    });

    it('throws error on cache failure', async () => {
      cache.delete.mockRejectedValueOnce(new Error('Cache error'));
      await expect(RateLimiter.resetRateLimit('123', 'place_bid')).rejects.toThrow('Cache error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to reset rate limit'));
    });
  });
});

