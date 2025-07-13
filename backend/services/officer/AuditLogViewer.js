// File: AuditLogViewer.js
// Path: C:\CFH\backend\services\officer\AuditLogViewer.js
// Purpose: View audit logs for officer compliance monitoring
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const AuditLogViewer = {
  async getAuditLogs(officerId, startDate, endDate, userId) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[AuditLogViewer] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const logs = await db.getAuditLogs(startDate, endDate, userId);
      if (!logs || logs.length === 0) {
        logger.error(`[AuditLogViewer] No audit logs found for officerId: ${officerId}`);
        throw new Error('No audit logs found');
      }

      const formattedLogs = logs.map(log => ({
        userId: log.userId,
        action: log.action,
        details: log.details,
        timestamp: log.timestamp
      }));

      logger.info(`[AuditLogViewer] Retrieved audit logs for officerId: ${officerId}`);
      return formattedLogs;
    } catch (err) {
      logger.error(`[AuditLogViewer] Failed to retrieve audit logs for officerId ${officerId}: ${err.message}`, err);
      throw err;
    }
  },

  async getFlaggedUsers(officerId) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[AuditLogViewer] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const flaggedUsers = await db.getFlaggedUsers();
      if (!flaggedUsers || flaggedUsers.length === 0) {
        logger.error(`[AuditLogViewer] No flagged users found for officerId: ${officerId}`);
        throw new Error('No flagged users found');
      }

      logger.info(`[AuditLogViewer] Retrieved flagged users for officerId: ${officerId}`);
      return flaggedUsers.map(user => ({
        userId: user.id,
        flaggedBy: user.flaggedBy,
        reason: user.reason,
        flaggedAt: user.flaggedAt
      }));
    } catch (err) {
      logger.error(`[AuditLogViewer] Failed to retrieve flagged users for officerId ${officerId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = AuditLogViewer;