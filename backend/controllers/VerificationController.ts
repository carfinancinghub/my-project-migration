/**
 * © 2025 CFH, All Rights Reserved
 * File: VerificationController.ts
 * Path: C:\CFH\backend\controllers\VerificationController.ts
 * Purpose: Handles retrieving and updating user verification information.
 * Author: Mini Team, Grok
 * Date: 2025-07-07 [0135]
 * Version: 1.0.0
 * Version ID: p6q5r4s3-t2u1-v0w9-x8y7-z6a5b4c3d2e1
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: p6q5r4s3-t2u1-v0w9-x8y7-z6a5b4c3d2e1
 * Save Location: C:\CFH\backend\controllers\VerificationController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created `AuthenticatedRequest` and `UpdateVerificationBody` interfaces.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Validation [Grok]:
 * - Added `getMyVerificationValidation` for `getMyVerification`.
 *
 * 4. Services (Suggestion) [Mini]:
 * - Move database operations to `VerificationService.ts`.
 *
 * 5. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 *
 * 6. Metadata [Grok]:
 * - Updated Author and Timestamp to distinguish from Mini’s version.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Verification, { IVerification } from '@models/Verification';
import User from '@models/User';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getMyVerificationValidation, updateVerificationValidation } from '@validation/verification.validation';

/* --- Interfaces --- */
interface UpdateVerificationBody {
  status: 'Pending' | 'Verified' | 'Rejected';
  idVerified?: boolean;
  addressVerified?: boolean;
  notes?: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'user';
  };
}

/* --- Controller Functions --- */

/**
 * @function getMyVerification
 * @desc Retrieves the verification record for the currently authenticated user.
 */
export const getMyVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'p6q5r4s3-t2u1-v0w9-x8y7-z6a5b4c3d2e1';
  try {
    const { error } = getMyVerificationValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch verification');
    }
    if (user.role !== 'user' && user.role !== 'admin') {
      throw new ForbiddenError('Only users or admins may fetch verification records');
    }

    const userExists = await User.findById(user.id);
    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    const record: IVerification | null = await Verification.findOne({ userId: user.id }).lean();
    if (!record) {
      throw new NotFoundError('No verification record found for this user');
    }

    res.status(200).json(record);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch verification';
    logger.error(`p6q5r4s3: Error fetching verification data for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function updateVerificationByAdmin
 * @desc Allows an admin to update a user's verification information.
 */
export const updateVerificationByAdmin = async (req: AuthenticatedRequest<{ userId: string }, {}, UpdateVerificationBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'p6q5r4s3-t2u1-v0w9-x8y7-z6a5b4c3d2e1';
  try {
    const { error } = updateVerificationValidation.params.validate(req.params);
    const bodyError = updateVerificationValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to update verification');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenError('Only admins may update verification records');
    }

    const { userId } = req.params;
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    const updateData = req.body;
    const updatedRecord = await Verification.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    );

    res.status(200).json(updatedRecord);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update verification';
    logger.error(`p6q5r4s3: Error updating verification status for user ${req.params.userId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};