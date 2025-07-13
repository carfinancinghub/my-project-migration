/**
 * © 2025 CFH, All Rights Reserved
 * File: loanAiApprovalController.ts
 * Path: C:\CFH\backend\controllers\lender\loanAiApprovalController.ts
 * Purpose: AI-driven logic engine for generating loan approval insights and recommendations.
 * Author: Mini Team
 * Date: 2025-07-06 [1104]
 * Version: 1.0.0
 * Version ID: z6a5b4c3-d2e1-f0g9-h8i7-j6k5l4m3n2o1
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: z6a5b4c3-d2e1-f0g9-h8i7-j6k5l4m3n2o1
 * Save Location: C:\CFH\backend\controllers\lender\loanAiApprovalController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`GenerateAiInsightsBody`, `ApprovalScoreParams`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Services (Suggestion) [Mini, Cod1]:
 * - Consider moving `calculateApprovalScore` and insight generation to `AILoanService.ts`.
 *
 * 4. Testing (Suggestion) [Cod1]:
 * - Add unit tests for `generateAiInsights` with edge cases.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Bid from '@models/Bid';
import LenderReputation, { ILenderReputation } from '@models/LenderReputation';
import logger from '@utils/logger';
import { InternalServerError, BadRequestError, NotFoundError } from '@utils/errors';
import { LOAN_SCORE_CONFIG } from '@utils/constants/loanScoreConfig';

/* --- Interfaces --- */
interface GenerateAiInsightsBody {
  bidId: string;
  interestRate: number;
  downPayment: number;
  termLength: number;
  lenderId: string;
}

interface ApprovalScoreParams {
  interestRate: number;
  downPayment: number;
  termLength: number;
  lenderReputation: number;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/* --- Validation Schema --- */
const aiRequestSchema = Joi.object<GenerateAiInsightsBody>({
  bidId: Joi.string().hex().length(24).required(),
  interestRate: Joi.number().positive().required(),
  downPayment: Joi.number().positive().required(),
  termLength: Joi.number().positive().required(),
  lenderId: Joi.string().hex().length(24).required(),
});

/* --- Utility Function --- */

/**
 * @function calculateApprovalScore
 * @desc Calculates an approval score based on loan terms and lender reputation.
 */
const calculateApprovalScore = ({ interestRate, downPayment, termLength, lenderReputation }: ApprovalScoreParams): number => {
  let score = 0;
  const { WEIGHTS, INTEREST_RATE_THRESHOLDS, DOWN_PAYMENT_THRESHOLDS, TERM_LENGTH_THRESHOLDS, REPUTATION_THRESHOLDS } = LOAN_SCORE_CONFIG;

  score += interestRate < INTEREST_RATE_THRESHOLDS.low ? WEIGHTS.HIGH : interestRate < INTEREST_RATE_THRESHOLDS.mid ? WEIGHTS.MEDIUM : WEIGHTS.LOW;
  score += downPayment < DOWN_PAYMENT_THRESHOLDS.low ? WEIGHTS.HIGH : downPayment < DOWN_PAYMENT_THRESHOLDS.mid ? WEIGHTS.MEDIUM : WEIGHTS.LOW;
  score += termLength <= TERM_LENGTH_THRESHOLDS.short ? WEIGHTS.HIGH : termLength <= TERM_LENGTH_THRESHOLDS.mid ? WEIGHTS.MEDIUM : WEIGHTS.LOW;

  if (lenderReputation >= REPUTATION_THRESHOLDS.high) score += WEIGHTS.REPUTATION_HIGH;
  else if (lenderReputation >= REPUTATION_THRESHOLDS.mid) score += WEIGHTS.REPUTATION_MEDIUM;

  return score;
};

/* --- Controller Function --- */

/**
 * @function generateAiInsights
 * @desc Generates AI-driven insights and a recommendation for a loan bid.
 */
export const generateAiInsights = async (req: AuthenticatedRequest<{}, {}, GenerateAiInsightsBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'z6a5b4c3-d2e1-f0g9-h8i7-j6k5l4m3n2o1';
  try {
    const { error } = aiRequestSchema.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to generate AI insights');
    }

    const { bidId, interestRate, downPayment, termLength, lenderId } = req.body;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      throw new NotFoundError('Bid not found');
    }

    const lenderRep = await LenderReputation.findOne({ lender: lenderId }).lean();
    const lenderRating = lenderRep ? lenderRep.rating : 3.0;

    const score = calculateApprovalScore({
      interestRate,
      downPayment,
      termLength,
      lenderReputation: lenderRating,
    });

    let recommendation: string;
    const { RECOMMENDATION_THRESHOLDS, RECOMMENDATION_TEXT, MAX_SCORE } = LOAN_SCORE_CONFIG;

    if (score >= RECOMMENDATION_THRESHOLDS.STRONG_APPROVAL) recommendation = RECOMMENDATION_TEXT.STRONG_APPROVAL;
    else if (score >= RECOMMENDATION_THRESHOLDS.APPROVE) recommendation = RECOMMENDATION_TEXT.APPROVE;
    else if (score >= RECOMMENDATION_THRESHOLDS.CONSIDER) recommendation = RECOMMENDATION_TEXT.CONSIDER;
    else recommendation = RECOMMENDATION_TEXT.REJECT;

    const aiSummary = `AI evaluated this loan bid and recommends: ${recommendation}. Composite Score: ${score}/${MAX_SCORE}.`;

    res.status(200).json({ aiSummary, score, recommendation });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate AI insights';
    logger.error(`z6a5b4c3: Error generating AI insights for bid ${req.body.bidId}: ${errorMessage}`);
    next(error);
  }
};