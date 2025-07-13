/**
 * © 2025 CFH, All Rights Reserved
 * File: exportDeliveryPDF.ts
 * Path: C:\CFH\backend\controllers\hauler\exportDeliveryPDF.ts
 * Purpose: Generates a comprehensive PDF delivery report for haulers, admins, and arbitrators.
 * Author: Mini Team
 * Date: 2025-07-06 [0928]
 * Version: 1.0.0
 * Version ID: o3p2q1r0-s9t8-u7v6-w5x4-y3z2a1b0c9d8
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: o3p2q1r0-s9t8-u7v6-w5x4-y3z2a1b0c9d8
 * Save Location: C:\CFH\backend\controllers\hauler\exportDeliveryPDF.ts
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
 * - Consider moving PDF generation logic to a `ReportService` or `PdfService` to reduce duplication with `embedMapSnapshotPDF.ts`.
 *
 * 4. QR Code/Barcode (Suggestion) [Cod1]:
 * - Consider adding a QR code or barcode of the `jobId` for field scanning.
 *
 * 5. Code Duplication (Suggestion) [Mini]:
 * - Consolidate shared PDF generation logic with `embedMapSnapshotPDF.ts` into a `PdfService`.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import PDFDocument from 'pdfkit';
import Job, { IJob } from '@models/Job';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { validateJobId } from '@validation/job.validation';

// --- Interfaces ---
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/**
 * @function exportDeliveryPDF
 * @desc Generates a comprehensive PDF delivery report for a job and sends it for download.
 */
const exportDeliveryPDF = async (req: AuthenticatedRequest<{ jobId: string }>, res: Response, next: NextFunction): Promise<void> => {
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
      res.setHeader('Content-Disposition', `attachment; filename=DeliveryReport_${jobId}.pdf`);
      res.send(pdfBuffer);
    });

    doc.fontSize(20).text('📦 Delivery Report', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Job ID: ${job._id}`);
    doc.text(`Hauler: ${job.hauler?.name || 'N/A'}`);
    doc.text(`Car: ${job.car?.make} ${job.car?.model} (${job.car?.year})`);
    doc.text(`Status: ${job.status}`);
    doc.text(`GeoPin: ${job.geoPin || 'Not available'}`);
    doc.text(`Updated At: ${new Date(job.updatedAt).toLocaleString()}`);
    doc.moveDown(2);

    doc.fontSize(14).text('Geo Verification Map:', { underline: true });
    doc.text('View map inside dashboard or generate snapshot on frontend.');
    doc.moveDown(2);

    if (Array.isArray(job.photos) && job.photos.length > 0) {
      doc.fontSize(14).text('Uploaded Photos:', { underline: true });
      job.photos.forEach((photoUrl, index) => {
        doc.fillColor('blue').text(`Proof ${index + 1}: ${photoUrl}`, {
          link: photoUrl,
          underline: true,
        });
      });
      doc.fillColor('black').moveDown(2);
    } else {
      doc.text('No photos uploaded.');
      doc.moveDown(2);
    }

    if (job.voiceNoteUrl) {
      doc.fontSize(14).text('Voice Note:', { underline: true });
      doc.fillColor('blue').text(`Listen: ${job.voiceNoteUrl}`, {
        link: job.voiceNoteUrl,
        underline: true,
      });
      doc.fillColor('black').moveDown(2);
    }

    doc.text('Signature: _______________________________', { align: 'left' });
    doc.moveDown();
    doc.text(`Signed on: __________________________`, { align: 'left' });

    doc.end();
  } catch (error: unknown) {
    logger.error(`o3p2q1r0: PDF Export Error for job ${req.params.jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Failed to generate PDF.'));
  }
};

export default exportDeliveryPDF;