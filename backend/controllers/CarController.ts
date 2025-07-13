/**
 * © 2025 CFH, All Rights Reserved
 * File: CarController.ts
 * Path: C:\CFH\backend\controllers\CarController.ts
 * Purpose: Handles creating, retrieving, and updating car data.
 * Author: Mini Team, Grok
 * Date: 2025-07-07 [0126]
 * Version: 1.0.2
 * Version ID: m3n2o1p0-q9r8-s7t6-u5v4-w3x2y1z0a9b8
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: m3n2o1p0-q9r8-s7t6-u5v4-w3x2y1z0a9b8
 * Save Location: C:\CFH\backend\controllers\CarController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`CreateCarBody`, `UpdateCarBody`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Validation [Grok]:
 * - Applied `getCarByIdValidation`, `createCarValidation`, `updateCarValidation`.
 *
 * 4. Services (Suggestion) [Mini]:
 * - Move database operations to `CarService.ts`.
 *
 * 5. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 *
 * 6. Metadata [Grok]:
 * - Updated Author and Timestamp to distinguish from Mini’s version.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Car, { ICar } from '@models/Car';
import User from '@models/User';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getCarByIdValidation, createCarValidation, updateCarValidation } from '@validation/car.validation';

/* --- Interfaces --- */
interface CreateCarBody {
  make: string;
  model: string;
  year: number;
  price: number;
  customMake?: string;
  customModel?: string;
}

interface UpdateCarBody {
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  customMake?: string;
  customModel?: string;
  status?: 'Available' | 'Sold' | 'Pending';
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'seller' | 'buyer';
  };
}

/* --- Controller Functions --- */

/**
 * @function getAllCars
 * @desc Retrieves all cars, filtered by seller unless the user is an admin.
 */
export const getAllCars = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'm3n2o1p0-q9r8-s7t6-u5v4-w3x2y1z0a9b8';
  try {
    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch cars');
    }
    if (user.role !== 'admin' && user.role !== 'seller' && user.role !== 'buyer') {
      throw new ForbiddenError('Only admins, sellers, or buyers may fetch cars');
    }

    const query = user.role === 'admin' ? {} : { sellerId: user.id };
    const sellerExists = user.role !== 'admin' ? await User.findById(user.id) : null;
    if (user.role !== 'admin' && !sellerExists) {
      throw new NotFoundError('Seller not found');
    }

    const cars: ICar[] = await Car.find(query).lean();
    res.status(200).json(cars);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cars';
    logger.error(`m3n2o1p0: Error fetching cars for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function getCarById
 * @desc Retrieves a specific car by its unique ID.
 */
export const getCarById = async (req: AuthenticatedRequest<{ carId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'm3n2o1p0-q9r8-s7t6-u5v4-w3x2y1z0a9b8';
  try {
    const { error } = getCarByIdValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch car');
    }
    if (user.role !== 'admin' && user.role !== 'seller' && user.role !== 'buyer') {
      throw new ForbiddenError('Only admins, sellers, or buyers may fetch cars');
    }

    const { carId } = req.params;
    const car: ICar | null = await Car.findById(carId).lean();
    if (!car) {
      throw new NotFoundError('Car not found');
    }

    res.status(200).json(car);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch car';
    logger.error(`m3n2o1p0: Error fetching car by ID ${req.params.carId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function createCar
 * @desc Creates a new car listing for an authenticated seller.
 */
export const createCar = async (req: AuthenticatedRequest<{}, {}, CreateCarBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'm3n2o1p0-q9r8-s7t6-u5v4-w3x2y1z0a9b8';
  try {
    const { error } = createCarValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to create a car listing');
    }
    if (user.role !== 'seller') {
      throw new ForbiddenError('Only sellers may create car listings');
    }

    const { make, model, year, price, customMake, customModel } = req.body;
    const seller = await User.findById(user.id);
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }

    const newCar = new Car({
      make,
      model,
      year,
      price,
      customMake,
      customModel,
      sellerId: user.id,
      needsReview: true,
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create car';
    logger.error(`m3n2o1p0: Error creating car: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function updateCar
 * @desc Updates an existing car, restricted to the owner or an admin.
 */
export const updateCar = async (req: AuthenticatedRequest<{ carId: string }, {}, UpdateCarBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'm3n2o1p0-q9r8-s7t6-u5v4-w3x2y1z0a9b8';
  try {
    const { error } = updateCarValidation.params.validate(req.params);
    const bodyError = updateCarValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to update a car');
    }
    if (user.role !== 'admin' && user.role !== 'seller') {
      throw new ForbiddenError('Only admins or sellers may update cars');
    }

    const { carId } = req.params;
    const car = await Car.findById(carId);
    if (!car) {
      throw new NotFoundError('Car not found');
    }

    if (user.role !== 'admin' && car.sellerId.toString() !== user.id) {
      throw new ForbiddenError('User is not authorized to update this car');
    }

    Object.assign(car, req.body);
    const updatedCar = await car.save();
    res.status(200).json(updatedCar);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update car';
    logger.error(`m3n2o1p0: Error updating car ${req.params.carId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};