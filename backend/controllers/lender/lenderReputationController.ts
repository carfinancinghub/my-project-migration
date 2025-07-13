/**
 * © 2025 CFH, All Rights Reserved
 * File: lenderReputationController.ts
 * Path: C:\CFH\backend\controllers\lender\lenderReputationController.ts
 * Purpose: Handles fetching and adding reviews for lender reputations.
 * Author: Mini Team
 * Date: 2025-07-06 [1033]
 * Version: 1.0.1
 * Version ID: x3y2z1a0-b9c8-d7e6-f5g4-h3i2j1k0l9m8
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: x3y2z1a0-b9c8-d7e6-f5g4-h3i2j1k0l9m8
 * Save Location: C:\CFH\backend\controllers\lender\lenderReputationController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`AddReviewBody`, `AuthenticatedRequest`).
 * - Imported `ILenderReputation` for strong typing.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving reputation logic to `LenderReputationService.ts`.
 *
 * 4. Performance (Suggestion) [Cod1]:
 * - Use `.lean()` for `getReputation` queries.
 *
 * 5. Testing (Suggestion) [Cod1]:
 * - Add Jest tests for validation and logic paths.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import LenderReputation, { ILenderReputation } from '@models/LenderReputation';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { getReputationValidation, addReviewValidation } from '@validation/lenderReputation.validation';

/* --- Interfaces --- */
interface AddReviewBody {
  rating: number;
  comment: string;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/* --- Controller Functions --- */

/**
 * @function getReputation
 * @desc Retrieves the reputation document for a specific lender.
 */
export const getReputation = async (req: AuthenticatedRequest<{ lenderId: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lenderId } = req.params;
    const { error } = getReputationValidation.params.validate({ lenderId });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch reputation');
    }

    const reputation: ILenderReputation | null = await LenderReputation.findOne({ lender: lenderId })
      .populate('lender', 'username email')
      .populate('reviews.reviewer', 'username')
      .lean();

    if (!reputation) {
      throw new NotFoundError('Reputation not found for this lender');
    }

    res.status(200).json(reputation);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error fetching lender reputation';
    logger.error(`x3y2z1a0: Error fetching lender reputation for lender ${req.params.lenderId}: ${errorMessage}`);
    next(new InternalServerError(errorMessage));
  }
};

/**
 * @function addReview
 * @desc Adds a new review to a lender's reputation document and recalculates the average rating.
 */
export const addReview = async (req: AuthenticatedRequest<{ lenderId: string }, {}, AddReviewBody>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lenderId } = req.params;
    const { rating, comment } = req.body;
    const { error } = addReviewValidation.params.validate({ lenderId });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }
    const bodyError = addReviewValidation.body.validate({ rating, comment });
    if (bodyError.error) {
      throw new BadRequestError(bodyError.error.details[0].message);
    }

    const reviewerId = req.user?.id;
    if (!reviewerId) {
      throw new BadRequestError('User authentication is required to add a review');
    }

    let reputation = await LenderReputation.findOne({ lender: lenderId });
    if (!reputation) {
      reputation = new LenderReputation({ lender: lenderId, reviews: [] });
    }

    const alreadyReviewed = reputation.reviews.some(r => r.reviewer.toString() === reviewerId);
    if (alreadyReviewed) {
      throw new BadRequestError('You have already submitted a review for this lender');
    }

    reputation.reviews.push({
      reviewer: reviewerId,
      rating,
      comment,
    });

    const totalRating = reputation.reviews.reduce((sum, review) => sum + review.rating, 0);
    reputation.rating = parseFloat((totalRating / reputation.reviews.length).toFixed(2));
    reputation.updatedAt = new Date();

    const updatedReputation = await reputation.save();
    res.status(201).json(updatedReputation);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error adding lender review';
    logger.error(`x3y2z1a0: Error adding lender review for lender ${req.params.lenderId}: ${errorMessage}`);
    next(new InternalServerError(errorMessage));
  }
};