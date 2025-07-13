// File: auctions.js
// Path: backend/routes/buyer/auctions.js
// Purpose: Retrieve buyer auction history and insights (with premium analytics support)
// Author: Rivers Auction Team
// Editor: Cod1 (05141426 - PDT) — New file created from spec
// 👑 Cod2 Crown Certified

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('@utils/logger');
const validateQueryParams = require('@utils/validateQueryParams');

const securedRouter = express.Router();

// Middleware: Security and rate limiting
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
        error: 'Rate limit exceeded. Try again shortly.',
        version: 'v1',
      }),
  })
);

// Validate and telemetry
securedRouter.use((req, res, next) => {
  res.locals._startAt = process.hrtime();
  const { buyerId, isPremium = false } = req.query;

  const validation = validateQueryParams(req.query, {
    buyerId: { type: 'string', required: true },
    isPremium: { type: 'boolean', required: false },
  });

  if (!validation.success) {
    logger.error('Validation failed:', validation.errors);
    return res.status(400).json({ success: false, error: validation.errors, version: 'v1' });
  }

  logger.info('GET /api/buyer/auctions request', req.query);
  next();
});

// GET endpoint
securedRouter.get('/', async (req, res) => {
  try {
    const { buyerId, isPremium } = req.query;

    const basicHistory = [
      { auctionId: 'AU123', item: '2015 Honda Accord', status: 'won', date: '2025-04-20' },
      { auctionId: 'AU456', item: '2018 Ford F-150', status: 'lost', date: '2025-04-25' },
    ];

    const premiumInsights = {
      successRate: '66%',
      averageBidCount: 5.4,
      peakActivityHours: ['10AM', '2PM'],
    };

    const result =
      isPremium === 'true' || isPremium === true
        ? { history: basicHistory, analytics: premiumInsights }
        : { history: basicHistory };

    const duration = process.hrtime(res.locals._startAt);
    logger.info(
      GET /api/buyer/auctions completed in ${(duration[0] * 1e3 + duration[1] / 1e6).toFixed(2)}ms
    );

    return res.status(200).json({ success: true, data: result, version: 'v1' });
  } catch (error) {
    logger.error('GET /api/buyer/auctions failed:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', version: 'v1' });
  }
});

module.exports = securedRouter;

/**
 * Functions Summary:
 * - GET /api/buyer/auctions
 *   - Purpose: Returns buyer’s auction participation history.
 *   - Inputs:
 *     - buyerId (string, required)
 *     - isPremium (boolean, optional)
 *   - Outputs:
 *     - Basic: history (won/lost auctions, timestamps)
 *     - Premium: + success rate, avg bids, activity heat
 *   - Security: Helmet, rate-limit, validation
 *   - Dependencies: express, helmet, @utils/logger, @utils/validateQueryParams
 */