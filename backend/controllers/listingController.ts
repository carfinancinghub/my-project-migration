/**
 * © 2025 CFH, All Rights Reserved
 * File: listingController.ts
 * Path: C:\CFH\backend\controllers\listingController.ts
 * Purpose: Handles creating, retrieving, and updating vehicle listings for the marketplace.
 * Author: Mini Team
 * Date: 2025-07-06 [2108]
 * Version: 1.0.0
 * Version ID: b3c2d1a0-f9e8-d7c6-b5a4-f3e2d1c0b9a
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: b3c2d1a0-f9e8-d7c6-b5a4-f3e2d1c0b9a
 * Save Location: C:\CFH\backend\controllers\listingController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`CreateListingBody`, `UpdateListingBody`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Services (Suggestion) [Mini]:
 * - Move database operations to `ListingService.ts`.
 *
 * 4. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Listing, { IListing } from '@models/Listing';
import Car from '@models/Car';
import Auction from '@models/Auction';
import User from '@models/User';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getAllActiveListingsValidation, getListingByIdValidation, createListingValidation, updateListingValidation } from '@validation/listing.validation';

/* --- Interfaces --- */
interface CreateListingBody {
  carId: string;
  auctionId?: string;
  isFeatured?: boolean;
  expiresAt?: Date;
}

interface UpdateListingBody {
  isFeatured?: boolean;
  expiresAt?: Date;
  status?: 'Active' | 'Inactive' | 'Sold';
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'seller' | 'buyer';
  };
}

/* --- Controller Functions --- */

/**
 * @function getAllActiveListings
 * @desc Retrieves all listings with an 'Active' status.
 */
export const getAllActiveListings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'b3c2d1a0-f9e8-d7c6-b5a4-f3e2d1c0b9a';
  try {
    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch listings');
    }

    const listings: IListing[] = await Listing.find({ status: 'Active' })
      .populate('carId')
      .populate('sellerId', 'name')
      .lean();

    res.status(200).json(listings);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch listings';
    logger.error(`b3c2d1a0: Error fetching active listings: ${errorMessage}`);
    if (error instanceof BadRequestError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function getListingById
 * @desc Retrieves a specific listing by its unique ID.
 */
export const getListingById = async (req: AuthenticatedRequest<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'b3c2d1a0-f9e8-d7c6-b5a4-f3e2d1c0b9a';
  try {
    const { error } = getListingByIdValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch listing');
    }

    const { id } = req.params;
    const listing: IListing | null = await Listing.findById(id)
      .populate('carId')
      .populate('sellerId', 'name')
      .lean();

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    res.status(200).json(listing);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch listing';
    logger.error(`b3c2d1a0: Error fetching listing by ID ${req.params.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function createListing
 * @desc Creates a new listing for an authenticated seller.
 */
export const createListing = async (req: AuthenticatedRequest<{}, {}, CreateListingBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'b3c2d1a0-f9e8-d7c6-b5a4-f3e2d1c0b9a';
  try {
    const { error } = createListingValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to create a listing');
    }
    if (user.role !== 'seller') {
      throw new ForbiddenError('Only sellers may create listings');
    }

    const { carId, auctionId, isFeatured, expiresAt } = req.body;
    const [car, auction, seller] = await Promise.all([
      Car.findById(carId),
      auctionId ? Auction.findById(auctionId) : Promise.resolve(null),
      User.findById(user.id),
    ]);

    if (!car) {
      throw new NotFoundError('Car not found');
    }
    if (auctionId && !auction) {
      throw new NotFoundError('Auction not found');
    }
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }

    const listing = new Listing({
      carId,
      auctionId,
      sellerId: user.id,
      isFeatured: isFeatured || false,
      expiresAt: expiresAt || undefined,
    });

    const savedListing = await listing.save();
    res.status(201).json(savedListing);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create listing';
    logger.error(`b3c2d1a0: Error creating listing for car ${req.body.carId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function updateListing
 * @desc Updates an existing listing for an authenticated seller or admin.
 */
export const updateListing = async (req: AuthenticatedRequest<{ id: string }, {}, UpdateListingBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'b3c2d1a0-f9e8-d7c6-b5a4-f3e2d1c0b9a';
  try {
    const { error } = updateListingValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }
    const bodyError = updateListingValidation.body.validate(req.body);
    if (bodyError.error) {
      throw new BadRequestError(`Validation failed: ${bodyError.error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to update a listing');
    }
    if (user.role !== 'seller' && user.role !== 'admin') {
      throw new ForbiddenError('Only sellers or admins may update listings');
    }

    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    if (user.role !== 'admin' && listing.sellerId.toString() !== user.id) {
      throw new ForbiddenError('User is not authorized to update this listing');
    }

    Object.assign(listing, req.body);
    const updatedListing = await listing.save();
    res.status(200).json(updatedListing);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update listing';
    logger.error(`b3c2d1a0: Error updating listing ${req.params.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};