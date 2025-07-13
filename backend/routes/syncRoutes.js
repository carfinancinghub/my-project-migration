// 👑 Crown Certified Route — syncRoutes.js
// Path: backend/routes/escrow/syncRoutes.js
// Purpose: Expose escrow sync endpoints for database and blockchain logging
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const EscrowChainSync = require('@services/escrow/EscrowChainSync');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

router.use(helmet());
router.use(rateLimit({ windowMs: 60000, max: 60 }));

router.post('/sync', async (req, res) => {
  try {
    const { actionData, isPremium } = req.body;
    const result = isPremium
      ? await EscrowChainSync.syncToBlockchain(actionData)
      : await EscrowChainSync.syncEscrowAction(actionData);
    res.json({ success: true, data: result, version: 'v1' });
  } catch (error) {
    logger.error('POST /sync failed', error);
    res.status(500).json({ success: false, error: 'Internal error' });
  }
});

router.get('/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { isPremium } = req.query;
    const status = await EscrowChainSync.getEscrowStatus(transactionId);
    const auditTrail = isPremium
      ? await EscrowChainSync.getBlockchainAuditTrail(transactionId)
      : null;
    res.json({ success: true, data: { status, auditTrail }, version: 'v1' });
  } catch (error) {
    logger.error('GET /status failed', error);
    res.status(500).json({ success: false, error: 'Fetch error' });
  }
});

module.exports = router;