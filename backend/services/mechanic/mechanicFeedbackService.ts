/**
 * © 2025 CFH, All Rights Reserved
 * File: mechanicFeedbackService.ts
 * Path: C:\CFH\backend\services\mechanic\mechanicFeedbackService.ts
 * Purpose: Handles mechanic inspection feedback storage, premium sentiment analysis, and blockchain auditing.
 * Author: Mini Team
 * Date: 2025-07-06 [1212]
 * Version: 1.0.2
 * Version ID: d4e3f2g1-h0i9-j8k7-l6m5-n4o3p2q1r0s9
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: d4e3f2g1-h0i9-j8k7-l6m5-n4o3p2q1r0s9
 * Save Location: C:\CFH\backend\services\mechanic\mechanicFeedbackService.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. File Naming & Separation of Concerns [Mini]:
 * - Renamed from `MechanicFeedbackLogger.js` in `controllers` to `mechanicFeedbackService.ts` in `services`.
 *
 * 2. Strong Typing & Modern Syntax [Mini]:
 * - Converted `require` to ESM `import`.
 * - Created interfaces (`FeedbackInput`, `FeedbackRecord`, `AuthenticatedUser`, `Sentiment`).
 *
 * 3. Blockchain Integration [Mini]:
 * - Integrated `logInspectionToChain` with `txHash` updates.
 *
 * 4. Testing (Suggestion) [Grok]:
 * - Add unit tests for `saveFeedback` and `getFeedbackByTask`.
 */

/* --- Dependencies --- */
import Joi from 'joi';
import logger from '@utils/logger';
import { AIFeedbackSentiment } from '@utils/ai/AIFeedbackSentiment';
import { BadRequestError, InternalServerError } from '@utils/errors';
import { FeedbackRepository } from '@repositories/feedbackRepository';
import { logInspectionToChain } from '@utils/blockchain/BlockchainInspectionAudit';
import Task from '@models/Task';
import { feedbackSchema } from '@validation/mechanic.validation';

/* --- Interfaces --- */
interface Sentiment {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
}

interface FeedbackInput {
  taskId: string;
  notes: string;
  conditionRating?: number;
  photoRefs?: string[];
}

interface FeedbackRecord extends FeedbackInput {
  id: string;
  mechanicId: string;
  createdAt: Date;
  sentiment?: Sentiment;
  blockchainTxHash?: string;
}

interface AuthenticatedUser {
  id: string;
  subscription?: string[];
}

/* --- Service Functions --- */

/**
 * @function saveFeedback
 * @desc Saves mechanic feedback, performs sentiment analysis, and logs to blockchain.
 */
export const saveFeedback = async (
  feedback: FeedbackInput,
  user: AuthenticatedUser
): Promise<{ success: boolean; feedback: FeedbackRecord }> => {
  const ARTIFACT_ID = 'd4e3f2g1-h0i9-j8k7-l6m5-n4o3p2q1r0s9';
  try {
    const { error } = feedbackSchema.validate(feedback);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    if (!user?.id) {
      throw new BadRequestError('User authentication required to save feedback');
    }

    const { taskId, notes, conditionRating, photoRefs } = feedback;
    const task = await Task.findById(taskId);
    if (!task) {
      throw new BadRequestError('Task not found');
    }

    const recordData: Omit<FeedbackRecord, 'id' | 'createdAt'> = {
      taskId,
      mechanicId: user.id,
      notes,
      conditionRating: conditionRating || undefined,
      photoRefs: photoRefs || [],
    };

    if (user.subscription?.includes('feedbackSentimentPremium')) {
      const sentimentResult: Sentiment = await AIFeedbackSentiment.analyze(notes);
      (recordData as FeedbackRecord).sentiment = sentimentResult;
    }

    let savedFeedback = await FeedbackRepository.create(recordData);
    const { txHash } = await logInspectionToChain(savedFeedback);
    savedFeedback = await FeedbackRepository.update(savedFeedback.id, { blockchainTxHash: txHash });

    return { success: true, feedback: savedFeedback };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save feedback';
    logger.error(`d4e3f2g1: Error saving feedback for task ${feedback.taskId}: ${errorMessage}`);
    throw error instanceof BadRequestError ? error : new InternalServerError(errorMessage);
  }
};

/**
 * @function getFeedbackByTask
 * @desc Retrieves all feedback records for a given task ID.
 */
export const getFeedbackByTask = async (taskId: string): Promise<FeedbackRecord[]> => {
  const ARTIFACT_ID = 'd4e3f2g1-h0i9-j8k7-l6m5-n4o3p2q1r0s9';
  try {
    const { error } = Joi.object({ taskId: Joi.string().hex().length(24).required() }).validate({ taskId });
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const feedback = await FeedbackRepository.findByTaskId(taskId);
    return feedback as FeedbackRecord[];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve feedback';
    logger.error(`d4e3f2g1: Error retrieving feedback for task ${taskId}: ${errorMessage}`);
    throw error instanceof BadRequestError ? error : new InternalServerError(errorMessage);
  }
};