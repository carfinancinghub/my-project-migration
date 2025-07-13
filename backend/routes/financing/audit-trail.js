// File: audit-trail.js
// Path: backend/routes/financing/audit-trail.js
// Purpose: Provide a financing audit trail with optional premium detail
// Author: Rivers Auction Team
// Date: May 14, 2025
// 👑 Cod2 Crown Certified

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('@utils/logger');
const validateQueryParams = require('@utils/validateQueryParams');

const securedRouter = express.Router();

// Security middleware
securedRouter.use(helmet());
securedRouter.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) =>
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Try again later.',
        version: 'v1',
      }),
  })
);

// Validation and telemetry
securedRouter.use((req, res, next) => {
  res.locals._startAt = process.hrtime();
  const { financeId, isPremium = false } = req.query;

  const validation = validateQueryParams(req.query, {
    financeId: { type: 'string', required: true },
    isPremium: { type: 'boolean', required: false },
  });

  if (!validation.success) {
    logger.error('Validation failed:', validation.errors);
    return res.status(400).json({ success: false, error: validation.errors, version: 'v1' });
  }

  logger.info('GET /api/financing/audit-trail request', req.query);
  next();
});

securedRouter.get('/', async (req, res) => {
  try {
    const { financeId, isPremium } = req.query;

    const basicLog = [
      { id: 'TX001', amount: 10000, date: '2025-05-01' },
      { id: 'TX002', amount: 8500, date: '2025-05-06' },
    ];

    const premiumAudit = {
      actions: [
        { user: 'admin1', step: 'approved', timestamp: '2025-05-01T12:00:00Z' },
        { user: 'agent2', step: 'reviewed', timestamp: '2025-05-06T09:30:00Z' },
      ],
    };

    const data = isPremium === 'true' || isPremium === true
      ? { logs: basicLog, auditTrail: premiumAudit }
      : { logs: basicLog };

    const duration = process.hrtime(res.locals._startAt);
    logger.info(GET /api/financing/audit-trail completed in ${(duration[0] * 1e3 + duration[1] / 1e6).toFixed(2)}ms);
    return res.status(200).json({ success: true, data, version: 'v1' });
  } catch (error) {
    logger.error('GET /api/financing/audit-trail failed:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', version: 'v1' });
  }
});

module.exports = securedRouter;
/*
Functions Summary:
- GET /api/financing/audit-trail
  - Purpose: Returns financing audit trail with optional premium-level audit detail
  - Inputs:
    - financeId (string, required)
    - isPremium (boolean, optional)
  - Outputs:
    - Base: { logs: [ { id, amount, date } ] }
    - Premium: adds { auditTrail: [ { user, step, timestamp } ] }
  - Security: Helmet, express-rate-limit, validation, telemetry
  - Dependencies: express, helmet, @utils/logger, @utils/validateQueryParams
*/
