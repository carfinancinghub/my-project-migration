/**
 * © 2025 CFH, All Rights Reserved
 * File: InspectionPDFController.ts
 * Path: C:\CFH\backend\controllers\InspectionPDFController.ts
 * Purpose: Generates a PDF summary report for a vehicle inspection.
 * Author: Mini Team
 * Date: 2025-07-07 [0030]
 * Version: 1.0.0
 * Version ID: g7h6i5j4-k3l2-m1n0-o9p8-q7r6s5t4u3v2
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: g7h6i5j4-k3l2-m1n0-o9p8-q7r6s5t4u3v2
 * Save Location: C:\CFH\backend\controllers\InspectionPDFController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Efficiency [Mini]:
 * - Replaced disk I/O with in-memory buffer for PDF generation.
 *
 * 4. Validation [Grok]:
 * - Added Joi validation for `reportId`.
 *
 * 5. Services (Suggestion) [Mini]:
 * - Move PDF generation logic to `PdfService.ts`.
 *
 * 6. Testing (Suggestion) [Grok]:
 * - Add unit tests for `generateInspectionPdf`.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import PDFDocument from 'pdfkit';
import Inspection, { IInspection } from '@models/Inspection';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, InternalServerError } from '@utils/errors';
import { generateInspectionPdfValidation } from '@validation/inspectionPdf.validation';

/* --- Interfaces --- */
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'mechanic' | 'buyer' | 'seller';
  };
}

/* --- Helper Function --- */
const formatDate = (date?: Date): string => {
  return date ? new Date(date).toLocaleDateString() : 'N/A';
};

/* --- Controller Function --- */

/**
 * @function generateInspectionPdf
 * @desc Generates a PDF summary for a given inspection report and sends it for download.
 */
export const generateInspectionPdf = async (req: AuthenticatedRequest<{ reportId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'g7h6i5j4-k3l2-m1n0-o9p8-q7r6s5t4u3v2';
  try {
    const { error } = generateInspectionPdfValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to generate PDF');
    }

    const { reportId } = req.params;
    const report: IInspection | null = await Inspection.findById(reportId)
      .populate('mechanic assignedTo')
      .lean();

    if (!report) {
      throw new NotFoundError('Inspection report not found');
    }

    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=inspection_${reportId}.pdf`);
      res.send(pdfData);
    });

    // --- PDF Content ---
    doc.fontSize(20).text('🔍 Vehicle Inspection Report', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Report ID: ${report._id}`);
    doc.text(`Mechanic: ${report.mechanic?.email || 'N/A'}`);
    doc.text(`Assigned To: ${report.assignedTo?.email || 'N/A'}`);
    doc.text(`Created At: ${formatDate(report.createdAt)}`);
    doc.text(`Completed At: ${formatDate(report.completedAt)}`);
    doc.moveDown(2);

    doc.fontSize(14).text('🔧 Findings:', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(report.findings || 'No findings were provided.');
    doc.moveDown(2);

    if (report.voiceNoteUrl) {
      doc.fontSize(14).text('🎤 Voice Note:', { underline: true });
      doc.moveDown();
      doc.fillColor('blue').text(report.voiceNoteUrl, { link: report.voiceNoteUrl, underline: true });
      doc.fillColor('black').moveDown(2);
    }

    if (report.photoUrls && report.photoUrls.length > 0) {
      doc.fontSize(14).text('📸 Photos:', { underline: true });
      doc.moveDown();
      report.photoUrls.forEach((url) => {
        doc.fillColor('blue').text(url, { link: url, underline: true });
        doc.moveDown(0.5);
      });
      doc.fillColor('black');
    }

    doc.end();

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';
    logger.error(`g7h6i5j4: Error generating inspection PDF for report ${req.params.reportId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};