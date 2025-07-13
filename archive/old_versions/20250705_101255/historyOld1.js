// File: history.js
// Path: backend/routes/auction/history.js
// Purpose: Serve user-based auction history with optional premium analytics
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
        error: 'Too many requests. Please try again later.',
        version: 'v1',
      }),
  })
);

// Validation and telemetry
securedRouter.use((req, res, next) => {
  res.locals._startAt = process.hrtime();
  const { userId, isPremium = false } = req.query;

  const validation = validateQueryParams(req.query, {
    userId: { type: 'string', required: true },
    isPremium: { type: 'boolean', required: false },
  });

  if (!validation.success) {
    logger.error('Validation failed:', validation.errors);
    return res.status(400).json({ success: false, error: validation.errors, version: 'v1' });
  }

  logger.info('GET /api/auction/history request', req.query);
  next();
});

// Core route logic
securedRouter.get('/', async (req, res) => {
  try {
    const { userId, isPremium } = req.query;

    const mockHistory = [
      { id: 'AU101', title: '2021 Ford F-150', endDate: '2025-05-01', finalBid: 14500 },
      { id: 'AU102', title: '2018 Tesla Model 3', endDate: '2025-05-05', finalBid: 29600 },
    ];

    const responseData =
      isPremium === 'true' || isPremium === true
        ? {
            history: mockHistory,
            analytics: {
              bidsOverTime: [1, 3, 6, 8, 10, 12],
            },
          }
        : { history: mockHistory };

    const duration = process.hrtime(res.locals._startAt);
    logger.info(
      GET /api/auction/history completed in ${(duration[0] * 1e3 + duration[1] / 1e6).toFixed(2)}ms
    );
    return res.status(200).json({ success: true, data: responseData, version: 'v1' });
  } catch (error) {
    logger.error('GET /api/auction/history failed:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', version: 'v1' });
  }
});

module.exports = securedRouter;

/*
Functions Summary:
- GET /api/auction/history (Security-Hardened)
  - Purpose: Return user auction history and optional analytics
  - Inputs:
    - userId (query param, string, required)
    - isPremium (query param, boolean, optional)
  - Outputs:
    - Base: { history: [{ id, title, endDate, finalBid }] }
    - Premium: { analytics: { bidsOverTime } }
  - Features:
    - Helmet, rate limit, telemetry, query validation
  - Dependencies: express, helmet, rate-limit, @utils/logger, @utils/validateQueryParams
*/
