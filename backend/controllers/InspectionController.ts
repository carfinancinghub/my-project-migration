/**
 * © 2025 CFH, All Rights Reserved
 * File: InspectionController.ts
 * Path: C:\CFH\backend\controllers\InspectionController.ts
 * Purpose: Handles creating, retrieving, and managing inspection jobs and reports.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-08 [1822]
 * Version: 1.0.0
 * Version ID: z7a6b5c4-d3e2-f1g0-h9i8-j7k6l5m4n3o2
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: z7a6b5c4-d3e2-f1g0-h9i8-j7k6l5m4n3o2
 * Save Location: C:\CFH\backend\controllers\InspectionController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Grok]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`AuthenticatedRequest`, `CreateInspectionJobBody`, `SubmitInspectionReportBody`).
 *
 * 2. Error Handling & Logging [Grok]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 * - Fixed syntax error in `createInspectionJob`.
 *
 * 3. Validation [Grok]:
 * - Updated `inspection.validation.ts` with schemas for all endpoints.
 *
 * 4. Authentication & Authorization [Grok]:
 * - Added role-based checks (`mechanic`, `admin`, `user`).
 *
 * 5. Services (Suggestion) [Grok]:
 * - Move database operations to `InspectionService.ts`.
 *
 * 6. Testing (Suggestion) [Grok]:
 * - Add unit tests via `InspectionController.test.ts`.
 *
 * 7. Metadata [Grok]:
 * - Updated Author and Timestamp for compliance.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Inspection, { IInspection } from '@models/Inspection';
import User from '@models/User';
import Car from '@models/Car';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import {
  getInspectionReportByIdValidation,
  getMyInspectionJobsValidation,
  createInspectionJobValidation,
  submitInspectionReportValidation,
  getAllInspectionReportsValidation,
} from '@validation/inspection.validation';

/* --- Interfaces --- */
interface CreateInspectionJobBody {
  vehicle: string;
  scheduledDate: Date;
  assignedTo?: string;
}

interface SubmitInspectionReportBody {
  condition: string;
  notes?: string;
  issuesFound?: string[];
  photoUrls?: string[];
  voiceNotes?: string[];
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'mechanic' | 'user';
  };
}

/* --- Controller Functions --- */

/**
 * @function getInspectionReportById
 * @desc Retrieves a single inspection report by ID.
 */
export const getInspectionReportById = async (req: AuthenticatedRequest<{ reportId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'z7a6b5c4-d3e2-f1g0-h9i8-j7k6l5m4n3o2';
  try {
    const { error } = getInspectionReportByIdValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch inspection report');
    }
    if (user.role !== 'admin' && user.role !== 'mechanic' && user.role !== 'user') {
      throw new ForbiddenError('Only admins, mechanics, or users may fetch inspection reports');
    }

    const { reportId } = req.params;
    const report = await Inspection.findById(reportId).populate('mechanic vehicle buyer').lean();
    if (!report) {
      throw new NotFoundError('Inspection report not found');
    }

    res.status(200).json(report);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch inspection report';
    logger.error(`z7a6b5c4: Error fetching inspection report ${req.params.reportId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function getMyInspectionJobs
 * @desc Retrieves all inspection jobs assigned to the authenticated mechanic.
 */
export const getMyInspectionJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'z7a6b5c4-d3e2-f1g0-h9i8-j7k6l5m4n3o2';
  try {
    const { error } = getMyInspectionJobsValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch inspection jobs');
    }
    if (user.role !== 'mechanic' && user.role !== 'admin') {
      throw new ForbiddenError('Only mechanics or admins may fetch inspection jobs');
    }

    const mechanicExists = await User.findById(user.id);
    if (!mechanicExists) {
      throw new NotFoundError('Mechanic not found');
    }

    const jobs: IInspection[] = await Inspection.find({ mechanic: user.id }).populate('vehicle').lean();
    res.status(200).json(jobs);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch inspection jobs';
    logger.error(`z7a6b5c4: Error fetching inspection jobs for mechanic ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function createInspectionJob
 * @desc Creates a new inspection job.
 */
export const createInspectionJob = async (req: AuthenticatedRequest<{}, {}, CreateInspectionJobBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'z7a6b5c4-d3e2-f1g0-h9i8-j7k6l5m4n3o2';
  try {
    const { error } = createInspectionJobValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to create inspection job');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenError('Only admins may create inspection jobs');
    }

    const { vehicle, scheduledDate, assignedTo } = req.body;
    const [vehicleExists, mechanicExists] = await Promise.all([
      Car.findById(vehicle),
      assignedTo ? User.findById(assignedTo) : Promise.resolve(null),
    ]);

    if (!vehicleExists) {
      throw new NotFoundError('Vehicle not found');
    }
    if (assignedTo && !mechanicExists) {
      throw new NotFoundError('Mechanic not found');
    }

    const newJob = new Inspection({
      vehicle,
      scheduledDate,
      mechanic: assignedTo || user.id,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create inspection job';
    logger.error(`z7a6b5c4: Error creating inspection job: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function submitInspectionReport
 * @desc Submits an inspection report for a job.
 */
export const submitInspectionReport = async (req: AuthenticatedRequest<{ jobId: string }, {}, SubmitInspectionReportBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'z7a6b5c4-d3e2-f1g0-h9i8-j7k6l5m4n3o2';
  try {
    const { error } = submitInspectionReportValidation.params.validate(req.params);
    const bodyError = submitInspectionReportValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to submit inspection report');
    }
    if (user.role !== 'mechanic') {
      throw new ForbiddenError('Only mechanics may submit inspection reports');
    }

    const { jobId } = req.params;
    const job = await Inspection.findById(jobId);
    if (!job) {
      throw new NotFoundError('Inspection job not found');
    }
    if (job.mechanic.toString() !== user.id) {
      throw new ForbiddenError('User is not authorized to submit this report');
    }

    const { condition, notes, issuesFound, photoUrls, voiceNotes } = req.body;
    job.condition = condition;
    job.notes = notes;
    job.issuesFound = issuesFound || [];
    job.photoUrls = photoUrls || [];
    job.voiceNotes = voiceNotes || [];
    job.completedAt = new Date();
    job.status = 'Completed';

    const updatedJob = await job.save();
    res.status(200).json({ message: 'Inspection report submitted successfully', job: updatedJob });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit inspection report';
    logger.error(`z7a6b5c4: Error submitting inspection report for job ${req.params.jobId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function getAllInspectionReports
 * @desc Retrieves all inspection reports (admin only).
 */
export const getAllInspectionReports = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'z7a6b5c4-d3e2-f1g0-h9i8-j7k6l5m4n3o2';
  try {
    const { error } = getAllInspectionReportsValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch all inspection reports');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenError('Only admins may fetch all inspection reports');
    }

    const reports: IInspection[] = await Inspection.find().populate('vehicle mechanic buyer').lean();
    res.status(200).json(reports);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch inspection reports';
    logger.error(`z7a6b5c4: Error fetching all inspection reports by admin ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};