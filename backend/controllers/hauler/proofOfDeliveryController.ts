/**
 * © 2025 CFH, All Rights Reserved
 * File: proofOfDeliveryController.ts
 * Path: C:\CFH\backend\controllers\hauler\proofOfDeliveryController.ts
 * Purpose: Handles submission and retrieval of multi-proof (GeoPin, Photo) delivery data.
 * Author: Mini Team
 * Date: 2025-07-06 [0951]
 * Version: 1.0.0
 * Version ID: q5r4s3t2-u1v0-w9x8-y7z6-a5b4c3d2e1f0
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: q5r4s3t2-u1v0-w9x8-y7z6-a5b4c3d2e1f0
 * Save Location: C:\CFH\backend\controllers\hauler\proofOfDeliveryController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created `SubmitProofOfDeliveryBody` and `AuthenticatedRequest` interfaces.
 * - Imported the `IHaulerJob` interface.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Replaced `express-async-handler` with `try-catch` and `next(error)`.
 * - Used `@utils/logger` with custom error classes.
 *
 * 3. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving job mutation logic to `HaulerJobService.ts`.
 *
 * 4. Testing (Suggestion) [Cod1]:
 * - Add integration tests for `submitProofOfDelivery` and `getProofOfDelivery` (status 200, 404, 500).
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import HaulerJob, { IHaulerJob } from '@models/HaulerJob';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { validateProofOfDelivery, validateJobId } from '@validation/hauler.validation';
import { logAction } from '@utils/escrow/EscrowAuditLogStore';

/* --- Interfaces --- */
interface SubmitProofOfDeliveryBody {
  geoPin?: string;
  notes?: string;
  photoUrls?: string[];
}

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

/* --- Constants --- */
const JOB_STATUS = {
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
};

/* --- Controller Functions --- */

/**
 * @function submitProofOfDelivery
 * @desc Submits GeoPin, notes, and photo URLs as proof of delivery for a job.
 */
export const submitProofOfDelivery = async (
  req: AuthenticatedRequest<{ jobId: string }, {}, SubmitProofOfDeliveryBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { geoPin, notes, photoUrls = [] } = req.body;
    const { error } = validateProofOfDelivery({ jobId, geoPin, photoUrls });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = req.user;
    if (!user || !user.email) {
      throw new BadRequestError('Authentication required to submit proof of delivery');
    }

    const job: IHaulerJob | null = await HaulerJob.findById(jobId);
    if (!job) {
      throw new NotFoundError('Delivery job not found');
    }

    if (job.status !== JOB_STATUS.IN_TRANSIT) {
      throw new BadRequestError('Proof of delivery can only be submitted for In Transit jobs');
    }

    job.geoPin = geoPin || job.geoPin;
    job.notes = notes || job.notes;
    if (photoUrls.length > 0) {
      job.photos = photoUrls;
    }
    job.status = JOB_STATUS.DELIVERED;
    job.deliveredAt = new Date();

    const updatedJob = await job.save();
    logAction(jobId, user.email, 'Submitted proof of delivery');

    res.status(200).json({ message: '📍 Delivery marked complete', job: updatedJob });
  } catch (error: unknown) {
    logger.error(`q5r4s3t2: Proof of delivery submission failed for job ${req.params.jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Failed to submit proof of delivery.'));
  }
};

/**
 * @function getProofOfDelivery
 * @desc Retrieves the proof of delivery details for a specific job.
 */
export const getProofOfDelivery = async (
  req: AuthenticatedRequest<{ jobId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { error } = validateJobId({ jobId });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to retrieve proof of delivery');
    }

    const job = await HaulerJob.findById(jobId).select('geoPin notes photos deliveredAt status');
    if (!job) {
      throw new NotFoundError('Proof of delivery not found for this job');
    }

    res.status(200).json(job);
  } catch (error: unknown) {
    logger.error(`q5r4s3t2: Failed to retrieve proof of delivery for job ${req.params.jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Failed to retrieve proof of delivery.'));
  }
};