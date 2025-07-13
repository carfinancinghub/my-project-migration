/**
 * © 2025 CFH, All Rights Reserved
 * File: TransportController.ts
 * Path: C:\CFH\backend\controllers\TransportController.ts
 * Purpose: Handles creating, retrieving, and updating transport jobs.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [1657]
 * Version: 1.0.0
 * Version ID: t0u9v8w7-x6y5-z4a3-b2c1-d0e9f8g7h6i5
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: t0u9v8w7-x6y5-z4a3-b2c1-d0e9f8g7h6i5
 * Save Location: C:\CFH\backend\controllers\TransportController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`AuthenticatedRequest`, `CreateTransportJobBody`, `UpdateTransportStatusBody`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Validation [Grok]:
 * - Added `getMyTransportJobsValidation`.
 *
 * 4. Services (Suggestion) [Mini]:
 * - Move database operations to `TransportJobService.ts`.
 *
 * 5. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 *
 * 6. Metadata [Grok]:
 * - Updated Author and Timestamp to reflect compliance confirmation.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import TransportJob, { ITransportJob } from '@models/TransportJob';
import Car from '@models/Car';
import User from '@models/User';
import Location from '@models/Location';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getMyTransportJobsValidation, createTransportJobValidation, updateTransportStatusValidation } from '@validation/transport.validation';

/* --- Interfaces --- */
interface CreateTransportJobBody {
  carId: string;
  haulerId: string;
  pickupLocation: string;
  dropoffLocation: string;
}

interface UpdateTransportStatusBody {
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
  notes?: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'hauler';
  };
}

/* --- Controller Functions --- */

/**
 * @function getMyTransportJobs
 * @desc Retrieves all transport jobs assigned to the currently authenticated hauler.
 */
export const getMyTransportJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 't0u9v8w7-x6y5-z4a3-b2c1-d0e9f8g7h6i5';
  try {
    const { error } = getMyTransportJobsValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch transport jobs');
    }
    if (user.role !== 'hauler' && user.role !== 'admin') {
      throw new ForbiddenError('Only haulers or admins may fetch transport jobs');
    }

    const haulerExists = await User.findById(user.id);
    if (!haulerExists) {
      throw new NotFoundError('Hauler not found');
    }

    const jobs: ITransportJob[] = await TransportJob.find({ haulerId: user.id })
      .populate('carId')
      .populate('pickupLocation')
      .populate('dropoffLocation')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(jobs);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transport jobs';
    logger.error(`t0u9v8w7: Error fetching transport jobs for hauler ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function createTransportJob
 * @desc Creates a new transport job (typically by an admin or system process).
 */
export const createTransportJob = async (req: AuthenticatedRequest<{}, {}, CreateTransportJobBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 't0u9v8w7-x6y5-z4a3-b2c1-d0e9f8g7h6i5';
  try {
    const { error } = createTransportJobValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to create a transport job');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenError('Only admins may create transport jobs');
    }

    const { carId, haulerId, pickupLocation, dropoffLocation } = req.body;
    const [car, hauler, pickup, dropoff] = await Promise.all([
      Car.findById(carId),
      User.findById(haulerId),
      Location.findById(pickupLocation),
      Location.findById(dropoffLocation),
    ]);

    if (!car) {
      throw new NotFoundError('Car not found');
    }
    if (!hauler) {
      throw new NotFoundError('Hauler not found');
    }
    if (!pickup) {
      throw new NotFoundError('Pickup location not found');
    }
    if (!dropoff) {
      throw new NotFoundError('Dropoff location not found');
    }

    const job = new TransportJob({
      carId,
      haulerId,
      pickupLocation,
      dropoffLocation,
      status: 'Pending',
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create transport job';
    logger.error(`t0u9v8w7: Error creating transport job: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function updateTransportStatus
 * @desc Updates the status of a transport job (by the assigned hauler or an admin).
 */
export const updateTransportStatus = async (req: AuthenticatedRequest<{ jobId: string }, {}, UpdateTransportStatusBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 't0u9v8w7-x6y5-z4a3-b2c1-d0e9f8g7h6i5';
  try {
    const { error } = updateTransportStatusValidation.params.validate(req.params);
    const bodyError = updateTransportStatusValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to update transport job');
    }
    if (user.role !== 'hauler' && user.role !== 'admin') {
      throw new ForbiddenError('Only haulers or admins may update transport jobs');
    }

    const { jobId } = req.params;
    const job = await TransportJob.findById(jobId);
    if (!job) {
      throw new NotFoundError('Transport job not found');
    }

    if (job.haulerId.toString() !== user.id && user.role !== 'admin') {
      throw new ForbiddenError('User is not authorized to update this transport job');
    }

    Object.assign(job, req.body);
    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update transport job';
    logger.error(`t0u9v8w7: Error updating transport job ${req.params.jobId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};