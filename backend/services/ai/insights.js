// 👑 Crown Certified Route — insights.js
// Path: backend/routes/ai/insights.js
// Purpose: Expose AI platform insights (metrics, forecasts, recommendations) for dashboards.
// Author: Rivers Auction Team — May 16, 2025

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const InsightsService = require('@services/ai/InsightsService');
const logger = require('@utils/logger');
const validateQueryParams = require('@utils/validateQueryParams');

const router = express.Router();
router.use(helmet());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: '⚠️ Too many insight requests from this IP, please try again later.',
});

// @route   GET /api/insights
// @desc    Fetch platform metrics, predictions, and AI tips
// @access  Public (gated by query flag)
router.get('/', limiter, async (req, res) => {
  const { isPremium = 'false', userId = null } = req.query;

  const parsedPremium = isPremium === 'true';

  const valid = validateQueryParams(req.query, {
    isPremium: 'booleanOptional',
    userId: 'stringOptional',
  });

  if (!valid.success) {
    logger.error('Invalid query params for /api/insights', valid.errors);
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters.',
      errors: valid.errors,
    });
  }

  try {
    const data = await InsightsService.getInsights({
      isPremium: parsedPremium,
      userId: userId || null,
    });

    return res.status(200).json({
      success: true,
      data,
      version: 'v1',
    });
  } catch (err) {
    logger.error('GET /api/insights failed', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve insights at this time.',
    });
  }
});

module.exports = router;