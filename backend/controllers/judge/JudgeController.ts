/**
 * © 2025 CFH, All Rights Reserved
 * File: JudgeController.ts
 * Path: C:\CFH\backend\controllers\judge\JudgeController.ts
 * Purpose: Manages judge operations including arbitration and voting for dispute resolution.
 * Author: Mini Team
 * Date: 2025-07-06 [2214]
 * Version: 1.0.0
 * Version ID: e6f5g4h3-i2j1-k0l9-m8n7-o6p5q4r3s2t1
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: e6f5g4h3-i2j1-k0l9-m8n7-o6p5q4r3s2t1
 * Save Location: C:\CFH\backend\controllers\judge\JudgeController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`SubmitDecisionBody`, `CastVoteBody`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Validation [Grok]:
 * - Applied `judgeIdParamsValidation` to `getJudgeProfile` and `getArbitrations`.
 *
 * 4. Services (Suggestion) [Mini]:
 * - Move database operations to `JudgeService.ts`.
 *
 * 5. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Judge, { IJudge } from '@models/Judge';
import Arbitration from '@models/Arbitration';
import Proposal from '@models/Proposal';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { judgeIdParamsValidation, submitDecisionValidation, castVoteValidation } from '@validation/judge.validation';

/* --- Interfaces --- */
interface SubmitDecisionBody {
  decision: string;
  reason: string;
}

interface CastVoteBody {
  vote: 'approve' | 'reject';
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'judge' | 'admin';
  };
}

/* --- Controller Functions --- */

/**
 * @function getJudgeProfile
 * @desc Get judge profile by ID.
 */
export const getJudgeProfile = async (req: AuthenticatedRequest<{ judgeId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'e6f5g4h3-i2j1-k0l9-m8n7-o6p5q4r3s2t1';
  try {
    const { error } = judgeIdParamsValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch judge profile');
    }

    const { judgeId } = req.params;
    const judge = await Judge.findById(judgeId).select('-password').lean();
    if (!judge) {
      throw new NotFoundError('Judge not found');
    }

    res.status(200).json(judge);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch judge profile';
    logger.error(`e6f5g4h3: Error fetching judge profile for ${req.params.judgeId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function getArbitrations
 * @desc Get arbitration cases assigned to a specific judge.
 */
export const getArbitrations = async (req: AuthenticatedRequest<{ judgeId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'e6f5g4h3-i2j1-k0l9-m8n7-o6p5q4r3s2t1';
  try {
    const { error } = judgeIdParamsValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch arbitrations');
    }
    if (user.role !== 'judge' && user.role !== 'admin') {
      throw new ForbiddenError('Only judges or admins may fetch arbitrations');
    }

    const { judgeId } = req.params;
    const judge = await Judge.findById(judgeId).lean();
    if (!judge) {
      throw new NotFoundError('Judge not found');
    }

    const arbitrations = await Arbitration.find({ judgeId }).lean();
    res.status(200).json(arbitrations);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch arbitrations';
    logger.error(`e6f5g4h3: Error fetching arbitrations for judge ${req.params.judgeId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function submitArbitrationDecision
 * @desc Submit a decision for an arbitration case.
 */
export const submitArbitrationDecision = async (req: AuthenticatedRequest<{ judgeId: string; caseId: string }, {}, SubmitDecisionBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'e6f5g4h3-i2j1-k0l9-m8n7-o6p5q4r3s2t1';
  try {
    const { error } = submitDecisionValidation.params.validate(req.params);
    const bodyError = submitDecisionValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to submit a decision');
    }
    if (user.id !== req.params.judgeId) {
      throw new ForbiddenError('User is not authorized to submit a decision for this judge');
    }
    if (user.role !== 'judge') {
      throw new ForbiddenError('Only judges may submit arbitration decisions');
    }

    const { judgeId, caseId } = req.params;
    const { decision, reason } = req.body;

    const arbitration = await Arbitration.findOne({ _id: caseId, judgeId });
    if (!arbitration) {
      throw new NotFoundError('Arbitration case not found or not assigned to this judge');
    }

    arbitration.decision = decision;
    arbitration.reason = reason;
    const updatedArbitration = await arbitration.save();

    res.status(200).json({ message: 'Arbitration decision submitted', arbitration: updatedArbitration });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit arbitration decision';
    logger.error(`e6f5g4h3: Error submitting decision for case ${req.params.caseId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function castVote
 * @desc Cast a vote on a community proposal.
 */
export const castVote = async (req: AuthenticatedRequest<{ judgeId: string; proposalId: string }, {}, CastVoteBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'e6f5g4h3-i2j1-k0l9-m8n7-o6p5q4r3s2t1';
  try {
    const { error } = castVoteValidation.params.validate(req.params);
    const bodyError = castVoteValidation.body.validate(req.body);
    if (error || bodyError.error) {
      throw new BadRequestError(`Validation failed: ${error?.details[0].message || bodyError.error?.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to cast a vote');
    }
    if (user.id !== req.params.judgeId) {
      throw new ForbiddenError('User is not authorized to cast a vote for this judge');
    }
    if (user.role !== 'judge') {
      throw new ForbiddenError('Only judges may cast votes');
    }

    const { judgeId, proposalId } = req.params;
    const { vote } = req.body;

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }

    const voteResult = await new Vote({ judgeId, proposalId, vote }).save();
    res.status(200).json({ message: 'Vote cast successfully', vote: voteResult });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to cast vote';
    logger.error(`e6f5g4h3: Error casting vote for proposal ${req.params.proposalId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};