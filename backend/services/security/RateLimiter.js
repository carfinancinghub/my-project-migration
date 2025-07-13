// File: RateLimiter.js
// Path: C:\CFH\backend\services\security\RateLimiter.js
// Purpose: Implement rate limiting to prevent abuse
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/cache

const logger = require('@utils/logger');
const cache = require('@services/cache');

const RateLimiter = {
  async checkRateLimit(userId, action, limit, windowSeconds) {
    try {
      const key = `ratelimit:${userId}:${action}`;
      const currentCount = await cache.get(key) || 0;

      if (currentCount >= limit) {
        logger.warn(`[RateLimiter] Rate limit exceeded for userId: ${userId}, action: ${action}`);
        return { allowed: false, remaining: 0 };
      }

      await cache.increment(key);
      await cache.expire(key, windowSeconds); // Reset after window
      logger.info(`[RateLimiter] Rate limit check passed for userId: ${userId}, action: ${action}`);
      return { allowed: true, remaining: limit - (currentCount + 1) };
    } catch (err) {
      logger.error(`[RateLimiter] Failed to check rate limit for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async resetRateLimit(userId, action) {
    try {
      const key = `ratelimit:${userId}:${action}`;
      await cache.delete(key);
      logger.info(`[RateLimiter] Reset rate limit for userId: ${userId}, action: ${action}`);
      return { status: 'reset' };
    } catch (err) {
      logger.error(`[RateLimiter] Failed to reset rate limit for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = RateLimiter;