/**
 * © 2025 CFH, All Rights Reserved
 * File: contractReviewController.ts
 * Path: C:\CFH\backend\controllers\lender\contractReviewController.ts
 * Purpose: Handles lender actions for reviewing, approving, and rejecting contracts.
 * Author: Mini Team
 * Date: 2025-07-06 [1021]
 * Version: 1.0.0
 * Version ID: t9u8v7w6-x5y4-z3a2-b1c0-d9e8f7g6h5i4
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: t9u8v7w6-x5y4-z3a2-b1c0-d9e8f7g6h5i4
 * Save Location: C:\CFH\backend\controllers\lender\contractReviewController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Imported `IContract` for strong typing.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving contract and notification logic to `ContractService.ts` and `NotificationService.ts`.
 *
 * 4. Testing (Suggestion) [Cod1]:
 * - Add unit tests for `approveContract` and `rejectContract` (success, not found, failure cases).
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Contract, { IContract } from '@models/Contract';
import Notification from '@models/Notification';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { validateContractId } from '@validation/contract.validation';
import { CONTRACT_STATUS } from '@utils/constants/contractStatus';

/* --- Interfaces --- */
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/* --- Controller Functions --- */

/**
 * @function getContractsForReview
 * @desc Fetches all contracts that are pending lender approval.
 */
export const getContractsForReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch contracts');
    }

    const contracts: IContract[] = await Contract.find({ status: CONTRACT_STATUS.PENDING })
      .populate('buyer', 'username email')
      .populate('lender', 'username email');

    res.status(200).json(contracts);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error fetching contracts';
    logger.error(`t9u8v7w6: Error fetching contracts for review: ${errorMessage}`);
    next(new InternalServerError(errorMessage));
  }
};

/**
 * @function approveContract
 * @desc Approves a contract and notifies the buyer.
 */
export const approveContract = async (req: AuthenticatedRequest<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = validateContractId({ id });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to approve contract');
    }

    const contract = await Contract.findById(id);
    if (!contract) {
      throw new NotFoundError('Contract not found');
    }

    if (contract.status !== CONTRACT_STATUS.PENDING) {
      throw new BadRequestError('Contract must be in PendingLenderApproval state to approve');
    }

    contract.status = CONTRACT_STATUS.APPROVED;
    await contract.save();

    await Notification.create({
      userId: contract.buyer,
      type: 'contract-approved',
      message: '✅ Your contract was approved by the lender.',
    });

    res.status(200).json({ success: true, message: 'Contract approved successfully.' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error approving contract';
    logger.error(`t9u8v7w6: Error approving contract ${req.params.id}: ${errorMessage}`);
    next(new InternalServerError(errorMessage));
  }
};

/**
 * @function rejectContract
 * @desc Rejects a contract and notifies the buyer.
 */
export const rejectContract = async (req: AuthenticatedRequest<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = validateContractId({ id });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to reject contract');
    }

    const contract = await Contract.findById(id);
    if (!contract) {
      throw new NotFoundError('Contract not found');
    }

    if (contract.status !== CONTRACT_STATUS.PENDING) {
      throw new BadRequestError('Contract must be in PendingLenderApproval state to reject');
    }

    contract.status = CONTRACT_STATUS.REJECTED;
    await contract.save();

    await Notification.create({
      userId: contract.buyer,
      type: 'contract-rejected',
      message: '❌ Your contract was rejected by the lender.',
    });

    res.status(200).json({ success: true, message: 'Contract rejected successfully.' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error rejecting contract';
    logger.error(`t9u8v7w6: Error rejecting contract ${req.params.id}: ${errorMessage}`);
    next(new InternalServerError(errorMessage));
  }
};