/**
 * © 2025 CFH, All Rights Reserved
 * File: exportController.ts
 * Path: C:\CFH\backend\controllers\lender\exportController.ts
 * Purpose: Exports lender-related data in CSV or PDF format (bids, approved loans, reputations).
 * Author: Cod1 + Mini
 * Date: 2025-07-06 [1104]
 * Version: 1.1.0
 * Version ID: u1v2w3x4-y5z6-a7b8-c9d0-e1f2g3h4i5j6
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: u1v2w3x4-y5z6-a7b8-c9d0-e1f2g3h4i5j6
 * Save Location: C:\CFH\backend\controllers\lender\exportController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Cod1]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Used typed query parameters.
 *
 * 2. Error Handling & Logging [Cod1]:
 * - Used `@utils/logger` and `next(error)` with `InternalServerError`.
 *
 * 3. Performance [Cod1]:
 * - Used `.lean()` for MongoDB queries.
 *
 * 4. Services (Suggestion) [Cod1]:
 * - Consider moving CSV/PDF generation to `ExportService.ts`.
 *
 * 5. Testing (Suggestion) [Cod1]:
 * - Add tests for PDF buffer and CSV generation.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import Loan, { ILoan } from '@models/loan/Loan';
import Bid, { IBid } from '@models/Bid';
import LenderReputation, { ILenderReputation } from '@models/lender/LenderReputation';
import logger from '@utils/logger';
import { InternalServerError, BadRequestError } from '@utils/errors';
import { validateExportData } from '@validation/lender.validation';

/* --- Interfaces --- */
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

interface ExportQuery {
  format?: 'csv' | 'pdf';
  from?: string;
  to?: string;
}

/* --- Helpers --- */

/**
 * Helper to generate a CSV string from data
 */
const generateCSV = (data: (ILoan | IBid | ILenderReputation)[], fields: string[]): string => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};

/**
 * Helper to generate a PDF buffer
 */
const generatePDF = (title: string, data: (ILoan | IBid | ILenderReputation)[]): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    doc.fontSize(18).text(title, { underline: true });
    doc.moveDown();

    data.forEach((item, i) => {
      doc.fontSize(12).text(`${i + 1}. ${JSON.stringify(item)}`);
      doc.moveDown();
    });

    doc.end();
  });
};

/* --- Controller Function --- */

/**
 * @function exportData
 * @desc Exports lender-related data (loan-bids, approved-loans, reputation) as CSV or PDF
 * @route GET /api/lender/export/:type
 * @query format=csv|pdf, from=YYYY-MM-DD, to=YYYY-MM-DD
 */
export const exportData = async (
  req: AuthenticatedRequest<{ type: string }, {}, {}, ExportQuery>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.params;
    const { format = 'csv', from, to } = req.query;
    const { error } = validateExportData({ type, format, from, to });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to export data');
    }

    const query: Record<string, any> = {};
    if (from && to) {
      query.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    }

    let data: (ILoan | IBid | ILenderReputation)[] = [];
    let fields: string[] = [];

    switch (type) {
      case 'loan-bids':
        data = await Bid.find(query).populate('lender', 'email').lean();
        fields = ['_id', 'amount', 'status', 'lender.email'];
        break;
      case 'approved-loans':
        data = await Loan.find({ ...query, status: 'approved' }).lean();
        fields = ['_id', 'amount', 'borrower', 'status'];
        break;
      case 'reputation':
        data = await LenderReputation.find(query).populate('lender', 'email').lean();
        fields = ['lender.email', 'rating', 'reviews.length', 'disputes.length'];
        break;
      default:
        throw new BadRequestError('Invalid export type');
    }

    if (format === 'pdf') {
      const buffer = await generatePDF(`${type} Export`, data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${type}.pdf"`);
      res.end(buffer);
    } else {
      const csv = generateCSV(data, fields);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}.csv"`);
      res.send(csv);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
    logger.error(`u1v2w3x4: Export error for type ${req.params.type}: ${errorMessage}`);
    next(new InternalServerError(errorMessage));
  }
};