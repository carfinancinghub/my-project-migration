// 👑 Crown Certified Route — sync.js
// Path: backend/routes/escrow/sync.js
// Purpose: API interface to sync escrow actions and retrieve status/audit trails.
// Author: Rivers Auction Team — May 16, 2025

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const EscrowChainSync = require('@services/escrow/EscrowChainSync');
const logger = require('@utils/logger');
const validateQueryParams = require('@utils/validateQueryParams');

const router = express.Router();
router.use(helmet());

// ⏱ Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: '⚠️ Too many escrow requests, try again later.',
});

// ✅ POST /api/escrow/sync
// Sync escrow action to DB (and blockchain if isPremium)
router.post('/sync', limiter, async (req, res) => {
  const { isPremium = 'false' } = req.query;
  const parsedPremium = isPremium === 'true';
  const actionData = req.body;

  const validation = validateQueryParams({ isPremium }, {
    isPremium: 'booleanOptional',
  });

  if (!validation.success) {
    logger.error('Escrow sync query param invalid', validation.errors);
    return res.status(400).json({ success: false, message: 'Invalid query parameters', errors: validation.errors });
  }

  try {
    const internalResult = await EscrowChainSync.syncEscrowAction(actionData);

    let blockchainResult = null;
    if (parsedPremium) {
      blockchainResult = await EscrowChainSync.syncToBlockchain(actionData);
    }

    return res.status(201).json({
      success: true,
      data: {
        record: internalResult.data,
        blockchain: parsedPremium ? blockchainResult : undefined,
      },
      version: 'v1',
    });
  } catch (err) {
    logger.error('POST /api/escrow/sync failed', err);
    return res.status(500).json({ success: false, message: 'Failed to sync escrow action' });
  }
});

// ✅ GET /api/escrow/status/:transactionId
// Fetch current escrow status
router.get('/status/:transactionId', limiter, async (req, res) => {
  try {
    const result = await EscrowChainSync.getEscrowStatus(req.params.transactionId);
    return res.json({ success: true, data: result.data, version: 'v1' });
  } catch (err) {
    logger.error('GET /api/escrow/status failed', err);
    return res.status(500).json({ success: false, message: 'Unable to fetch escrow status' });
  }
});

// ✅ GET /api/escrow/audit/:transactionId
// Return blockchain audit trail if isPremium
router.get('/audit/:transactionId', limiter, async (req, res) => {
  const { isPremium = 'false' } = req.query;
  const parsedPremium = isPremium === 'true';

  const validation = validateQueryParams({ isPremium }, {
    isPremium: 'booleanOptional',
  });

  if (!validation.success) {
    logger.error('Audit route query validation failed', validation.errors);
    return res.status(400).json({ success: false, message: 'Invalid query parameters' });
  }

  if (!parsedPremium) {
    return res.status(403).json({ success: false, message: 'Premium access required for audit trail' });
  }

  try {
    const result = await EscrowChainSync.getBlockchainAuditTrail(req.params.transactionId);
    return res.json({ success: true, data: result.data, version: 'v1' });
  } catch (err) {
    logger.error('GET /api/escrow/audit failed', err);
    return res.status(500).json({ success: false, message: 'Unable to retrieve audit trail' });
  }
});

module.exports = router;
