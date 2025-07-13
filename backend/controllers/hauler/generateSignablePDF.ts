/**
 * © 2025 CFH, All Rights Reserved
 * File: generateSignablePDF.ts
 * Path: C:\CFH\backend\controllers\hauler\generateSignablePDF.ts
 * Purpose: Generates a delivery agreement PDF with signature-ready fields.
 * Author: Mini Team
 * Date: 2025-07-06 [0945]
 * Version: 1.0.0
 * Version ID: p4q3r2s1-t0u9-v8w7-x6y5-z4a3b2c1d0e9
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: p4q3r2s1-t0u9-v8w7-x6y5-z4a3b2c1d0e9
 * Save Location: C:\CFH\backend\controllers\hauler\generateSignablePDF.ts
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
 * - Replaced `console.error` with `@utils/logger`.
 * - Implemented `next(error)` with custom error classes.
 *
 * 3. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving PDF generation to a `DeliveryPdfService` to consolidate with `exportDeliveryPDF.ts` and `embedMapSnapshotPDF.ts`.
 *
 * 4. Storage (Suggestion) [Cod1]:
 * - Consider auto-saving generated PDFs to S3 or local disk for audit reference.
 *
 * 5. Code Duplication (Suggestion) [Mini]:
 * - Address duplication with `exportDeliveryPDF.ts` and `embedMapSnapshotPDF.ts` via `DeliveryPdfService`.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import PDFDocument from 'pdfkit';
import Job, { IJob } from '@models/Job';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { validateJobId } from '@validation/job.validation';

/* --- Interfaces --- */
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/* --- Controller Functions --- */

/**
 * @function generateSignablePDF
 * @desc Generates a signable delivery agreement PDF for a job and sends it for download.
 */
const generateSignablePDF = async (req: AuthenticatedRequest<{ jobId: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { error } = validateJobId({ jobId });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = req.user?.id;
    if (!user) {
      throw new BadRequestError('Authentication required to generate PDF');
    }

    const job: IJob | null = await Job.findById(jobId).populate('hauler car');
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=SignableReport_${jobId}.pdf`);
      res.send(pdfBuffer);
    });

    /* --- PDF Content --- */
    doc.fontSize(20).text('📦 Delivery Agreement Report', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Job ID: ${job._id}`);
    doc.text(`Hauler: ${job.hauler?.name || 'N/A'}`);
    doc.text(`Car: ${job.car?.make} ${job.car?.model} (${job.car?.year})`);
    doc.text(`Delivery Status: ${job.status}`);
    doc.text(`GeoPin: ${job.geoPin || 'N/A'}`);
    doc.text(`Timestamp: ${new Date(job.updatedAt).toLocaleString()}`);
    doc.moveDown(3);

    doc.fontSize(14).text('Signatures Required:', { underline: true });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text('Hauler Signature: _________________________');
    doc.moveDown(0.5);
    doc.text('Date: _________________________');
    doc.moveDown(2);

    doc.text('Buyer Signature: _________________________');
    doc.moveDown(0.5);
    doc.text('Date: _________________________');
    doc.moveDown(2);

    doc.text('Escrow Officer Signature: _________________________');
    doc.moveDown(0.5);
    doc.text('Date: _________________________');

    doc.end();
  } catch (error: unknown) {
    logger.error(`p4q3r2s1: Signable PDF Error for job ${req.params.jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Failed to generate signable delivery report.'));
  }
};

export default generateSignablePDF;