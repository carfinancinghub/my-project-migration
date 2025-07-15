/**
 * © 2025 CFH, All Rights Reserved
 * File: votingController.ts
 * Path: C:\CFH\backend\controllers\disputes\votingController.ts
 * Purpose: Manages voting on dispute cases with tier-based logic in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-15 [22:00]
 * Version: 1.2.0
 * Version ID: f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1
 * Crown Certified: Yes
 * Batch ID: Compliance-071425
 * Artifact ID: f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1
 * Save Location: C:\CFH\backend\controllers\disputes\votingController.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-15 [22:00]
 */

/*
 * Future Enhancements (Cod1):
 * - Implement 3-judge voting logic (resolve on 3 votes) (Cod1, 2025-07-15 [22:00]).
 * - Add real-time Socket.io for voting updates (Cod1, 2025-07-15 [22:00]).
 * - Integrate badge/reputation updates after resolution (Cod1, 2025-07-15 [22:00]).
 * - Trigger notifications to parties after vote (Cod1, 2025-07-15 [22:00]).
 * - Activate weighted votes for premium (use weight in tally) (Cod1, 2025-07-15 [22:00]).
 * - Add audit timeline/event logging for Wow++/Premium (Cod1, 2025-07-15 [22:00]).
 * - Add blockchain/write-ahead logs for votes (Wow++ feature) (Cod1, 2025-07-15 [22:00]).
 * - Add i18n for user-facing messages (Cod1, 2025-07-15 [22:00]).
 * - Add rate limiting/anti-spam protection (Cod1, 2025-07-15 [22:00]).
 * - Expand error messages with context (Cod1, 2025-07-15 [22:00]).
 */

import { Request, Response } from 'express';
import { z } from 'zod'; // For validation
import { v4 as uuidv4 } from 'uuid';
import logger from '@utils/logger'; // Alias import
import * as disputeVotingService from '@services/disputeVotingService'; // Alias import
import { UserRole } from '@utils/constants'; // For role checks
import { sendNotification } from '@services/notificationService'; // For notifications (assume exists)
import { updateBadge } from '@services/badgeService'; // For badge/reputation (assume exists)
import i18n from 'i18n'; // For i18n (assume setup)

const voteSchema = z.object({
  disputeId: z.string().uuid(),
  userId: z.string().uuid(),
  voteType: z.enum(['yes', 'no', 'abstain']),
  tier: z.enum(['basic', 'premium', 'wow++']).optional(), // For tier-based logic
  comment: z.string().optional(), // Premium: Required for explanations
});

/**
 * Submits a vote on a dispute case.
 * @param {Request} req - Express request with disputeId, userId, voteType, tier, comment in body.
 * @param {Response} res - Express response object.
 */
export const voteOnDispute = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  try {
    // Role check: Only JUDGE/ARBITRATOR can vote (middleware suggested)
    if (req.user?.role !== UserRole.JUDGE && req.user?.role !== UserRole.ARBITRATOR) {
      res.status(403).json({ success: false, message: i18n.__('unauthorizedToVote') });
      return;
    }

    const data = voteSchema.parse(req.body);
    if (data.tier === 'premium' && !data.comment) {
      res.status(400).json({ success: false, message: i18n.__('commentRequiredForPremium') });
      return;
    }

    const result = await disputeVotingService.submitVote(data);

    // Multi-judge logic: If 3 votes, resolve dispute (Cod1 suggestion)
    if (result.votes.length >= 3) {
      const consensus = disputeVotingService.calculateConsensus(result.votes, data.tier); // Weighting for premium
      await disputeVotingService.resolveDispute(data.disputeId, consensus);
      await updateBadge(data.disputeId); // Integrate badge/reputation (Cod1 suggestion)
    }

    // Trigger notifications (Cod1 suggestion)
    await sendNotification(data.disputeId, 'voteCast', i18n.__('voteCastNotification'));

    logger.info('Vote submitted', { correlationId, disputeId: data.disputeId, userId: data.userId });
    res.status(201).json({ success: true, result });
  } catch (err) {
    logger.error('Failed to submit vote', { correlationId, error: err.message, details: err.stack }); // Expanded error context (Cod1 suggestion)
    const status = err instanceof z.ZodError ? 400 : 500;
    res.status(status).json({ success: false, message: i18n.__('voteSubmissionFailed') });
  }
};

// Premium/Wow++ Note: Activate weighted votes for premium, blockchain logs for Wow++ (call @blockchain/voteLog in service).
