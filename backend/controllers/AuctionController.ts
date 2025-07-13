/**
 * © 2025 CFH, All Rights Reserved
 * File: AuctionController.ts
 * Path: C:\CFH\backend\controllers\AuctionController.ts
 * Purpose: Handles retrieving and bidding on auctions in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-07 [2021]
 * Version: 1.0.0
 * Version ID: a1b0c9d8-e7f6-g5h4-i3j2-k1l0m9n8o7p6
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: a1b0c9d8-e7f6-g5h4-i3j2-k1l0m9n8o7p6
 * Save Location: C:\CFH\backend\controllers\AuctionController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Grok]:
 * - Converted ES modules to TypeScript with ESM imports.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`PlaceBidBody`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Grok]:
 * - Used `@utils/logger` with `Artifact ID` prefix and `next(error)`.
 *
 * 3. Validation [Grok]:
 * - Added Joi validation via `@validation/auction.validation.ts`.
 *
 * 4. Authentication & Authorization [Grok]:
 * - Added `req.user` checks and role-based authorization.
 *
 * 5. Services (Suggestion) [Grok]:
 * - Move database operations to `AuctionService.ts`.
 *
 * 6. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 *
 * 7. Metadata [Grok]:
 * - Added `Artifact ID`, `Version ID`, and updated Author/Timestamp.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Auction, { IAuction } from '@models/Auction';
import User from '@models/User';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getAuctionValidation, placeBidValidation } from '@validation/auction.validation';

/* --- Interfaces --- */
interface PlaceBidBody {
  amount: number;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'buyer';
  };
}

/* --- Controller Functions --- */

/**
 * @function getAuction
 * @desc Retrieves an auction by its unique ID.
 */
export const getAuction = async (req: AuthenticatedRequest<{ auctionId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'a1b0c9d8-e7f6-g5h4-i3j2-k1l0m9n8o7p6';
  try {
    const { error } = getAuctionValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch auction');
    }
    if (user.role !== 'admin' && user.role !== 'buyer') {
      throw new ForbiddenError('Only admins or buyers may fetch auctions');
    }

    const { auctionId } = req.params;
    const auction: IAuction | null = await Auction.findById(auctionId).lean();
    if (!auction) {
      throw new NotFoundError('Auction not found');
    }

    res.status(200).json(auction);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch auction';
    logger.error(`a1b0c9d8: Error fetching auction ${req.params.auctionId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function placeBid
 * @desc Places a bid on an auction for an authenticated buyer.
 */
export const placeBid = async (req: AuthenticatedRequest<{ auctionId: string }, {}, PlaceBidBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'a1b0c9d8-e7f6-g5h4-i3j2-k1l0m9n8o7p6';
  try {
    const { error } = placeBidValidation.params.validate(req.params);
    const bodyError = placeBidValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to place bid');
    }
    if (user.role !== 'buyer') {
      throw new ForbiddenError('Only buyers may place bids');
    }

    const { auctionId } = req.params;
    const { amount } = req.body;
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      throw new NotFoundError('Auction not found');
    }

    if (auction.status !== 'active') {
      throw new BadRequestError('Cannot place bid on inactive auction');
    }

    const userExists = await User.findById(user.id);
    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    auction.bids.push({ userId: user.id, amount });
    const updatedAuction = await auction.save();

    res.status(201).json({ message: 'Bid placed successfully', bid: { amount, userId: user.id, auctionId } });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to place bid';
    logger.error(`a1b0c9d8: Error placing bid on auction ${req.params.auctionId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};