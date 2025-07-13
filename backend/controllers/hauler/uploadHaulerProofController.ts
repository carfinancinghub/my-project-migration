/**
 * © 2025 CFH, All Rights Reserved
 * File: uploadHaulerProofController.ts
 * Path: C:\CFH\backend\controllers\hauler\uploadHaulerProofController.ts
 * Purpose: Handles proof-of-delivery file uploads (photos, voice notes) for haulers.
 * Author: Mini Team
 * Date: 2025-07-06 [1003]
 * Version: 1.0.0
 * Version ID: r7s6t5u4-v3w2-x1y0-z9a8-b7c6d5e4f3g2
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: r7s6t5u4-v3w2-x1y0-z9a8-b7c6d5e4f3g2
 * Save Location: C:\CFH\backend\controllers\hauler\uploadHaulerProofController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`UploadHaulerProofBody`, `Proof`, `AuthenticatedRequest`).
 * - Used `Express.Multer.File[]` for file typing.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving file upload and job mutation logic to `HaulerJobService.ts` or `FileUploadService.ts`.
 *
 * 4. Dependency Management (Suggestion) [Mini]:
 * - Install `@types/cloudinary` for TypeScript support: `npm install --save-dev @types/cloudinary`.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import HaulerJob, { IHaulerJob } from '@models/HaulerJob';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { validateHaulerProof } from '@validation/hauler.validation';

/* --- Interfaces --- */
interface UploadHaulerProofBody {
  voiceNote?: string;
}

interface Proof {
  photos: string[];
  voiceNote?: string;
  updatedAt: Date;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
  files?: {
    photos?: Express.Multer.File[];
    voiceNote?: Express.Multer.File[];
  };
}

/* --- Constants --- */
const JOB_STATUS = {
  IN_TRANSIT: 'In Transit',
};

/* --- Controller Function --- */

/**
 * @function uploadHaulerProof
 * @desc Handles the upload of proof of delivery (photos, voice notes) and updates the job document.
 */
export const uploadHaulerProof = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { voiceNote } = req.body as UploadHaulerProofBody;
    const { error } = validateHaulerProof({ jobId, voiceNote });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = req.user;
    if (!user || !user.email) {
      throw new BadRequestError('Authentication required to upload proof');
    }

    const job: IHaulerJob | null = await HaulerJob.findById(jobId);
    if (!job) {
      throw new NotFoundError('Hauler job not found');
    }

    if (job.status !== JOB_STATUS.IN_TRANSIT) {
      throw new BadRequestError('Proof can only be uploaded for In Transit jobs');
    }

    const photoUrls: string[] = [];
    const localFiles: string[] = [];

    // Upload photos to Cloudinary
    if (req.files?.photos) {
      for (const file of req.files.photos) {
        const result = await cloudinary.uploader.upload(file.path, { folder: `hauler_proof/${jobId}` });
        photoUrls.push(result.secure_url);
        localFiles.push(file.path);
      }
    }

    // Upload voice note to Cloudinary if provided as a file
    let voiceNoteUrl: string | undefined = voiceNote;
    if (req.files?.voiceNote?.[0]) {
      const file = req.files.voiceNote[0];
      const result = await cloudinary.uploader.upload(file.path, { folder: `hauler_proof/${jobId}`, resource_type: 'video' });
      voiceNoteUrl = result.secure_url;
      localFiles.push(file.path);
    }

    // Update job with proof
    const existingPhotos = job.proof?.photos || [];
    job.proof = {
      photos: [...existingPhotos, ...photoUrls],
      voiceNote: voiceNoteUrl || job.proof?.voiceNote,
      updatedAt: new Date(),
    };

    const updatedJob = await job.save();

    // Clean up local files
    for (const filePath of localFiles) {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        logger.error(`r7s6t5u4: Failed to clean up local file ${filePath}: ${cleanupError instanceof Error ? cleanupError.message : 'Unknown error'}`);
      }
    }

    res.status(200).json({ message: 'Proof uploaded successfully', proof: updatedJob.proof });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error during proof upload';
    logger.error(`r7s6t5u4: Proof upload error for job ${req.params.jobId}: ${errorMessage}`);
    next(new InternalServerError(errorMessage));
  }
};