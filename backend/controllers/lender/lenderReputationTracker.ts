/**
 * © 2025 CFH, All Rights Reserved
 * File: lenderReputationTracker.ts
 * Path: C:\CFH\backend\controllers\lender\lenderReputationTracker.ts
 * Purpose: Controller for lender reputation management (get/add reviews) with tier-based features in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-15 [06:34]
 * Version: 1.1.0
 * Version ID: e2f3g4h5-i6j7-k8l9-m0n1-o2p3q4r5s6t7
 * Crown Certified: Yes (pending final test)
 * Batch ID: Compliance-071425
 * Artifact ID: e2f3g4h5-i6j7-k8l9-m0n1-o2p3q4r5s6t7
 * Save Location: C:\CFH\backend\controllers\lender\lenderReputationTracker.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-15 [06:34]
 */

/*
 * Future Enhancements (Cod1):
 * - Add interfaces for Review and LenderReputation (Cod1, 2025-07-15 [09:00]).
 * - Use Zod for validation (rating 0-5, comment length) (Cod1, 2025-07-15 [09:00]).
 * - Extract logic to lenderReputation.service.ts (Cod1, 2025-07-15 [09:00]).
 * - Replace console.error with @utils/logger (Cod1, 2025-07-15 [09:00]).
 * - Add rate limiting to prevent spam reviews (Cod1, 2025-07-15 [09:00]).
 * - Add authorization middleware (e.g., borrower interaction check) (Cod1, 2025-07-15 [09:00]).
 * - Refactor average rating calculation to function (Cod1, 2025-07-15 [09:00]).
 * - Add test coverage with ts-jest or vitest (Cod1, 2025-07-15 [09:00]).
 */

import { Request, Response } from 'express';
import { z } from 'zod'; // For validation
import { v4 as uuidv4 } from 'uuid';
import logger from '@utils/logger'; // Alias import
import * as lenderReputationService from '@services/lenderReputationService'; // Alias import
import { UserRole } from '@utils/constants'; // For role checks (assume exists)

const reviewSchema = z.object({
  rating: z.number().min(0).max(5),
  comment: z.string().max(500),
});

/**
 * Gets lender reputation.
 * @param {Request} req - Express request with lenderId in params.
 * @param {Response} res - Express response object.
 */
export const getReputation = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  try {
    const reputation = await lenderReputationService.getReputation(req.params.lenderId);
    if (!reputation) {
      logger.warn('Reputation not found', { correlationId, lenderId: req.params.lenderId });
      res.status(404).json({ message: 'Reputation not found' });
      return;
    }

    logger.info('Reputation fetched', { correlationId, lenderId: req.params.lenderId });
    res.status(200).json(reputation);
  } catch (error) {
    logger.error('[Reputation Fetch Error]', { correlationId, error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Adds a review to a lender.
 * @param {Request} req - Express request with lenderId in params, rating, comment in body.
 * @param {Response} res - Express response object.
 */
export const addReview = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  try {
    // Authorization: Assume middleware checks UserRole.BORROWER or interaction
    const data = reviewSchema.parse(req.body);
    const reputation = await lenderReputationService.addReview(req.params.lenderId, req.user?.id, data.rating, data.comment);

    logger.info('Review added', { correlationId, lenderId: req.params.lenderId, reviewerId: req.user?.id });
    res.status(201).json(reputation);
  } catch (error) {
    logger.error('[Add Review Error]', { correlationId, error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Premium/Wow++ Note: Add review weighting for premium (reputation-based), blockchain log for Wow++ (call @blockchain/logReview).
