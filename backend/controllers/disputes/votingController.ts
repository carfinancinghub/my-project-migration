/**
 * © 2025 CFH, All Rights Reserved
 * File: votingController.ts
 * Path: C:\CFH\backend\controllers\disputes\votingController.ts
 * Purpose: Manages all voting actions for dispute cases with advanced tier-based, audit, and notification logic in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (refined by Cod1, reviewed by Grok)
 * Date: 2025-07-15 [22:30]
 * Version: 2.0.0
 * Version ID: d8f4d7b9-23a1-48cd-b00a-b222c7e15a1e
 * Crown Certified: Yes (Cod1+, all tiers, pending next release)
 * Batch ID: Compliance-071425
 * Artifact ID: d8f4d7b9-23a1-48cd-b00a-b222c7e15a1e
 * Save Location: C:\CFH\backend\controllers\disputes\votingController.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-15 [22:30]
 */

/*
 * Future Enhancements (Cod1):
 * - Implement 3-judge voting logic (resolve on 3 votes) (Cod1, 2025-07-15 [22:30]).
 * - Add real-time Socket.io for voting updates (Cod1, 2025-07-15 [22:30]).
 * - Integrate badge/reputation updates after resolution (Cod1, 2025-07-15 [22:30]).
 * - Trigger notifications to parties after vote (Cod1, 2025-07-15 [22:30]).
 * - Activate weighted votes for premium (use weight in tally) (Cod1, 2025-07-15 [22:30]).
 * - Add audit timeline/event logging for Wow++/Premium (Cod1, 2025-07-15 [22:30]).
 * - Add blockchain/write-ahead logs for votes (Wow++ feature) (Cod1, 2025-07-15 [22:30]).
 * - Add i18n for user-facing messages (Cod1, 2025-07-15 [22:30]).
 * - Add rate limiting/anti-spam protection (Cod1, 2025-07-15 [22:30]).
 * - Expand error messages with context (Cod1, 2025-07-15 [22:30]).
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import logger from '@utils/logger';
import * as disputeVotingService from '@services/disputeVotingService';
import { UserRole, UserTier } from '@utils/constants';
import { emitToRoom } from '@utils/websocket'; // Cod1+ Wow++ Socket utility
import { recordBlockchainVote } from '@services/blockchain'; // Wow++
import { aiFraudCheck } from '@services/ai'; // Wow++
import i18n from 'i18n'; // For i18n (assume setup)

const voteSchema = z.object({
  disputeId: z.string().uuid(),
  userId: z.string().uuid(),
  voteType: z.enum(['yes', 'no', 'abstain']),
  tier: z.nativeEnum(UserTier).optional(),
  voteWeight: z.number().min(1).max(10).optional(), // Premium/Wow++
});

/**
 * Submits a vote on a dispute case.
 * Supports all tiers: Free, Premium, Wow++.
 * - Premium: Weighted votes, timeline.
 * - Wow++: AI fraud check, blockchain audit, WebSocket notifications.
 */
export const voteOnDispute = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  try {
    // 1. Role enforcement
    const role = req.user?.role;
    if (![UserRole.JUDGE, UserRole.ARBITRATOR].includes(role)) {
      logger.warn('Unauthorized to vote', { correlationId, userId: req.user?.id, role });
      res.status(403).json({ success: false, message: i18n.__('unauthorizedToVote') });
      return;
    }

    // 2. Parse and validate input
    const data = voteSchema.parse(req.body);
    const tier = data.tier || UserTier.BASIC;

    // 3. AI Fraud Check (Wow++)
    if (tier === UserTier.WOWPLUS) {
      const fraudDetected = await aiFraudCheck(data);
      if (fraudDetected) {
        logger.warn('Fraudulent vote attempt detected', { correlationId, userId: data.userId, disputeId: data.disputeId });
        res.status(403).json({ success: false, message: i18n.__('fraudDetected') });
        return;
      }
    }

    // 4. Weighted Vote (Premium/Wow++)
    let voteWeight = 1;
    if (tier === UserTier.PREMIUM || tier === UserTier.WOWPLUS) {
      voteWeight = data.voteWeight || 2; // Default premium weight = 2
    }

    // 5. Service Logic
    const voteResult = await disputeVotingService.submitVote({
      ...data,
      voteWeight,
      tier,
      correlationId
    });

    // 6. Blockchain Audit Log (Wow++)
    if (tier === UserTier.WOWPLUS) {
      await recordBlockchainVote({
        disputeId: data.disputeId,
        userId: data.userId,
        voteType: data.voteType,
        timestamp: Date.now(),
        correlationId
      });
    }

    // 7. Timeline and Notifications (All Tiers)
    logger.info('Vote submitted', {
      correlationId,
      disputeId: data.disputeId,
      userId: data.userId,
      tier,
      voteWeight
    });

    // 8. WebSocket Notifications (Wow++)
    if (tier === UserTier.WOWPLUS && req.app?.get) {
      emitToRoom(req.app, data.disputeId, 'vote-cast', {
        disputeId: data.disputeId,
        userId: data.userId,
        voteType: data.voteType,
        voteWeight
      });
    }

    // 9. Respond with success
    res.status(201).json({ success: true, result: voteResult });

  } catch (err) {
    logger.error('Vote submission failed', {
      correlationId,
      error: err instanceof Error ? err.message : String(err),
      details: err.stack
    });
    const status = err instanceof z.ZodError ? 400 : 500;
    res.status(status).json({ success: false, message: i18n.__('voteSubmissionFailed') });
  }
};
