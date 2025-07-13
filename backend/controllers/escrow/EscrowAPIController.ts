/**
 * © 2025 CFH, All Rights Reserved
 * File: EscrowAPIController.ts
 * Path: C:\CFH\backend\controllers\escrow\EscrowAPIController.ts
 * Purpose: Controller logic for escrow deposit, release, refund, and checklist updates.
 * Author: Mini Team
 * Date: 2025-07-05 [2245]
 * Version: 1.0.0
 * Version ID: k8l9m0n1-o2p3-4q5r-8t6u-v7w8x9y0z1a2
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: i7j6k5l4-m3n2-o1p0-q9r8-s7t6u5v4w3x2
 * Save Location: C:\CFH\backend\controllers\escrow\EscrowAPIController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - Created interfaces (`AuthenticatedRequest`, `ICondition`, `UpdateConditionsBody`).
 * - Imported the `IEscrowTransaction` interface for strong typing.
 *
 * 2. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving business logic for updating transaction statuses and conditions to a dedicated `EscrowService` for modularity.
 *
 * 3. Error Handling & Logging [Mini]:
 * - Used the `next(error)` pattern with custom error classes (`NotFoundError`, `InternalServerError`, `BadRequestError`).
 *
 * 4. Authentication & Authorization [Mini]:
 * - Included checks for `req.user.email` to ensure authentication.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import Escrow, { IEscrowTransaction } from '@models/escrow/EscrowTransactionModel';
import { logAction } from '@utils/escrow/EscrowAuditLogStore';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { validateTransactionId, validateConditions } from '@validation/escrow.validation';

// --- Interfaces ---
interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
  };
}

interface ICondition {
  label: string;
  completed: boolean;
}

interface UpdateConditionsBody {
  conditions: ICondition[];
}

// --- Constants ---
const ESCROW_STATUS = {
  PENDING: 'Pending',
  DEPOSITED: 'Deposited',
  RELEASED: 'Released',
  REFUNDED: 'Refunded',
};

// --- Controller Functions ---

/**
 * @function deposit
 * @desc Updates an escrow transaction status to 'Deposited'.
 */
export const deposit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { transactionId } = req.params;
    const { error } = validateTransactionId({ transactionId });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const userEmail = req.user?.email;
    if (!userEmail) {
      throw new BadRequestError('User email not found in token.');
    }

    const tx = await Escrow.findById(transactionId);
    if (!tx) {
      throw new NotFoundError('Escrow transaction not found.');
    }

    if (tx.status !== ESCROW_STATUS.PENDING) {
      throw new BadRequestError('Transaction must be in Pending state to deposit.');
    }

    const updated = {
      status: ESCROW_STATUS.DEPOSITED,
      depositDate: new Date(),
    };

    const updatedTx = await Escrow.findByIdAndUpdate(transactionId, updated, { new: true });
    if (!updatedTx) {
      throw new NotFoundError('Escrow transaction not found.');
    }

    logAction(transactionId, userEmail, 'Deposited funds');
    res.status(200).json(updatedTx);
  } catch (error: unknown) {
    logger.error(`i7j6k5l4: Deposit failed for transaction ${req.params.transactionId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * @function release
 * @desc Updates an escrow transaction status to 'Released'.
 */
export const release = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { transactionId } = req.params;
    const { error } = validateTransactionId({ transactionId });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const userEmail = req.user?.email;
    if (!userEmail) {
      throw new BadRequestError('User email not found in token.');
    }

    const tx = await Escrow.findById(transactionId);
    if (!tx) {
      throw new NotFoundError('Escrow transaction not found.');
    }

    if (tx.status !== ESCROW_STATUS.DEPOSITED) {
      throw new BadRequestError('Transaction must be in Deposited state to release.');
    }

    const updated = { status: ESCROW_STATUS.RELEASED };

    const updatedTx = await Escrow.findByIdAndUpdate(transactionId, updated, { new: true });
    if (!updatedTx) {
      throw new NotFoundError('Escrow transaction not found.');
    }

    logAction(transactionId, userEmail, 'Released funds');
    res.status(200).json(updatedTx);
  } catch (error: unknown) {
    logger.error(`i7j6k5l4: Release failed for transaction ${req.params.transactionId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * @function refund
 * @desc Updates an escrow transaction status to 'Refunded'.
 */
export const refund = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { transactionId } = req.params;
    const { error } = validateTransactionId({ transactionId });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const userEmail = req.user?.email;
    if (!userEmail) {
      throw new BadRequestError('User email not found in token.');
    }

    const tx = await Escrow.findById(transactionId);
    if (!tx) {
      throw new NotFoundError('Escrow transaction not found.');
    }

    if (tx.status !== ESCROW_STATUS.DEPOSITED) {
      throw new BadRequestError('Transaction must be in Deposited state to refund.');
    }

    const updated = { status: ESCROW_STATUS.REFUNDED };

    const updatedTx = await Escrow.findByIdAndUpdate(transactionId, updated, { new: true });
    if (!updatedTx) {
      throw new NotFoundError('Escrow transaction not found.');
    }

    logAction(transactionId, userEmail, 'Issued refund');
    res.status(200).json(updatedTx);
  } catch (error: unknown) {
    logger.error(`i7j6k5l4: Refund failed for transaction ${req.params.transactionId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};

/**
 * @function updateConditions
 * @desc Updates the conditions checklist for an escrow transaction.
 */
export const updateConditions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { escrowId } = req.params;
    const { conditions } = req.body as UpdateConditionsBody;
    const { error } = validateConditions({ escrowId, conditions });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const userEmail = req.user?.email;
    if (!userEmail) {
      throw new BadRequestError('User email not found in token.');
    }

    const tx = await Escrow.findById(escrowId);
    if (!tx) {
      throw new NotFoundError('Escrow transaction not found.');
    }

    if (tx.status !== ESCROW_STATUS.PENDING && tx.status !== ESCROW_STATUS.DEPOSITED) {
      throw new BadRequestError('Conditions can only be updated for Pending or Deposited transactions.');
    }

    const updatedTx = await Escrow.findByIdAndUpdate(escrowId, { conditions }, { new: true });
    if (!updatedTx) {
      throw new NotFoundError('Escrow transaction not found.');
    }

    logAction(escrowId, userEmail, 'Updated conditions');
    res.status(200).json(updatedTx);
  } catch (error: unknown) {
    logger.error(`i7j6k5l4: Checklist update failed for escrow ${req.params.escrowId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};