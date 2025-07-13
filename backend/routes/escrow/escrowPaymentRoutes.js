// 👑 Crown Certified Route — escrowPaymentRoutes.js
// Path: backend/routes/escrow/escrowPaymentRoutes.js
// Purpose: Manage escrow payment actions (initiate, confirm), sync with EscrowChainSync and blockchain.
// Author: Rivers Auction Team — May 16, 2025

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('@utils/logger');
const validateQueryParams = require('@utils/validateQueryParams');
const EscrowChainSync = require('@services/escrow/EscrowChainSync');

const router = express.Router();
router.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: '⚠️ Rate limit exceeded. Please wait.',
});

// POST /api/escrow/payment/initiate
router.post('/payment/initiate', limiter, async (req, res) => {
  const { transactionId, buyerId, amount, isPremium = false } = req.body;

  const validation = validateQueryParams(
    { transactionId, buyerId, amount },
    {
      transactionId: 'stringRequired',
      buyerId: 'stringRequired',
      amount: 'numberRequired',
    }
  );

  if (!validation.success) {
    logger.error('🚫 Invalid escrow initiation payload', validation.errors);
    return res.status(400).json({ success: false, message: 'Invalid payment data' });
  }

  try {
    const actionData = {
      transactionId,
      actionType: 'payment-initiated',
      userId: buyerId,
      metadata: { amount },
    };

    const dbLog = await EscrowChainSync.syncEscrowAction(actionData);

    let blockchain = null;
    if (isPremium === true || isPremium === 'true') {
      await EscrowChainSync.syncToBlockchain(actionData);
      blockchain = await EscrowChainSync.getBlockchainAuditTrail(transactionId);
    }

    return res.status(201).json({
      success: true,
      data: { transactionId, status: 'initiated', dbLog, blockchain },
      version: 'v1',
    });
  } catch (err) {
    logger.error('❌ Payment initiation failed', err);
    return res.status(500).json({ success: false, message: 'Payment initiation error' });
  }
});

// POST /api/escrow/payment/confirm
router.post('/payment/confirm', limiter, async (req, res) => {
  const { transactionId, officerId, confirmationNote, isPremium = false } = req.body;

  const validation = validateQueryParams(
    { transactionId, officerId },
    {
      transactionId: 'stringRequired',
      officerId: 'stringRequired',
    }
  );

  if (!validation.success) {
    logger.error('🚫 Invalid escrow confirmation payload', validation.errors);
    return res.status(400).json({ success: false, message: 'Invalid confirmation data' });
  }

  try {
    const actionData = {
      transactionId,
      actionType: 'payment-confirmed',
      userId: officerId,
      metadata: { note: confirmationNote || 'Confirmed by officer' },
    };

    const dbLog = await EscrowChainSync.syncEscrowAction(actionData);

    let blockchain = null;
    if (isPremium === true || isPremium === 'true') {
      await EscrowChainSync.syncToBlockchain(actionData);
      blockchain = await EscrowChainSync.getBlockchainAuditTrail(transactionId);
    }

    return res.status(200).json({
      success: true,
      data: { transactionId, status: 'confirmed', dbLog, blockchain },
      version: 'v1',
    });
  } catch (err) {
    logger.error('❌ Payment confirmation failed', err);
    return res.status(500).json({ success: false, message: 'Payment confirmation error' });
  }
});

module.exports = router;
