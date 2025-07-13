/**
 * © 2025 CFH, All Rights Reserved
 * File: evidenceController.ts
 * Path: C:\CFH\backend\controllers\disputes\evidenceController.ts
 * Purpose: Handles file uploads for dispute evidence.
 * Author: Mini Team
 * Date: 2025-07-05 [2229]
 * Version: 1.0.0
 * Version ID: i6j7k8l9-m0n1-4p2q-8r3s-u4v5w6x7y8z9
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: g5h4i3j2-k1l0-m9n8-o7p6-q5r4s3t2u1v0
 * Save Location: C:\CFH\backend\controllers\disputes\evidenceController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - Imported the `IDispute` interface from the model for strong typing of the dispute document.
 * - Leveraged Multer's `Express.Multer.File` type for the uploaded file object.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Replaced `console.error` with the standardized `@utils/logger`.
 * - Implemented the `next(error)` pattern to pass all errors to a centralized error-handling middleware.
 * - The `fileFilter` in Multer correctly passes an `Error` object for unsupported file types.
 *
 * 3. Asynchronous Operations [Mini]:
 * - Used `fs/promises` for all file system operations to avoid blocking the event loop.
 *
 * 4. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving the logic for saving evidence metadata to a dedicated `DisputeService` or `EvidenceService` for modularity.
 *
 * 5. Configuration & Constants (Suggestion) [Mini]:
 * - Consider extracting Multer configuration (file size limits, allowed MIME types) to a central configuration file (e.g., `@config/upload.ts`).
 *
 * 6. Dependency Management (Suggestion) [Mini]:
 * - To use `multer` with TypeScript, install the type definitions package: `npm install --save-dev @types/multer`.
 *
 * 7. Cloud Storage (Suggestion) [Cod1]:
 * - Consider offloading file storage to S3/Blob and storing metadata only in MongoDB.
 *
 * 8. Delete Endpoint (Suggestion) [Cod1]:
 * - Consider adding a delete endpoint to remove uploaded evidence from the dispute record and disk.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import Dispute, { IDispute } from '@models/dispute/Dispute';
import { triggerDisputeNotification } from '@utils/notificationTrigger';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { validateDisputeId } from '@validation/dispute.validation';

// --- Constants ---
const UPLOAD_LIMIT_MB = 25;
const ALLOWED_MIME_TYPES = ['image/', 'video/', 'audio/', 'application/pdf'];
const DISPUTE_STATUS = {
  OPEN: 'Open',
};

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = path.join(__dirname, `../../Uploads/evidence/${req.params.disputeId}`);
    try {
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (error: unknown) {
      cb(error as Error, dir);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: UPLOAD_LIMIT_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isValid = ALLOWED_MIME_TYPES.some(type => file.mimetype.startsWith(type));
    isValid ? cb(null, true) : cb(new BadRequestError('Unsupported file type'));
  },
});

// --- Middleware ---
export const uploadEvidenceMiddleware = upload.single('evidence');

// --- Controller ---
export const saveEvidenceToDispute = async (
  req: Request<{ disputeId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { disputeId } = req.params;
    const { error } = validateDisputeId({ disputeId });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (!req.file) {
      throw new BadRequestError('No evidence file was uploaded.');
    }

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    if (dispute.status !== DISPUTE_STATUS.OPEN) {
      throw new BadRequestError('Evidence can only be uploaded for open disputes');
    }

    dispute.evidence = dispute.evidence ?? [];
    dispute.evidence.push({
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
    });

    dispute.timeline.push({
      event: 'Evidence Uploaded',
      value: req.file.filename,
      timestamp: new Date(),
    });

    await dispute.save();

    await triggerDisputeNotification({
      type: 'Evidence Uploaded',
      disputeId,
      recipientId: [
        String(dispute.createdBy),
        String(dispute.againstUserId),
      ],
      message: `📤 New evidence uploaded for dispute ${disputeId}`,
      suppressDuplicates: true,
    });

    res.status(200).json({ message: 'Evidence uploaded successfully', file: req.file });
  } catch (error: unknown) {
    logger.error(`g5h4i3j2: Error saving evidence for dispute ${req.params.disputeId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Failed to save evidence'));
  }
};