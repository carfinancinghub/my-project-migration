// File: SecurityAudit.js
// Path: C:\CFH\backend\services\final\SecurityAudit.js
// Purpose: Perform a final security audit before launch
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/security

const logger = require('@utils/logger');
const db = require('@services/db');
const security = require('@services/security');

const SecurityAudit = {
  async auditRateLimits() {
    try {
      const rateLimitLogs = await db.getRateLimitLogs('2025-05-24', '2025-05-25');
      const audit = {
        totalViolations: rateLimitLogs.length,
        uniqueIPs: new Set(rateLimitLogs.map(log => log.ipAddress)).size,
        blockedIPs: await security.getBlockedIPsCount(),
        status: rateLimitLogs.length < 100 // Arbitrary threshold for demo
      };

      logger.info(`[SecurityAudit] Audited rate limits: ${audit.status ? 'Passed' : 'Failed'}`);
      return audit;
    } catch (err) {
      logger.error(`[SecurityAudit] Failed to audit rate limits: ${err.message}`, err);
      throw err;
    }
  },

  async auditSecurityLogs(startDate, endDate) {
    try {
      const securityLogs = await db.getSecurityLogs(startDate, endDate);
      if (!securityLogs || securityLogs.length === 0) {
        logger.error(`[SecurityAudit] No security logs found for date range ${startDate} to ${endDate}`);
        throw new Error('No security logs found');
      }

      const audit = {
        totalEvents: securityLogs.length,
        eventsByType: securityLogs.reduce((acc, log) => {
          acc[log.eventType] = (acc[log.eventType] || 0) + 1;
          return acc;
        }, {}),
        criticalEvents: securityLogs.filter(log => log.eventType.includes('failed')).length,
        status: securityLogs.filter(log => log.eventType.includes('failed')).length < 50 // Arbitrary threshold
      };

      logger.info(`[SecurityAudit] Audited security logs: ${audit.status ? 'Passed' : 'Failed'}`);
      return audit;
    } catch (err) {
      logger.error(`[SecurityAudit] Failed to audit security logs: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = SecurityAudit;