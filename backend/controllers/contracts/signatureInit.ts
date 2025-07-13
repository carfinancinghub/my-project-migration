/**
 * © 2025 CFH, All Rights Reserved
 * File: signatureInit.ts
 * Path: C:\CFH\backend\controllers\signatureInit.ts
 * Purpose: Prepares metadata for e-signature platforms like DocuSign.
 * Author: Mini Team
 * Date: 2025-07-05 [1901]
 * Version: 1.0.0
 * VersionID: e7f6d5c4-b3a2-4c1d-8e0b-a9f8e7d6c5b3
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: a9b8c7d6-e5f4-3d2c-1b0a-9f8e7d6c5b4a
 * Save Location: C:\CFH\backend\controllers\signatureInit.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - Created interfaces (`Signer`, `ESignatureRequestBody`, `ESignatureMetadata`) to define the structure of the request body and the response metadata, ensuring data integrity.
 *
 * 2. Error Handling & Logging:
 * - Replaced `console.error` with the standardized `@utils/logger` for consistent, structured logging.
 * - Implemented the `next(error)` pattern to pass errors to a centralized error-handling middleware.
 *
 * 3. Configuration & Constants (Suggestion):
 * - The anchor strings ('Buyer Signature', 'Lender Signature') and offsets could be defined as constants if they are reused or need to be configured, making the code easier to maintain.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import logger from '@utils/logger';
import { InternalServerError } from '@utils/errors';
import { validateESignatureRequest } from '@/validation/auth.validation';

// --- Interfaces ---
interface Signer {
  role: 'Buyer' | 'Lender';
  name: string;
  email: string;
}

interface ESignatureRequestBody {
  auctionId: string;
  buyer: Signer;
  lender: Signer;
}

interface ESignatureMetadata {
  auctionId: string;
  signers: {
    role: string;
    name: string;
    email: string;
    anchor: string;
    anchorYOffset: string;
  }[];
  fileName: string;
}

/**
 * @function prepareESignatureMetadata
 * @desc Prepares a metadata object for an e-signature service based on auction details.
 * @param {Request<{}, {}, ESignatureRequestBody>} req - The Express request object containing auction and signer data.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const prepareESignatureMetadata = async (req: Request<{}, {}, ESignatureRequestBody>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error } = validateESignatureRequest(req.body);
    if (error) {
      throw new InternalServerError(error.details[0].message);
    }

    const { auctionId, buyer, lender } = req.body;

    const metadata: ESignatureMetadata = {
      auctionId,
      signers: [
        {
          role: 'Buyer',
          name: buyer.name,
          email: buyer.email,
          anchor: 'Buyer Signature',
          anchorYOffset: '10',
        },
        {
          role: 'Lender',
          name: lender.name,
          email: lender.email,
          anchor: 'Lender Signature',
          anchorYOffset: '10',
        },
      ],
      fileName: `Loan-Agreement-${auctionId}.pdf`,
    };

    res.status(200).json({ success: true, metadata });
  } catch (error: any) {
    logger.error(`a9b8c7d6: eSignature metadata preparation error: ${error.message}`);
    next(new InternalServerError('Failed to prepare e-signature metadata'));
  }
};