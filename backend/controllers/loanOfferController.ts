/**
 * © 2025 CFH, All Rights Reserved
 * File: loanOfferController.ts
 * Path: C:\CFH\backend\controllers\loanOfferController.ts
 * Purpose: Handles creating, retrieving, and updating loan offers for auctions.
 * Author: Mini Team
 * Date: 2025-07-06 [2053]
 * Version: 1.0.0
 * Version ID: a2b1c0d9-e8f7-g6h5-i4j3-k2l1m0n9o8p7
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: a2b1c0d9-e8f7-g6h5-i4j3-k2l1m0n9o8p7
 * Save Location: C:\CFH\backend\controllers\loanOfferController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`CreateLoanOfferBody`, `UpdateLoanOfferBody`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Services (Suggestion) [Mini]:
 * - Move database operations to `LoanOfferService.ts`.
 *
 * 4. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import LoanOffer, { ILoanOffer } from '@models/LoanOffer';
import Auction from '@models/Auction';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getOffersByAuctionValidation, createLoanOfferValidation, updateLoanOfferValidation } from '@validation/loanOffer.validation';

/* --- Interfaces --- */
interface CreateLoanOfferBody {
  auctionId: string;
  interestRate: number;
  downPaymentRequired: boolean;
  incomeVerificationRequired: boolean;
}

interface UpdateLoanOfferBody {
  interestRate?: number;
  downPaymentRequired?: boolean;
  incomeVerificationRequired?: boolean;
  status?: 'pending' | 'accepted' | 'rejected';
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'lender' | 'buyer';
  };
}

/* --- Controller Functions --- */

/**
 * @function getOffersByAuction
 * @desc Retrieves all loan offers for a specific auction.
 */
export const getOffersByAuction = async (req: AuthenticatedRequest<{ auctionId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'a2b1c0d9-e8f7-g6h5-i4j3-k2l1m0n9o8p7';
  try {
    const { error } = getOffersByAuctionValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch loan offers');
    }

    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      throw new NotFoundError('Auction not found');
    }

    const offers: ILoanOffer[] = await LoanOffer.find({ auctionId })
      .populate('lenderId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(offers);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch loan offers';
    logger.error(`a2b1c0d9: Error fetching offers for auction ${req.params.auctionId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function createLoanOffer
 * @desc Allows an authenticated lender to submit a new loan offer.
 */
export const createLoanOffer = async (req: AuthenticatedRequest<{}, {}, CreateLoanOfferBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'a2b1c0d9-e8f7-g6h5-i4j3-k2l1m0n9o8p7';
  try {
    const { error } = createLoanOfferValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to create a loan offer');
    }
    if (user.role !== 'lender') {
      throw new ForbiddenError('Only lenders may create loan offers');
    }

    const { auctionId, interestRate, downPaymentRequired, incomeVerificationRequired } = req.body;
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      throw new NotFoundError('Auction not found');
    }

    const offer = new LoanOffer({
      auctionId,
      lenderId: user.id,
      interestRate,
      downPaymentRequired,
      incomeVerificationRequired,
    });

    const savedOffer = await offer.save();
    res.status(201).json(savedOffer);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create loan offer';
    logger.error(`a2b1c0d9: Error creating loan offer for auction ${req.body.auctionId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function updateLoanOffer
 * @desc Allows an admin or the originating lender to update an existing loan offer.
 */
export const updateLoanOffer = async (req: AuthenticatedRequest<{ offerId: string }, {}, UpdateLoanOfferBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'a2b1c0d9-e8f7-g6h5-i4j3-k2l1m0n9o8p7';
  try {
    const { error } = updateLoanOfferValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }
    const bodyError = updateLoanOfferValidation.body.validate(req.body);
    if (bodyError.error) {
      throw new BadRequestError(`Validation failed: ${bodyError.error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to update a loan offer');
    }

    const { offerId } = req.params;
    const offer = await LoanOffer.findById(offerId);
    if (!offer) {
      throw new NotFoundError('Loan offer not found');
    }

    if (user.role !== 'admin' && offer.lenderId.toString() !== user.id) {
      throw new ForbiddenError('User is not authorized to update this loan offer');
    }

    Object.assign(offer, req.body);
    const updatedOffer = await offer.save();
    res.status(200).json(updatedOffer);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update loan offer';
    logger.error(`a2b1c0d9: Error updating loan offer ${req.params.offerId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};