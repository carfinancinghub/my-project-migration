/**
 * © 2025 CFH, All Rights Reserved
 * File: EscrowController.ts
 * Path: C:\CFH\backend\controllers\EscrowController.ts
 * Purpose: Handles the creation and management of escrow contracts and transactions.
 * Author: Mini Team
 * Date: 2025-07-07 [0036]
 * Version: 1.0.0
 * Version ID: i9j8k7l6-m5n4-o3p2-q1r0-s9t8u7v6w5x4
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: i9j8k7l6-m5n4-o3p2-q1r0-s9t8u7v6w5x4
 * Save Location: C:\CFH\backend\controllers\EscrowController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`CreateContractBody`, `LogTransactionBody`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Validation [Grok]:
 * - Applied `contractIdValidation` to all endpoints.
 *
 * 4. Services (Suggestion) [Mini]:
 * - Move database operations to `EscrowService.ts`.
 *
 * 5. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import EscrowContract, { IEscrowContract } from '@models/EscrowContract';
import EscrowTransaction from '@models/EscrowTransaction';
import User from '@models/User';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { contractIdValidation, createContractValidation, logTransactionValidation } from '@validation/escrow.validation';

/* --- Interfaces --- */
interface CreateContractBody {
  buyerId: string;
  sellerId: string;
  lenderId?: string;
}

interface LogTransactionBody {
  contractId: string;
  step: string;
  amount: number;
  currency: string;
  notes?: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'buyer' | 'seller' | 'lender';
  };
}

/* --- Controller Functions --- */

/**
 * @function getMyEscrowContracts
 * @desc Retrieves all escrow contracts where the authenticated user is a party.
 */
export const getMyEscrowContracts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'i9j8k7l6-m5n4-o3p2-q1r0-s9t8u7v6w5x4';
  try {
    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch escrow contracts');
    }

    const contracts: IEscrowContract[] = await EscrowContract.find({
      $or: [{ buyerId: user.id }, { sellerId: user.id }, { lenderId: user.id }],
    })
      .populate('buyerId sellerId lenderId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(contracts);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contracts';
    logger.error(`i9j8k7l6: Error fetching escrow contracts for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function createEscrowContract
 * @desc Creates a new escrow contract.
 */
export const createEscrowContract = async (req: AuthenticatedRequest<{}, {}, CreateContractBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'i9j8k7l6-m5n4-o3p2-q1r0-s9t8u7v6w5x4';
  try {
    const { error } = createContractValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to create a contract');
    }
    if (user.role !== 'admin' && user.role !== 'buyer' && user.role !== 'seller') {
      throw new ForbiddenError('Only admins, buyers, or sellers may create contracts');
    }

    const { buyerId, sellerId, lenderId } = req.body;
    const [buyer, seller, lender] = await Promise.all([
      User.findById(buyerId),
      User.findById(sellerId),
      lenderId ? User.findById(lenderId) : Promise.resolve(null),
    ]);

    if (!buyer) {
      throw new NotFoundError('Buyer not found');
    }
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }
    if (lenderId && !lender) {
      throw new NotFoundError('Lender not found');
    }

    const contract = new EscrowContract({
      buyerId,
      sellerId,
      lenderId,
      activated: false,
      isComplete: false,
    });

    const savedContract = await contract.save();
    res.status(201).json(savedContract);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create contract';
    logger.error(`i9j8k7l6: Error creating escrow contract: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function signEscrowContract
 * @desc Allows a party (buyer, seller, lender) to sign an escrow contract.
 */
export const signEscrowContract = async (req: AuthenticatedRequest<{ contractId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'i9j8k7l6-m5n4-o3p2-q1r0-s9t8u7v6w5x4';
  try {
    const { error } = contractIdValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to sign a contract');
    }
    if (user.role !== 'buyer' && user.role !== 'seller' && user.role !== 'lender') {
      throw new ForbiddenError('Only buyers, sellers, or lenders may sign contracts');
    }

    const { contractId } = req.params;
    const contract = await EscrowContract.findById(contractId);
    if (!contract) {
      throw new NotFoundError('Escrow contract not found');
    }

    let isParty = false;
    if (user.id === contract.buyerId.toString()) {
      contract.signedByBuyer = true;
      isParty = true;
    }
    if (user.id === contract.sellerId.toString()) {
      contract.signedBySeller = true;
      isParty = true;
    }
    if (contract.lenderId && user.id === contract.lenderId.toString()) {
      contract.signedByLender = true;
      isParty = true;
    }

    if (!isParty) {
      throw new ForbiddenError('User is not a party to this contract');
    }

    const allSigned = contract.signedByBuyer && contract.signedBySeller && (contract.lenderId ? contract.signedByLender : true);
    if (allSigned) {
      contract.activated = true;
      contract.effectiveDate = new Date();
    }

    const updatedContract = await contract.save();
    res.status(200).json(updatedContract);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign contract';
    logger.error(`i9j8k7l6: Error signing contract ${req.params.contractId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function logEscrowTransaction
 * @desc Logs a financial transaction against an escrow contract.
 */
export const logEscrowTransaction = async (req: AuthenticatedRequest<{}, {}, LogTransactionBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'i9j8k7l6-m5n4-o3p2-q1r0-s9t8u7v6w5x4';
  try {
    const { error } = logTransactionValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to log a transaction');
    }
    if (user.role !== 'admin' && user.role !== 'buyer' && user.role !== 'seller' && user.role !== 'lender') {
      throw new ForbiddenError('Only admins, buyers, sellers, or lenders may log transactions');
    }

    const { contractId, step, amount, currency, notes } = req.body;
    const contract = await EscrowContract.findById(contractId);
    if (!contract) {
      throw new NotFoundError('Escrow contract not found');
    }

    const transaction = new EscrowTransaction({
      contractId,
      step,
      amount,
      currency,
      notes,
      triggeredBy: user.id,
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to record transaction';
    logger.error(`i9j8k7l6: Error logging escrow transaction for contract ${req.body.contractId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};