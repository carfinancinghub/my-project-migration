/**
 * © 2025 CFH, All Rights Reserved
 * File: StorageHostController.ts
 * Path: C:\CFH\backend\controllers\StorageHostController.ts
 * Purpose: Manage storage host operations (listings, bookings).
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [1737]
 * Version: 1.0.0
 * Version ID: v3w2x1y0-z9a8-b7c6-d5e4-f3g2h1i0j9k8
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: v3w2x1y0-z9a8-b7c6-d5e4-f3g2h1i0j9k8
 * Save Location: C:\CFH\backend\controllers\StorageHostController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Replaced `express-async-handler` with `try...catch` blocks.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`AuthenticatedRequest`, `CreateListingBody`, `UpdateListingBody`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Validation [Grok]:
 * - Applied Joi schemas from `storage.validation.ts`.
 * - Added query validation for `getStorageListings`.
 *
 * 4. Services (Suggestion) [Mini]:
 * - Move database operations to `StorageService.ts`.
 *
 * 5. Testing (Suggestion) [Cod1]:
 * - Add unit tests for all endpoints.
 *
 * 6. Metadata [Grok]:
 * - Updated Author and Timestamp to reflect compliance confirmation.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Storage, { IStorage } from '@models/Storage';
import User from '@models/User';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import {
  getStorageListingsValidation,
  createStorageListingValidation,
  updateStorageListingValidation,
  deleteStorageListingValidation,
} from '@validation/storage.validation';

/* --- Interfaces --- */
interface CreateListingBody {
  location: string;
  pricePerDay: number;
  capacity: string;
  amenities?: string[];
  description?: string;
}

interface UpdateListingBody {
  pricePerDay?: number;
  capacity?: string;
  amenities?: string[];
  description?: string;
  isAvailable?: boolean;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'host';
  };
}

/* --- Controller Functions --- */

/**
 * @function getStorageListings
 * @desc Get all storage listings for a specific host.
 */
export const getStorageListings = async (req: AuthenticatedRequest<{ hostId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'v3w2x1y0-z9a8-b7c6-d5e4-f3g2h1i0j9k8';
  try {
    const { error: paramsError } = getStorageListingsValidation.params.validate(req.params);
    const { error: queryError } = getStorageListingsValidation.query.validate(req.query);
    if (paramsError || queryError) {
      throw new BadRequestError(`Validation failed: ${paramsError?.details[0].message || queryError?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch storage listings');
    }
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new ForbiddenError('Only hosts or admins may fetch storage listings');
    }

    const { hostId } = req.params;
    const { isAvailable, minPrice, maxPrice } = req.query as { isAvailable?: boolean; minPrice?: number; maxPrice?: number };
    const hostExists = await User.findById(hostId);
    if (!hostExists) {
      throw new NotFoundError('Host not found');
    }

    const query: any = { hostId };
    if (isAvailable !== undefined) query.isAvailable = isAvailable;
    if (minPrice) query.pricePerDay = { ...query.pricePerDay, $gte: minPrice };
    if (maxPrice) query.pricePerDay = { ...query.pricePerDay, $lte: maxPrice };

    const listings: IStorage[] = await Storage.find(query).lean();
    if (!listings || listings.length === 0) {
      throw new NotFoundError('No storage listings found for this host');
    }

    res.status(200).json(listings);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch storage listings';
    logger.error(`v3w2x1y0: Error fetching storage listings for host ${req.params.hostId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function createStorageListing
 * @desc Create a new storage listing for the authenticated host.
 */
export const createStorageListing = async (req: AuthenticatedRequest<{ hostId: string }, {}, CreateListingBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'v3w2x1y0-z9a8-b7c6-d5e4-f3g2h1i0j9k8';
  try {
    const { error } = createStorageListingValidation.params.validate(req.params);
    const bodyError = createStorageListingValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to create a storage listing');
    }
    if (user.role !== 'host') {
      throw new ForbiddenError('Only hosts may create storage listings');
    }

    const { hostId } = req.params;
    if (user.id !== hostId) {
      throw new ForbiddenError('User is not authorized to create a listing for this host');
    }

    const hostExists = await User.findById(hostId);
    if (!hostExists) {
      throw new NotFoundError('Host not found');
    }

    const { location, pricePerDay, capacity, amenities, description } = req.body;
    const newListing = await Storage.create({
      hostId,
      location,
      pricePerDay,
      capacity,
      amenities,
      description,
    });

    res.status(201).json(newListing);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create storage listing';
    logger.error(`v3w2x1y0: Error creating storage listing for host ${req.params.hostId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function updateStorageListing
 * @desc Update an existing storage listing.
 */
export const updateStorageListing = async (req: AuthenticatedRequest<{ hostId: string; listingId: string }, {}, UpdateListingBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'v3w2x1y0-z9a8-b7c6-d5e4-f3g2h1i0j9k8';
  try {
    const { error } = updateStorageListingValidation.params.validate(req.params);
    const bodyError = updateStorageListingValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to update a storage listing');
    }
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new ForbiddenError('Only hosts or admins may update storage listings');
    }

    const { hostId, listingId } = req.params;
    if (user.role !== 'admin' && user.id !== hostId) {
      throw new ForbiddenError('User is not authorized to update this listing');
    }

    const listing = await Storage.findOne({ _id: listingId, hostId });
    if (!listing) {
      throw new NotFoundError('Storage listing not found or user is not the owner');
    }

    const updatedListing = await Storage.findByIdAndUpdate(listingId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedListing);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update storage listing';
    logger.error(`v3w2x1y0: Error updating storage listing ${req.params.listingId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function deleteStorageListing
 * @desc Delete a storage listing.
 */
export const deleteStorageListing = async (req: AuthenticatedRequest<{ hostId: string; listingId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'v3w2x1y0-z9a8-b7c6-d5e4-f3g2h1i0j9k8';
  try {
    const { error } = deleteStorageListingValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to delete a storage listing');
    }
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new ForbiddenError('Only hosts or admins may delete storage listings');
    }

    const { hostId, listingId } = req.params;
    if (user.role !== 'admin' && user.id !== hostId) {
      throw new ForbiddenError('User is not authorized to delete this listing');
    }

    const listing = await Storage.findOne({ _id: listingId, hostId });
    if (!listing) {
      throw new NotFoundError('Storage listing not found or user is not the owner');
    }

    await Storage.findByIdAndDelete(listingId);
    res.status(200).json({ message: 'Storage listing deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete storage listing';
    logger.error(`v3w2x1y0: Error deleting storage listing ${req.params.listingId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};