// 👑 Crown Certified Router — escrowRoutes.js
// Path: backend/routes/escrow/escrowRoutes.js
// Purpose: Central router for all escrow endpoints (sync, audit, notify, payment) with blockchain integration.
// Author: Rivers Auction Team — May 16, 2025

const express = require('express');
const router = express.Router();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('@utils/logger');
const validateQueryParams = require('@utils/validateQueryParams');

// Sub-routes
const syncRoutes = require('@routes/escrow/sync');
const auditRoutes = require('@routes/escrow/escrowAuditLogRoutes');
const notifyRoutes = require('@routes/escrow/escrowNotifyRoutes');
const paymentRoutes = require('@routes/escrow/escrowPaymentRoutes');

// Security middlewares
router.use(helmet());
router.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// Route mapping
router.use('/sync', syncRoutes);
router.use('/audit', auditRoutes);
router.use('/notify', notifyRoutes);
router.use('/pay', paymentRoutes);

// Catch-all error handler for unsupported routes
router.all('*', (req, res) => {
  logger.error(`Unsupported escrow route: ${req.method} ${req.originalUrl}`);
  return res.status(404).json({
    success: false,
    message: `Invalid escrow route: ${req.originalUrl}`,
    version: 'v1',
  });
});

module.exports = router;