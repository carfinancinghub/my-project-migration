```
// 👑 Crown Certified Service — EscrowAuditService.js
// Path: backend/services/escrow/EscrowAuditService.js
// Purpose: Enhanced audit trail processing for escrow transactions, aggregating database and blockchain logs.
// Author: Rivers Auction Team — May 16, 2025

const Escrow = require('@models/Escrow');
const BlockchainAdapter = require('@services/blockchain/BlockchainAdapter');
const logger = require('@utils/logger');

/**
 * Aggregates audit logs from database and blockchain for a transaction
 * @param {string} transactionId
 * @param {boolean} isPremium - Required for blockchain logs
 * @returns {Object} - { data: combined audit logs }
 */
async function getCombinedAuditLogs(transactionId, isPremium) {
  try {
    if (!transactionId) {
      throw new Error('Transaction ID required');
    }

    const dbLogs = await Escrow.findOne({ transactionId }).select('auditLogs');
    if (!dbLogs) {
      throw new Error('Escrow record not found');
    }

    const auditLogs = dbLogs.auditLogs || [];

    let blockchainLogs = [];
    if (isPremium) {
      blockchainLogs = await BlockchainAdapter.getTransactionHistory(transactionId);
      if (!blockchainLogs || blockchainLogs.length === 0) {
        logger.warn(`No blockchain audit trail for ${transactionId}`);
      }
    } else {
      logger.info(`Blockchain audit skipped for ${transactionId}: non-premium`);
    }

    const combinedLogs = [
      ...auditLogs.map(log => ({ source: 'database', ...log })),
      ...blockchainLogs.map(log => ({ source: 'blockchain', ...log })),
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    logger.info(`Combined audit logs retrieved for ${transactionId}`);
    return { data: combinedLogs };
  } catch (err) {
    logger.error(`Failed to fetch combined audit logs for ${transactionId}`, err);
    throw new Error('Audit log retrieval failed');
  }
}

/**
 * Logs an audit event to the database
 * @param {string} transactionId
 * @param {Object} event - { eventType, userId, details }
 * @returns {Object} - { data: updated audit log }
 */
async function logAuditEvent(transactionId, event) {
  try {
    const { eventType, userId, details } = event;
    if (!transactionId || !eventType || !userId) {
      throw new Error('Missing required fields');
    }

    const escrow = await Escrow.findOneAndUpdate(
      { transactionId },
      {
        $push: {
          auditLogs: {
            eventType,
            userId,
            details,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!escrow) {
      throw new Error('Escrow record not found');
    }

    logger.info(`Audit event logged for ${transactionId}: ${eventType}`);
    return { data: escrow.auditLogs[escrow.auditLogs.length - 1] };
  } catch (err) {
    logger.error(`Failed to log audit event for ${transactionId}`, err);
    throw new Error('Audit event logging failed');
  }
}

module.exports = {
  getCombinedAuditLogs,
  logAuditEvent,
};

/*
Functions Summary:
- getCombinedAuditLogs
  - Purpose: Aggregate audit logs from database and blockchain (premium)
  - Input: transactionId (string), isPremium (boolean)
  - Output: { data: combined audit logs }
- logAuditEvent
  - Purpose: Log an audit event to the database
  - Input: transactionId (string), event { eventType, userId, details }
  - Output: { data: updated audit log }
- Dependencies: @models/Escrow, @services/blockchain/BlockchainAdapter, @utils/logger
*/
```