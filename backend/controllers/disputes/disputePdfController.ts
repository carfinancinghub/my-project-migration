/**
 * © 2025 CFH, All Rights Reserved
 * File: disputePdfController.ts
 * Path: C:\CFH\backend\controllers\disputes\disputePdfController.ts
 * Purpose: Generates a PDF summary report for a specific dispute.
 * Author: Mini Team
 * Date: 2025-07-05 [2225]
 * Version: 1.0.0
 * Version ID: h5i6j7k8-l9m0-4n1p-8q2r-t3u4v5w6x7y8
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: e4f3d2b1-a0f9-8d7c-6b5a-4f3e2d1c0b9a
 * Save Location: C:\CFH\backend\controllers\disputes\disputePdfController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - Imported the `IDispute` interface from the model for strong typing of the dispute document.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Replaced `console.error` with the standardized `@utils/logger`.
 * - Implemented the `next(error)` pattern to pass all errors to a centralized error-handling middleware.
 * - Added error handling for the PDF stream.
 *
 * 3. Asynchronous Operations & Cleanup [Mini]:
 * - Used `fs/promises` for all file system operations to prevent blocking the event loop.
 *
 * 4. Dependency Management (Suggestion) [Mini]:
 * - To use `pdfkit` with TypeScript, install the type definitions package: `npm install --save-dev @types/pdfkit`.
 *
 * 5. PDF Service (Suggestion) [Cod1]:
 * - Consider extracting PDF layout rendering logic into a reusable `pdfBuilder.ts` service for modularity.
 *
 * 6. Cleanup Scheduler (Suggestion) [Cod1]:
 * - Consider adding an automatic cleanup scheduler for stale files in the `tmp` folder.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import PDFDocument from 'pdfkit';
import fs from 'fs/promises';
import { createWriteStream } from 'fs/promises';
import path from 'path';
import Dispute, { IDispute } from '@models/dispute/Dispute';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError } from '@utils/errors';
import { validateDisputeId } from '@validation/dispute.validation';

// --- Constants ---
const PDF_TEMP_DIR = path.join(__dirname, '../../tmp');

/**
 * @function generateDisputePDF
 * @desc Generates a PDF summary for a given dispute and sends it as a downloadable file.
 */
export const generateDisputePDF = async (
  req: Request<{ disputeId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { disputeId } = req.params;
  const tempPath = path.join(PDF_TEMP_DIR, `dispute-${disputeId}.pdf`);

  try {
    const { error } = validateDisputeId({ disputeId });
    if (error) {
      throw new InternalServerError(error.details[0].message);
    }

    const dispute: IDispute | null = await Dispute.findById(disputeId).populate('createdBy againstUserId');
    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    // Ensure tmp directory exists
    await fs.mkdir(PDF_TEMP_DIR, { recursive: true });

    const doc = new PDFDocument({ margin: 50 });
    const stream = createWriteStream(tempPath);
    doc.pipe(stream);

    // --- PDF Content ---
    doc.fontSize(20).text('Dispute Summary Report', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Dispute ID: ${dispute._id}`);
    doc.text(`Status: ${dispute.status}`);
    doc.text(`Resolution: ${dispute.resolution || 'Pending'}`);
    doc.moveDown();
    doc.text(`Created By: ${('username' in dispute.createdBy && dispute.createdBy.username) || dispute.createdBy.email}`);
    doc.text(`Against: ${('username' in dispute.againstUserId && dispute.againstUserId.username) || dispute.againstUserId.email}`);
    doc.text(`Reason: ${dispute.reason || 'No reason provided.'}`);
    doc.moveDown(2);

    doc.fontSize(14).text('Timeline:', { underline: true });
    doc.moveDown();
    dispute.timeline.forEach(entry => {
      doc.fontSize(11).text(`- [${new Date(entry.timestamp).toLocaleString()}] ${entry.event} → ${entry.value || ''}`);
    });

    doc.end();

    stream.on('finish', () => {
      res.download(tempPath, `Dispute-${disputeId}.pdf`, async (downloadErr) => {
        if (downloadErr) {
          logger.error(`e4f3d2b1: Error sending dispute PDF for download: ${downloadErr.message}`);
          next(downloadErr);
        }
        try {
          await fs.unlink(tempPath);
        } catch (cleanupErr) {
          logger.error(`e4f3d2b1: Failed to unlink temporary dispute PDF: ${tempPath}: ${cleanupErr.message}`);
        }
      });
    });

    stream.on('error', (err) => {
      logger.error(`e4f3d2b1: Dispute PDF stream error: ${err.message}`);
      next(err);
    });

  } catch (error: unknown) {
    logger.error(`e4f3d2b1: Dispute PDF generation error for dispute ${disputeId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Failed to generate PDF'));
  }
};