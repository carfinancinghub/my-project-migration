/**
 * © 2025 CFH, All Rights Reserved
 * File: PaymentController.ts
 * Path: C:\CFH\backend\controllers\PaymentController.ts
 * Purpose: Handles creating, retrieving, and updating payment records.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [1800]
 * Version: 1.0.1
 * Version ID: x5y4z3a2-b1c0-d9e8-f7g6-h5i4j3k2l1m0
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: x5y4z3a2-b1c0-d9e8-f7g6-h5i4j3k2l1m0
 * Save Location: C:\CFH\backend\controllers\PaymentController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`AuthenticatedRequest`, `CreatePaymentBody`, `UpdatePaymentStatusBody`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Validation [Grok]:
 * - Added `getMyPaymentsValidation`, `getAllPaymentsValidation`.
 *
 * 4. Services (Suggestion) [Mini]:
 * - Move database operations to `PaymentService.ts`.
 *
 * 5. Testing (Suggestion) [Cod1]:
 * - Add unit tests for all endpoints.
 *
 * 6. Metadata [Grok]:
 * - Updated Author and Timestamp to reflect compliance confirmation.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Payment, { IPayment } from '@models/Payment';
import User from '@models/User';
import Auction from '@models/Auction';
import EscrowContract from '@models/EscrowContract';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getMyPaymentsValidation, getAllPaymentsValidation, createPaymentValidation, updatePaymentStatusValidation } from '@validation/payment.validation';

/* --- Interfaces --- */
interface CreatePaymentBody {
  amount: number;
  currency: string;
  source: string;
  relatedId: string;
  relatedModel: string;
}

interface UpdatePaymentStatusBody {
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'user';
  };
}

/* --- Controller Functions --- */

/**
 * @function getMyPayments
 * @desc Retrieves all payments for the currently authenticated user.
 */
export const getMyPayments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'x5y4z3a2-b1c0-d9e8-f7g6-h5i4j3k2l1m0';
  try {
    const { error } = getMyPaymentsValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch payments');
    }
    if (user.role !== 'user' && user.role !== 'admin') {
      throw new ForbiddenError('Only users or admins may fetch payments');
    }

    const userExists = await User.findById(user.id);
    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    const payments: IPayment[] = await Payment.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
    res.status(200).json(payments);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payments';
    logger.error(`x5y4z3a2: Error fetching payments for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function getAllPayments
 * @desc Retrieves all platform payments (admin only).
 */
export const getAllPayments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'x5y4z3a2-b1c0-d9e8-f7g6-h5i4j3k2l1m0';
  try {
    const { error } = getAllPaymentsValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch all payments');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenError('Only admins may fetch all payments');
    }

    const payments: IPayment[] = await Payment.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(payments);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch platform payments';
    logger.error(`x5y4z3a2: Error fetching all platform payments by admin ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function createPayment
 * @desc Creates a new payment record.
 */
export const createPayment = async (req: AuthenticatedRequest<{}, {}, CreatePaymentBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'x5y4z3a2-b1c0-d9e8-f7g6-h5i4j3k2l1m0';
  try {
    const { error } = createPaymentValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to create a payment');
    }
    if (user.role !== 'user' && user.role !== 'admin') {
      throw new ForbiddenError('Only users or admins may create payments');
    }

    const { amount, currency, source, relatedId, relatedModel } = req.body;
    const userExists = await User.findById(user.id);
    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    // Validate relatedId based on relatedModel
    let relatedExists = null;
    if (relatedModel === 'Auction') {
      relatedExists = await Auction.findById(relatedId);
    } else if (relatedModel === 'Contract') {
      relatedExists = await EscrowContract.findById(relatedId);
    } else {
      throw new BadRequestError('Invalid relatedModel specified');
    }
    if (!relatedExists) {
      throw new NotFoundError(`${relatedModel} not found for relatedId`);
    }

    const payment = new Payment({
      amount,
      currency,
      source,
      relatedId,
      relatedModel,
      userId: user.id,
    });

    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create payment';
    logger.error(`x5y4z3a2: Error creating payment for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function updatePaymentStatus
 * @desc Updates the status of a payment (admin only).
 */
export const updatePaymentStatus = async (req: AuthenticatedRequest<{ paymentId: string }, {}, UpdatePaymentStatusBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'x5y4z3a2-b1c0-d9e8-f7g6-h5i4j3k2l1m0';
  try {
    const { error } = updatePaymentStatusValidation.params.validate(req.params);
    const bodyError = updatePaymentStatusValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to update payment status');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenError('Only admins may update payment status');
    }

    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new NotFoundError('Payment record not found');
    }

    const updateData = req.body;
    const updatedPayment = await Payment.findByIdAndUpdate(paymentId, updateData, { new: true });
    res.status(200).json(updatedPayment);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update payment status';
    logger.error(`x5y4z3a2: Error updating payment status for payment ${req.params.paymentId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};