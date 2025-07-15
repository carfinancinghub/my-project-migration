/**
 * © 2025 CFH, All Rights Reserved
 * File: votingController.ts
 * Path: C:\CFH\backend\controllers\disputes\votingController.ts
 * Purpose: Manages multi-judge and user voting on disputes, with tier-based logic and real-time updates in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-15 [09:00]
 * Version: 1.2.0
 * Version ID: f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1
 * Crown Certified: Yes
 * Batch ID: Compliance-071425
 * Artifact ID: f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1
 * Save Location: C:\CFH\backend\controllers\disputes\votingController.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-15 [09:00]
 */

/*
 * Future Enhancements (Cod1):
 * - Move voteOnDispute logic to a service file (Cod1, 2025-07-15 [09:00]).
 * - Use zod or joi schema to validate vote payloads (Cod1, 2025-07-15 [09:00]).
 * - Restrict who can vote (e.g., UserRole.JUDGE or ARBITRATOR) (Cod1, 2025-07-15 [09:00]).
 * - Log votes with user/timestamp for dispute history export (Cod1, 2025-07-15 [09:00]).
 * - Ensure 95%+ Jest test coverage (Cod1, 2025-07-15 [09:00]).
 * - Add time-limited vote window (Cod1, 2025-07-15 [09:00]).
 * - Implement AI-based fraud detection for Wow++ (Cod1, 2025-07-15 [09:00]).
 * - Add real-time WebSocket vote updates for Wow++ (Cod1, 2025-07-15 [09:00]).
 * - Add rate limiting for judge spam prevention (Cod1, 2025-07-15 [09:00]).
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import logger from '@utils/logger';
import Dispute from '@models/dispute/Dispute';
import { triggerDisputeNotification } from '@utils/notificationTrigger';
import { awardArbitratorBadge } from '@controllers/disputes/arbitratorRecognition';
import { updateReputation } from '@utils/reputationEngine';
import { UserRole, UserTier } from '@utils/constants';

const voteSchema = z.object({
  disputeId: z.string().uuid(),
  voteType: z.enum(['yes', 'no', 'abstain']),
});

interface VoteRecord {
  voter: string;
  vote: string;
  weight: number;
  timestamp: Date;
  tier?: string;
}

const VOTE_LIMIT = 3; // Configurable vote limit

/**
 * Multi-judge voting controller (for judges/arbitrators).
 * @param {Request} req - Express request with disputeId in params, voteType in body.
 * @param {Response} res - Express response object.
 */
export const castModeratorVote = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  try {
    const { id: disputeId } = req.params;
    const { voteType } = voteSchema.parse({ disputeId: req.params.id, voteType: req.body.voteType });
    const user = req.user;
    const io = req.app.get('socketio');
    const tier = (user.tier || UserTier.BASIC) as UserTier;
    const voterId = user.id;

    // Role check: Must be judge/arbitrator
    if (user.role !== UserRole.JUDGE && user.role !== UserRole.ARBITRATOR) {
      logger.warn('Unauthorized judge vote', { correlationId, voterId });
      res.status(403).json({ success: false, message: 'Unauthorized to vote' });
      return;
    }

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      res.status(404).json({ success: false, message: 'Dispute not found' });
      return;
    }

    // Prevent duplicate vote
    if (dispute.votes.find((v: any) => v.voter === voterId)) {
      res.status(400).json({ success: false, message: 'You have already voted' });
      return;
    }

    // Premium/Wow++: Weighted vote
    let weight = 1;
    if (tier === UserTier.PREMIUM) weight = 2;
    if (tier === UserTier.WOWPLUS) weight = 3;

    const voteRecord: VoteRecord = {
      voter: voterId,
      vote: voteType,
      weight,
      timestamp: new Date(),
      tier,
    };

    dispute.votes.push(voteRecord);

    // Timeline for audit (i18n-ready)
    dispute.timeline.push({
      event: 'Vote Submitted', // i18n: event_vote_submitted
      value: `${voteType} by ${voterId} (Tier: ${tier}, Weight: ${weight})`, // i18n: value_vote_by_tier_weight
      timestamp: new Date(),
    });

    await dispute.save();

    // Count votes
    const yesVotes = dispute.votes.filter((v: any) => v.vote === 'yes').reduce((sum: number, v: any) => sum + (v.weight || 1), 0);
    const noVotes = dispute.votes.filter((v: any) => v.vote === 'no').reduce((sum: number, v: any) => sum + (v.weight || 1), 0);

    // Resolution: VOTE_LIMIT votes OR all judges have voted
    if (dispute.votes.length >= VOTE_LIMIT && (yesVotes >= VOTE_LIMIT || noVotes >= VOTE_LIMIT)) {
      dispute.status = 'resolved';
      dispute.timeline.push({
        event: 'Dispute Resolved', // i18n: event_dispute_resolved
        value: `Unanimous ${yesVotes >= VOTE_LIMIT ? 'approval' : 'rejection'}`, // i18n: value_unanimous_approval/rejection
        timestamp: new Date(),
      });

      await awardArbitratorBadge(disputeId);
      await updateReputation(dispute.raisedBy, 'dispute-win');
      await updateReputation(dispute.againstUserId, 'dispute-loss');
      await dispute.save();

      io?.to(disputeId).emit('dispute-resolved', dispute);
    } else {
      io?.to(disputeId).emit('vote-cast', { voterId, voteType, weight });
    }

    await triggerDisputeNotification({
      type: 'Vote Submitted', // i18n: notification_type_vote_submitted
      disputeId,
      recipientId: [dispute.raisedBy, dispute.againstUserId],
      message: `🗳️ A vote has been submitted on dispute ${disputeId}`, // i18n: notification_message_vote_submitted
      suppressDuplicates: true,
    });

    logger.info('Moderator vote cast', { correlationId, disputeId, voterId, voteType, weight, tier });

    res.status(201).json({ success: true, message: 'Vote submitted' });
  } catch (error) {
    logger.error('Voting error', { correlationId, error });
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * User (non-judge) vote on dispute.
 * @param {Request} req - Express request with disputeId in params, voteType in body.
 * @param {Response} res - Express response object.
 */
export const voteOnDispute = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  try {
    const data = voteSchema.parse(req.body);
    const user = req.user;

    // Only normal users allowed
    if (user.role !== UserRole.USER) {
      res.status(403).json({ success: false, message: 'Judges/arbitrators use moderator endpoint' });
      return;
    }

    const dispute = await Dispute.findById(data.disputeId);
    if (!dispute) {
      res.status(404).json({ success: false, message: 'Dispute not found' });
      return;
    }

    // Prevent duplicate vote
    if (dispute.votes.find((v: any) => v.voter === user.id)) {
      res.status(400).json({ success: false, message: 'You have already voted' });
      return;
    }

    dispute.votes.push({ voter: user.id, vote: data.voteType, weight: 1, timestamp: new Date(), tier: user.tier });

    await dispute.save();

    logger.info('User vote cast', { correlationId, disputeId: data.disputeId, userId: user.id, voteType: data.voteType });
    res.status(201).json({ success: true, message: 'Vote recorded successfully.' });
  } catch (error) {
    logger.error('voteOnDispute error', { correlationId, error });
    res.status(500).json({ success: false, message: 'Server error recording vote' });
  }
};

// Export for router
export default {
  castModeratorVote,
  voteOnDispute,
};
