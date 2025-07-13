/**
 * © 2025 CFH, All Rights Reserved
 * File: votingController.ts
 * Path: C:\CFH\backend\controllers\disputes\votingController.ts
 * Purpose: Manages the voting process for dispute resolution by moderators and users.
 * Author: Mini Team
 * Date: 2025-07-05 [2238]
 * Version: 1.0.0
 * Version ID: j7k8l9m0-n1o2-4p3q-8r4s-u5v6w7x8y9z0
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: h6i5j4k3-l2m1-n0o9-p8q7-r6s5t4u3v2w1
 * Save Location: C:\CFH\backend\controllers\disputes\votingController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - Created interfaces (`CastVoteBody`, `AuthenticatedRequest`, `VoteCastPayload`) and types (`VoteOption`).
 * - Imported the `IDispute` interface for strong typing.
 *
 * 2. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving vote tallying, dispute resolution, badge awarding, and reputation updates to a `VotingService`.
 *
 * 3. Configuration & Constants (Suggestion) [Mini]:
 * - Consider moving `VOTING_CONFIG` to a central constants file (e.g., `@utils/constants`).
 *
 * 4. Socket.IO Decoupling (Suggestion) [Mini]:
 * - Consider abstracting Socket.IO calls into a `NotificationService` to decouple from real-time implementation.
 *
 * 5. Auto-Close Scheduler (Suggestion) [Cod1]:
 * - Consider adding a scheduler to auto-close disputes with no votes after a set period (e.g., 3 days).
 *
 * 6. Wow ++ Ideas (Future Ready) [Cod1]:
 * - Add timeline tags: allow marking dispute events as 'System' or 'User'-generated.
 * - Integrate optional `resolutionCode` enum (e.g., AUTO, MANUAL, MEDIATION).
 * - Track dispute lifecycle duration for analytics.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import Dispute, { IDispute, IVote } from '@models/dispute/Dispute';
import { triggerDisputeNotification } from '@utils/notificationTrigger';
import { awardArbitratorBadge } from '@controllers/disputes/arbitratorRecognition';
import { updateReputation } from '@utils/reputationEngine';
import logger from '@utils/logger';
import { NotFoundError, BadRequestError, InternalServerError } from '@utils/errors';
import { Server as SocketIOServer } from 'socket.io';
import { validateCastVote } from '@validation/dispute.validation';

// --- Types ---
type VoteOption = 'yes' | 'no';

interface CastVoteBody {
  vote: VoteOption;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string };
  app: { get: (key: 'socketio') => SocketIOServer };
}

interface VoteCastPayload {
  voterId: string;
  vote: VoteOption;
}

// --- Constants ---
const VOTING_CONFIG = {
  REQUIRED_VOTES_FOR_RESOLUTION: 3,
  VOTE_OPTIONS: {
    YES: 'yes',
    NO: 'no',
  },
  DISPUTE_STATUS: {
    OPEN: 'Open',
    RESOLVED: 'resolved',
  },
};

// --- Controller ---
export const castModeratorVote = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: disputeId } = req.params;
    const { vote } = req.body as CastVoteBody;
    const { error } = validateCastVote({ disputeId, vote });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const voterId = req.user?.id;
    const io = req.app.get('socketio');

    if (!voterId) {
      throw new BadRequestError('Authentication required to vote.');
    }

    const dispute: IDispute | null = await Dispute.findById(disputeId);
    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    if (dispute.status !== VOTING_CONFIG.DISPUTE_STATUS.OPEN) {
      throw new BadRequestError('Votes can only be cast on open disputes');
    }

    const alreadyVoted = dispute.votes.some((v: IVote) => v.voter.toString() === voterId);
    if (alreadyVoted) {
      throw new BadRequestError('You have already voted on this dispute');
    }

    dispute.votes.push({ voter: voterId, vote, timestamp: new Date() });
    dispute.timeline.push({
      event: 'Vote Submitted',
      value: `Vote '${vote}' by moderator ${voterId}`,
      timestamp: new Date(),
    });

    await dispute.save();

    const yesVotes = dispute.votes.filter(v => v.vote === VOTING_CONFIG.VOTE_OPTIONS.YES).length;
    const noVotes = dispute.votes.filter(v => v.vote === VOTING_CONFIG.VOTE_OPTIONS.NO).length;
    const totalVotes = dispute.votes.length;

    // Final resolution check
    if (
      totalVotes === VOTING_CONFIG.REQUIRED_VOTES_FOR_RESOLUTION &&
      (yesVotes === 3 || noVotes === 3)
    ) {
      dispute.status = VOTING_CONFIG.DISPUTE_STATUS.RESOLVED;
      const result = yesVotes === 3 ? 'approval' : 'rejection';
      dispute.timeline.push({
        event: 'Dispute Resolved',
        value: `Unanimous ${result}`,
        timestamp: new Date(),
      });

      // Defer badge/reputation updates to service layer (noted in Side Notes)
      await dispute.save();

      io.to(disputeId).emit('dispute-resolved', dispute);
    } else {
      const payload: VoteCastPayload = { voterId, vote };
      io.to(disputeId).emit('vote-cast', payload);
    }

    await triggerDisputeNotification({
      type: 'Vote Submitted',
      disputeId,
      recipientId: [String(dispute.raisedBy), String(dispute.againstUserId)],
      message: `🗳️ A vote has been submitted on dispute ${disputeId}`,
      suppressDuplicates: true,
    });

    res.status(201).json({ message: 'Vote submitted successfully' });
  } catch (error: unknown) {
    logger.error(`h6i5j4k3: Voting error on dispute ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Internal server error during voting process'));
  }
};