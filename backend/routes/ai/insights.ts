/**
 * © 2025 CFH, All Rights Reserved
 * File: insights.ts
 * Path: C:\cfh\backend\routes\ai\insights.ts
 * Purpose: Expose AI platform insights (metrics, forecasts, recommendations) for dashboards.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1708]
 * Version: 1.0.1
 * Version ID: g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2
 * Save Location: backend/routes/ai/insights.ts
 * Updated By: Cod1
 * Timestamp: 2025-07-18 [1708]
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Typed Express router, granular rate limit, input validation.
 * - Placeholder auth/cache, strong error handling, type-safe query params.
 * - Suggest endpoint test coverage for premium gating and cache.
 */

import express, { Router, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import InsightsService from '@services/ai/InsightsService';
import logger from '@utils/logger';
import validateQueryParams from '@utils/validateQueryParams';
// Placeholder: import authMiddleware from '@middleware/auth';
// Placeholder: import cache from '@utils/cache';

const router: Router = express.Router();
router.use(helmet());

const getMaxRate = (isPremium: boolean) => (isPremium ? 120 : 60);

router.use((req: Request, res: Response, next) => {
  const { isPremium } = req.query as { isPremium?: string };
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: getMaxRate(isPremium === 'true'),
    message: '⚠️ Too many insight requests from this IP, please try again later.',
  });
  limiter(req, res, next);
});

// Placeholder: router.use(authMiddleware);

// @route GET /api/insights
// @desc Fetch platform metrics, predictions, and AI tips
router.get('/', async (req: Request, res: Response) => {
  const { isPremium = 'false', userId = null } = req.query as { isPremium?: string; userId?: string | null };
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
    // Placeholder: const cached = await cache.get(`insights:${userId}:${parsedPremium}`);
    // if (cached) return res.status(200).json(JSON.parse(cached));

    const data = await InsightsService.getInsights({
      isPremium: parsedPremium,
      userId: userId || null,
    });

    // Placeholder: cache.set(`insights:${userId}:${parsedPremium}`, JSON.stringify({ success: true, data, version: 'v1' }));

    return res.status(200).json({
      success: true,
      data,
      version: 'v1',
    });
  } catch (err: any) {
    logger.error('GET /api/insights failed', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve insights at this time.',
    });
  }
});

export default router;
