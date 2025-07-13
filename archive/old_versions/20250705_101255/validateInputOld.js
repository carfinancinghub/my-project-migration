// 👑 Crown Certified Utility — validateInput.js
// Path: backend/utils/validateInput.js
// Purpose: Validate input payloads for escrow operations and prediction engines
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

const logger = require('@utils/logger');

/**
 * Validate transactionId format and presence
 * @param {string} transactionId
 * @returns {boolean}
 */
function isValidTransactionId(transactionId) {
  if (typeof transactionId !== 'string' || transactionId.trim() === '') {
    logger.error('Invalid transactionId format');
    return false;
  }
  const pattern = /^tx_[a-zA-Z0-9]{10,}$/;
  return pattern.test(transactionId);
}

/**
 * Validate actionType against known actions
 * @param {string} actionType
 * @returns {boolean}
 */
function isValidActionType(actionType) {
  const allowed = ['deposit', 'release', 'refund', 'dispute'];
  const valid = allowed.includes(actionType);
  if (!valid) {
    logger.error('Invalid actionType provided:', actionType);
  }
  return valid;
}

/**
 * Validate amount
 * @param {number} amount
 * @returns {boolean}
 */
function isValidAmount(amount) {
  if (typeof amount !== 'number' || amount <= 0) {
    logger.error('Invalid amount value');
    return false;
  }
  return true;
}

/**
 * Master validation utility
 * @param {object} payload
 * @returns {{ success: boolean, errors: string[] }}
 */
function validateEscrowPayload(payload) {
  const errors = [];

  if (!isValidTransactionId(payload.transactionId)) {
    errors.push('Invalid or missing transactionId');
  }

  if (!isValidActionType(payload.actionType)) {
    errors.push('Invalid or unsupported actionType');
  }

  if (payload.amount !== undefined && !isValidAmount(payload.amount)) {
    errors.push('Invalid amount value');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

module.exports = {
  isValidTransactionId,
  isValidActionType,
  isValidAmount,
  validateEscrowPayload,
};