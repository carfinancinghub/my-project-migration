/**
 * © 2025 CFH, All Rights Reserved
 * File: errorHandler.ts
 * Path: C:\cfh\backend\middleware\errorHandler.ts
 * Purpose: Centralized Express error handling middleware with tier-based response logic and advanced logging for the CFH Automotive Ecosystem.
 * Author: Cod1 Team (upgraded from legacy .js, reviewed by Grok)
 * Date: 2025-07-14 [1957] // PDT military time
 * Version: 1.1.0
 * Version ID: 5c1a2b3d-7e8f-4a6c-b2e3-c4d5f6a7b8c9
 * Crown Certified: Yes
 * Batch ID: Compliance-071425
 * Artifact ID: 5c1a2b3d-7e8f-4a6c-b2e3-c4d5f6a7b8c9
 * Save Location: C:\cfh\backend\middleware\errorHandler.ts
 * Updated By: Cod1
 * Timestamp: 2025-07-14 [1957]
 *
 * Future Enhancements (Cod1+):
 * - Integrate alerting/Slack/email for critical errors (Premium/Wow++).
 * - Blockchain audit logging of fatal errors (Wow++).
 * - User-facing localization and i18n for all messages.
 * - In-app error dashboard for admins (Premium+).
 */

import { Request, Response, NextFunction } from 'express';
import logger from '@utils/logger'; // Project-level logger with meta/correlation
import { UserTier } from '@utils/constants'; // Enum for user tiers

interface CFHError extends Error {
  statusCode?: number;
  code?: string;
}

// Tier-based logic for revealing stack traces
const shouldShowStack = (tier: string, nodeEnv: string) =>
  nodeEnv === 'development' || tier === 'premium' || tier === 'wowplus';

export const errorHandler = (
  err: CFHError,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  const correlationId = req.headers['x-correlation-id'] || '';
  const user = (req as any).user || {};
  const tier = user.tier || UserTier.BASIC;
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';

  logger.error('API Error', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: user.id,
    tier,
    correlationId,
    status: statusCode,
  });

  // Premium/Wow++: Trigger alerts for critical errors
  // if ((tier === UserTier.PREMIUM || tier === UserTier.WOWPLUS) && statusCode >= 500) {
  //   // TODO: Send alert to admin/Slack/email
  // }
  // Wow++: Blockchain audit for fatal
  // if (tier === UserTier.WOWPLUS && statusCode >= 500) {
  //   // TODO: Record error in blockchain audit log
  // }

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    code: errorCode,
    correlationId,
    ...(shouldShowStack(tier, process.env.NODE_ENV || '') ? { stack: err.stack } : {}),
  });
};

export default errorHandler;
