// File: SecurityLogger.js
// Path: C:\CFH\backend\services\security\SecurityLogger.js
// Purpose: Log security events for monitoring
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const SecurityLogger = {
  async logSecurityEvent(eventType, details) {
    try {
      const event = {
        eventType,
        details,
        timestamp: new Date().toISOString()
      };
      await db.logSecurityEvent(event);
      logger.info(`[SecurityLogger] Logged security event: ${eventType}`);
      return { status: 'logged', eventType };
    } catch (err) {
      logger.error(`[SecurityLogger] Failed to log security event ${eventType}: ${err.message}`, err);
      throw err;
    }
  },

  async getSecurityLogs(startDate, endDate) {
    try {
      const logs = await db.getSecurityLogs(startDate, endDate);
      if (!logs || logs.length === 0) {
        logger.error(`[SecurityLogger] No security logs found for date range ${startDate} to ${endDate}`);
        throw new Error('No security logs found');
      }

      logger.info(`[SecurityLogger] Retrieved security logs for date range ${startDate} to ${endDate}`);
      return logs.map(log => ({
        eventType: log.eventType,
        details: log.details,
        timestamp: log.timestamp
      }));
    } catch (err) {
      logger.error(`[SecurityLogger] Failed to retrieve security logs: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = SecurityLogger;