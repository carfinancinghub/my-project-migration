// File: DDoSProtector.js
// Path: C:\CFH\backend\services\security\DDoSProtector.js
// Purpose: Implement DDoS protection for the platform
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/cache

const logger = require('@utils/logger');
const cache = require('@services/cache');

const DDoSProtector = {
  async checkRequestFlood(ipAddress, limit, windowSeconds) {
    try {
      const key = `ddos:${ipAddress}`;
      const requestCount = await cache.get(key) || 0;

      if (requestCount >= limit) {
        logger.warn(`[DDoSProtector] Request flood detected for IP: ${ipAddress}`);
        return { allowed: false, remaining: 0 };
      }

      await cache.increment(key);
      await cache.expire(key, windowSeconds); // Reset after window
      logger.info(`[DDoSProtector] Request allowed for IP: ${ipAddress}`);
      return { allowed: true, remaining: limit - (requestCount + 1) };
    } catch (err) {
      logger.error(`[DDoSProtector] Failed to check request flood for IP ${ipAddress}: ${err.message}`, err);
      throw err;
    }
  },

  async blockIP(ipAddress, durationSeconds) {
    try {
      const key = `blocked:${ipAddress}`;
      await cache.set(key, 'blocked', durationSeconds);
      logger.info(`[DDoSProtector] Blocked IP: ${ipAddress} for ${durationSeconds} seconds`);
      return { status: 'blocked', ipAddress };
    } catch (err) {
      logger.error(`[DDoSProtector] Failed to block IP ${ipAddress}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = DDoSProtector;