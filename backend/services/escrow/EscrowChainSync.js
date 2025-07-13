// 👑 Crown Certified Service — EscrowChainSync.js
// Path: backend/services/escrow/EscrowChainSync.js
// Purpose: Synchronize escrow actions with blockchain for secure, tamper-proof audit trails.
// Author: Rivers Auction Team — May 16, 2025

const Escrow = require('@models/Escrow');
const BlockchainAdapter = require('@services/blockchain/BlockchainAdapter');
const logger = require('@utils/logger');
const validateInput = require('@utils/validateInput');

/**
 * Logs escrow action to internal database.
 * @param {Object} actionData - Escrow transaction info
 * @returns {Promise<Object>} - Internal record response
 */
async function syncEscrowAction(actionData) {
  const validation = validateInput(actionData, {
    transactionId: 'string',
    actionType: 'string',
    userId: 'string',
    metadata: 'objectOptional',
  });

  if (!validation.success) {
    logger.error('EscrowChainSync.syncEscrowAction — validation failed', validation.errors);
    throw new Error('Invalid escrow action input.');
  }

  try {
    const record = await Escrow.create({
      transactionId: actionData.transactionId,
      actionType: actionData.actionType,
      userId: actionData.userId,
      metadata: actionData.metadata || {},
      syncedToBlockchain: false,
    });

    return { success: true, data: record };
  } catch (err) {
    logger.error('EscrowChainSync.syncEscrowAction — DB insert failed', err);
    throw new Error('Failed to log escrow action internally.');
  }
}

/**
 * Sync escrow action to blockchain (premium-only).
 * @param {Object} actionData - Escrow transaction info
 * @returns {Promise<Object>} - Blockchain transaction receipt
 */
async function syncToBlockchain(actionData) {
  try {
    const receipt = await BlockchainAdapter.recordEscrowAction(actionData);
    await Escrow.updateOne(
      { transactionId: actionData.transactionId },
      { syncedToBlockchain: true, blockchainHash: receipt.txHash }
    );

    return { success: true, txHash: receipt.txHash };
  } catch (err) {
    logger.error('EscrowChainSync.syncToBlockchain — blockchain sync failed', err);
    throw new Error('Blockchain sync failed for escrow action.');
  }
}

/**
 * Get current escrow status by transaction ID.
 * @param {string} transactionId
 * @returns {Promise<Object>}
 */
async function getEscrowStatus(transactionId) {
  try {
    const status = await Escrow.findOne({ transactionId });
    if (!status) throw new Error('Escrow transaction not found');
    return { success: true, data: status };
  } catch (err) {
    logger.error('EscrowChainSync.getEscrowStatus — fetch failed', err);
    throw new Error('Unable to retrieve escrow status.');
  }
}

/**
 * Get blockchain audit trail for escrow (premium-only).
 * @param {string} transactionId
 * @returns {Promise<Object>}
 */
async function getBlockchainAuditTrail(transactionId) {
  try {
    const hash = (await Escrow.findOne({ transactionId }))?.blockchainHash;
    if (!hash) throw new Error('No blockchain record found');

    const audit = await BlockchainAdapter.getTransactionDetails(hash);
    return { success: true, data: audit };
  } catch (err) {
    logger.error('EscrowChainSync.getBlockchainAuditTrail — fetch failed', err);
    throw new Error('Unable to retrieve blockchain audit trail.');
  }
}

module.exports = {
  syncEscrowAction,
  syncToBlockchain,
  getEscrowStatus,
  getBlockchainAuditTrail,
};
