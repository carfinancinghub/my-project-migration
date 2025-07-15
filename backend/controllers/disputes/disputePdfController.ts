/**
 * © 2025 CFH, All Rights Reserved
 * File: disputePdfController.ts
 * Path: C:\CFH\backend\controllers\disputes\disputePdfController.ts
 * Purpose: Generates and returns PDFs for dispute-related documents with metadata and audit tracking in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-14 [19:08]
 * Version: 1.1.0
 * Version ID: a4f2e1c3-d6b7-4e9f-a9c0-f1d2e3b4c5d6
 * Crown Certified: Yes (pending final test)
 * Batch ID: Compliance-071425
 * Artifact ID: a4f2e1c3-d6b7-4e9f-a9c0-f1d2e3b4c5d6
 * Save Location: C:\CFH\backend\controllers\disputes\disputePdfController.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14 [19:08]
 */

import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import logger from '@utils/logger'; // Alias import
import Dispute from '@models/dispute/Dispute'; // Alias import

/**
 * Generates a PDF for a dispute case.
 * @param {Request} req - Express request with caseId in params.
 * @param {Response} res - Express response object for streaming PDF.
 */
export const generateDisputePdf = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers['x-correlation-id'] || 'none';
  try {
    const { caseId } = req.params;
    const dispute = await Dispute.findById(caseId);
    if (!dispute) {
      logger.warn('No dispute found for PDF generation', { correlationId, caseId });
      res.status(404).json({ success: false, message: 'Dispute not found' });
      return;
    }

    res.setHeader('Content-Disposition', 'attachment; filename=dispute_' + caseId + '.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(25).text('Dispute Case Summary', 100, 100);
    doc.fontSize(14).text('ID: ' + dispute._id, 100, 150);
    doc.text('Reason: ' + dispute.reason, 100, 170);
    doc.text('Status: ' + dispute.status, 100, 190);
    // Add more fields as needed

    doc.end();
    logger.info('Dispute PDF generated successfully', { correlationId, caseId });
  } catch (error) {
    logger.error('Failed to generate dispute PDF', { correlationId, error });
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Premium/Wow++ Note: Add watermark for premium ("Official CFH Copy"), QR code for Wow++ (blockchain verification).
