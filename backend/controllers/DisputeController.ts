/**
 * © 2025 CFH, All Rights Reserved
 * File: DisputeController.ts
 * Path: C:\CFH\backend\controllers\DisputeController.ts
 * Purpose: Handles the creation, assignment, and voting process for disputes.
 * Author: Mini Team
 * Date: 2025-07-07 [0046]
 * Version: 1.0.0
 * Version ID: k1l0m9n8-o7p6-q5r4-s3t2-u1v0w9x8y7z6
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: k1l0m9n8-o7p6-q5r4-s3t2-u1v0w9x8y7z6
 * Save Location: C:\CFH\backend\controllers\DisputeController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`CreateDisputeBody`, `AssignJudgesBody`, `SubmitVoteBody`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Validation [Grok]:
 * - Applied `createDisputeValidation` to `createDispute`.
 *
 * 4. Services (Suggestion) [Mini]:
 * - Move database operations to `DisputeService.ts`.
 *
 * 5. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Dispute, { IDispute, IVote } from '@models/Dispute';
import EscrowContract from '@models/EscrowContract';
import User from '@models/User';
import Judge from '@models/Judge';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, ConflictError, InternalServerError } from '@utils/errors';
import { createDisputeValidation, assignJudgesValidation, submitVoteValidation } from '@validation/dispute.validation';

/* --- Interfaces --- */
interface CreateDisputeBody {
  contractId: string;
  title: string;
  description: string;
  defendantId: string;
}

interface AssignJudgesBody {
  judges: string[];
}

interface SubmitVoteBody {
  vote: 'for_plaintiff' | 'for_defendant';
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'judge' | 'user';
  };
}

/* --- Controller Functions --- */

/**
 * @function getMyDisputes
 * @desc Retrieves all disputes where the authenticated user is a party or a judge.
 */
export const getMyDisputes = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'k1l0m9n8-o7p6-q5r4-s3t2-u1v0w9x8y7z6';
  try {
    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch disputes');
    }

    const disputes: IDispute[] = await Dispute.find({
      $or: [{ createdBy: user.id }, { defendantId: user.id }, { judges: user.id }],
    })
      .populate('createdBy defendantId judges', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(disputes);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch disputes';
    logger.error(`k1l0m9n8: Error fetching disputes for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function createDispute
 * @desc Creates a new dispute.
 */
export const createDispute = async (req: AuthenticatedRequest<{}, {}, CreateDisputeBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'k1l0m9n8-o7p6-q5r4-s3t2-u1v0w9x8y7z6';
  try {
    const { error } = createDisputeValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to create a dispute');
    }
    if (user.role !== 'user') {
      throw new ForbiddenError('Only users may create disputes');
    }

    const { contractId, title, description, defendantId } = req.body;
    const [contract, defendant] = await Promise.all([
      EscrowContract.findById(contractId),
      User.findById(defendantId),
    ]);

    if (!contract) {
      throw new NotFoundError('Contract not found');
    }
    if (!defendant) {
      throw new NotFoundError('Defendant not found');
    }

    const dispute = new Dispute({
      title,
      description,
      createdBy: user.id,
      contractId,
      defendantId,
      status: 'Open',
    });

    const savedDispute = await dispute.save();
    res.status(201).json(savedDispute);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create dispute';
    logger.error(`k1l0m9n8: Error creating dispute for contract ${req.body.contractId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function assignJudges
 * @desc Allows an admin to assign judges to a dispute.
 */
export const assignJudges = async (req: AuthenticatedRequest<{ disputeId: string }, {}, AssignJudgesBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'k1l0m9n8-o7p6-q5r4-s3t2-u1v0w9x8y7z6';
  try {
    const { error } = assignJudgesValidation.params.validate(req.params);
    const bodyError = assignJudgesValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to assign judges');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenError('Only admins may assign judges');
    }

    const { disputeId } = req.params;
    const { judges } = req.body;
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    const judgeDocs = await Judge.find({ _id: { $in: judges } });
    if (judgeDocs.length !== judges.length) {
      throw new NotFoundError('One or more judges not found');
    }

    dispute.judges = judges;
    dispute.status = 'Under Review';
    const updatedDispute = await dispute.save();

    res.status(200).json(updatedDispute);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to assign judges';
    logger.error(`k1l0m9n8: Error assigning judges to dispute ${req.params.disputeId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function submitVote
 * @desc Allows an assigned judge to submit a vote on a dispute.
 */
export const submitVote = async (req: AuthenticatedRequest<{ disputeId: string }, {}, SubmitVoteBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'k1l0m9n8-o7p6-q5r4-s3t2-u1v0w9x8y7z6';
  try {
    const { error } = submitVoteValidation.params.validate(req.params);
    const bodyError = submitVoteValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to submit a vote');
    }
    if (user.role !== 'judge') {
      throw new ForbiddenError('Only judges may submit votes');
    }

    const { disputeId } = req.params;
    const { vote } = req.body;
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    if (!dispute.judges.includes(user.id)) {
      throw new ForbiddenError('User is not an assigned judge for this dispute');
    }

    const existingVote = dispute.votes.find((v: IVote) => v.judge.toString() === user.id);
    if (existingVote) {
      throw new ConflictError('User has already voted on this dispute');
    }

    dispute.votes.push({ judge: user.id, vote });
    const updatedDispute = await dispute.save();

    res.status(200).json(updatedDispute);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit vote';
    logger.error(`k1l0m9n8: Error submitting vote for dispute ${req.params.disputeId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof ConflictError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};