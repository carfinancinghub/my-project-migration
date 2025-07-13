/**
 * © 2025 CFH, All Rights Reserved
 * File: hashAndAnchorPDF.ts
 * Path: C:\CFH\backend\controllers\hauler\hashAndAnchorPDF.ts
 * Purpose: Generates a SHA-256 hash for a job's PDF document and provides a placeholder for blockchain anchoring.
 * Author: Mini Team
 * Date: 2025-07-05 [2252]
 * Version: 1.0.0
 * Version ID: m9n0p1q2-r3s4-4t5u-8v6w-x7y8z9a0b1c2
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: j8k7l6m5-n4o3-p2q1-r0s9-t8u7v6w5x4y3
 * Save Location: C:\CFH\backend\controllers\hauler\hashAndAnchorPDF.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - Imported the `IJob` interface for strong typing.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Replaced `console.error` with the standardized `@utils/logger`.
 * - Implemented the `next(error)` pattern with custom error classes.
 *
 * 3. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving hashing and blockchain anchoring logic to a `DocumentIntegrityService` or `BlockchainService` for reusability and testability.
 *
 * 4. Real Implementation vs. Simulation [Mini]:
 * - The current implementation simulates the PDF buffer. In production, use an actual PDF buffer from a file storage service (e.g., S3) or on-the-fly generation.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import Job, { IJob } from '@models/Job';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError } from '@utils/errors';
import { validateJobId } from '@validation/job.validation';

/**
 * @function generatePDFHashPayload
 * @desc Serializes important job fields into a simulated PDF buffer.
 */
const generatePDFHashPayload = (job: IJob): Buffer => {
  return Buffer.from(
    JSON.stringify({
      jobId: job._id,
      geoPin: job.geoPin,
      updatedAt: job.updatedAt,
      status: job.status,
    })
  );
};

/**
 * @function hashAndAnchorPDF
 * @desc Generates a SHA-256 hash for a simulated PDF document related to a job and persists it for blockchain anchoring.
 */
const hashAndAnchorPDF = async (
  req: Request<{ jobId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { error } = validateJobId({ jobId });
    if (error) {
      throw new InternalServerError(error.details[0].message);
    }

    const job: IJob | null = await Job.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    const buffer = generatePDFHashPayload(job);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    const txHash = `0x${hash.substring(0, 64)}`;
    const anchorLink = `https://etherscan.io/tx/${txHash}`;

    // Persist hash and transaction hash to job record
    job.hashAnchor = hash;
    job.anchorTx = txHash;
    await job.save();

    res.status(200).json({
      message: 'Document hash generated and saved successfully.',
      sha256: hash,
      txHash,
      anchorLink,
    });
  } catch (error: unknown) {
    logger.error(`j8k7l6m5: Hash generation failed for job ${req.params.jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Failed to hash and anchor document.'));
  }
};

export default hashAndAnchorPDF;