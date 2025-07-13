/**
 * © 2025 CFH, All Rights Reserved
 * File: embedMapSnapshotPDF.ts
 * Path: C:\CFH\backend\controllers\hauler\embedMapSnapshotPDF.ts
 * Purpose: Generates a PDF delivery report with an embedded static map snapshot.
 * Author: Mini Team
 * Date: 2025-07-06 [0904]
 * Version: 1.0.0
 * Version ID: n2o1p0q9-r8s7-t6u5-v4w3-x2y1z0a9b8c7
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: n2o1p0q9-r8s7-t6u5-v4w3-x2y1z0a9b8c7
 * Save Location: C:\CFH\backend\controllers\hauler\embedMapSnapshotPDF.ts
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
 * 3. Asynchronous Operations & Efficiency [Mini]:
 * - Used buffer-based PDF generation to avoid disk I/O.
 *
 * 4. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving map fetching and PDF generation to a `ReportService` or `PdfService` for reusability.
 *
 * 5. Dependency Management (Suggestion) [Mini]:
 * - Install `@types/pdfkit` for TypeScript support: `npm install --save-dev @types/pdfkit`.
 *
 * 6. Caching (Suggestion) [Cod1]:
 * - Consider caching static map snapshots in S3 or Redis for performance.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import Job, { IJob } from '@models/Job';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { validateJobId } from '@validation/job.validation';

// --- Interfaces ---
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// --- Constants ---
const MAP_CONFIG = {
  BASE_URL: process.env.STATIC_MAP_BASE_URL || 'https://staticmap.openstreetmap.de/staticmap.php',
  DEFAULT_LAT: '37.7749',
  DEFAULT_LNG: '-122.4194',
  ZOOM: 13,
  WIDTH: 600,
  HEIGHT: 300,
};

/**
 * @function embedMapSnapshotPDF
 * @desc Generates a PDF delivery report for a job, including a static map image of the delivery location.
 */
const embedMapSnapshotPDF = async (req: AuthenticatedRequest<{ jobId: string }>, res: Response, next: NextFunction): Promise<void> => {
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

    const [lat, lng] = (job.geoPin ?? `${MAP_CONFIG.DEFAULT_LAT},${MAP_CONFIG.DEFAULT_LNG}`).split(',');
    const mapImageUrl = `${MAP_CONFIG.BASE_URL}?center=${lat},${lng}&zoom=${MAP_CONFIG.ZOOM}&size=${MAP_CONFIG.WIDTH}x${MAP_CONFIG.HEIGHT}&markers=${lat},${lng},red-pushpin`;

    const mapImageResponse = await axios.get(mapImageUrl, { responseType: 'arraybuffer' });
    const mapImageBuffer = Buffer.from(mapImageResponse.data);

    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=DeliveryReport_${jobId}.pdf`);
      res.send(pdfBuffer);
    });

    doc.fontSize(20).text('📦 Delivery Report with Map Snapshot', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Job ID: ${job._id}`);
    doc.text(`Hauler: ${job.hauler?.name || 'N/A'}`);
    doc.text(`Car: ${job.car?.make} ${job.car?.model} (${job.car?.year})`);
    doc.text(`GeoPin: ${job.geoPin || 'N/A'}`);
    doc.text(`Timestamp: ${new Date(job.updatedAt).toLocaleString()}`);
    doc.moveDown(2);

    doc.fontSize(14).text('Delivery Map Snapshot:', { underline: true });
    doc.moveDown();
    doc.image(mapImageBuffer, { fit: [MAP_CONFIG.WIDTH, MAP_CONFIG.HEIGHT], align: 'center' });
    doc.moveDown(2);

    doc.text('Signature: _________________________');
    doc.moveDown();
    doc.text('Signed on: _________________________');

    doc.end();
  } catch (error: unknown) {
    logger.error(`n2o1p0q9: Map Snapshot PDF Error for job ${req.params.jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Failed to generate map snapshot PDF.'));
  }
};

export default embedMapSnapshotPDF;