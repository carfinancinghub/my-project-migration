/**
 * © 2025 CFH, All Rights Reserved
 * File: pdfGenerator.ts
 * Path: C:\CFH\backend\controllers\pdfGenerator.ts
 * Purpose: Handles the dynamic generation of PDF documents, such as loan agreements.
 * Author: Mini Team
 * Date: 2025-07-05 [1855]
 * Version: 1.0.0
 * VersionID: d6f5e4c3-a2b1-4d8c-9f0a-7b6e3d2c1a8f
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: f8e7d6c5-b4a3-2d1c-0b9a-8f7e6d5c4b3a
 * Save Location: C:\CFH\backend\controllers\pdfGenerator.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added an `interface` for `LoanAgreementData` to ensure the input data structure is strictly typed.
 * - Added Express `Response` and `NextFunction` types for type safety in the function signature.
 *
 * 2. Error Handling & Logging:
 * - Replaced `console.error` with the standardized `@utils/logger` for consistent, structured logging.
 * - Implemented the `next(error)` pattern to pass errors to a centralized error-handling middleware.
 * - Added stream error handling to catch potential write errors.
 *
 * 3. Dependency Management (Suggestion):
 * - To use `pdfkit` with TypeScript, install the type definitions package: `npm install --save-dev @types/pdfkit`.
 */

// --- Dependencies ---
import { Response, NextFunction } from 'express';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import logger from '@utils/logger';

// --- Interfaces ---
interface LoanAgreementData {
  buyerName: string;
  lenderName: string;
  vehicleDetails: string;
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  termMonths: number;
  auctionId: string;
}

/**
 * @function generateLoanAgreementPDF
 * @desc Generates a loan agreement PDF from provided data and sends it as a downloadable response.
 * @param {LoanAgreementData} data - The data to populate the PDF.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const generateLoanAgreementPDF = (data: LoanAgreementData, res: Response, next: NextFunction): void => {
  try {
    const {
      buyerName,
      lenderName,
      vehicleDetails,
      loanAmount,
      downPayment,
      interestRate,
      termMonths,
      auctionId,
    } = data;

    const doc = new PDFDocument({ margin: 50 });
    const tmpDir = path.join(__dirname, '../../tmp');
    // Ensure tmp directory exists
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const tempFilePath = path.join(tmpDir, `contract-${auctionId}.pdf`);
    const stream = fs.createWriteStream(tempFilePath);

    doc.pipe(stream);

    // --- PDF Content ---
    doc.fontSize(20).text('Car Financing Loan Agreement', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`This agreement is made on ${new Date().toLocaleDateString()}.`);
    doc.moveDown();
    doc.text(`Buyer: ${buyerName}`);
    doc.text(`Lender: ${lenderName}`);
    doc.moveDown();
    doc.text(`Vehicle: ${vehicleDetails}`);
    doc.text(`Loan Amount: $${loanAmount.toLocaleString()}`);
    doc.text(`Down Payment: $${downPayment.toLocaleString()}`);
    doc.text(`Interest Rate: ${interestRate}% APR`);
    doc.text(`Term: ${termMonths} months`);
    doc.moveDown(3);

    // Placeholders for e-signature platforms
    doc.text('_________________________', { continued: true }).text('        ', { continued: true }).text('_________________________');
    doc.text('Buyer Signature                                        Lender Signature');

    doc.end();

    stream.on('finish', () => {
      res.download(tempFilePath, `Loan-Agreement-${auctionId}.pdf`, (err) => {
        if (err) {
          logger.error(`f8e7d6c5: Error sending file for download: ${err.message}`);
          next(err);
        }
        // Clean up the temporary file after download is complete
        fs.unlink(tempFilePath, (unlinkErr) => {
          if (unlinkErr) {
            logger.error(`f8e7d6c5: Failed to unlink temporary PDF file: ${tempFilePath}`, unlinkErr);
          }
        });
      });
    });

    stream.on('error', (err) => {
      logger.error(`f8e7d6c5: PDF stream error: ${err.message}`);
      next(err);
    });

  } catch (error) {
    logger.error(`f8e7d6c5: PDF generation process error: ${error.message}`);
    next(error);
  }
};