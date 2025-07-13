/**
 * © 2025 CFH, All Rights Reserved
 * File: disputeFlowController.ts
 * Path: C:\CFH\backend\controllers\disputes\disputeFlowController.ts
 * Purpose: Manages the lifecycle of disputes, from creation to resolution.
 * Author: Mini Team
 * Date: 2025-07-05 [1941]
 * Version: 1.0.0
 * Version ID: g7h8i9j0-k1l2-4m3n-8o9p-q5r6s7t8u9v0
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: d3e2c1b0-a9f8-e7d6-c5b4-f3e2d1c0b9a
 * Save Location: C:\CFH\backend\controllers\disputes\disputeFlowController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - Created interfaces (`CreateDisputeBody`, `ResolveDisputeBody`) to define the structure of request bodies.
 * - Imported the `IDispute` interface from the model for strong typing of database documents.
 *
 * 2. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving business logic for creating, finding, and resolving disputes to a dedicated `DisputeService` to make the controller leaner and improve testability.
 *
 * 3. Configuration & Constants (Suggestion) [Mini]:
 * - Consider extracting status strings like 'Open' and 'Resolved' into a central constants file (e.g., `@utils/constants`) to avoid magic strings and improve maintainability.
 *
 * 4. Wow ++ Ideas (Future Ready) [Cod1]:
 * - Add timeline tags: allow marking dispute events as 'System' or 'User'-generated.
 * - Integrate optional `resolutionCode` enum (e.g., AUTO, MANUAL, MEDIATION).
 * - Track dispute lifecycle duration for analytics.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import Dispute, { IDispute } from '@models/dispute/Dispute';
import User from '@models/User';
import { triggerDisputeNotification } from '@utils/notificationTrigger';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, InternalServerError } from '@utils/errors';
import { validateCreateDispute, validateResolveDispute } from '@validation/dispute.validation';

// --- Interfaces ---
interface CreateDisputeBody {
  raisedBy: string;
  againstUser: string;
  description: string;
  transactionId: string;
  transactionModel: 'Auction' | 'ServiceOrder';
}

interface ResolveDisputeBody {
  resolution: string;
}

// --- Constants ---
const DISPUTE_STATUS = {
  OPEN: 'Open',
  RESOLVED: 'Resolved',
};

// --- Controller Functions ---

/**
 * @function createDispute
 * @desc Creates a new dispute and notifies involved parties.
 */
export const createDispute = async (req: Request<{}, {}, CreateDisputeBody>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error } = validateCreateDispute(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { raisedBy, againstUser, description, transactionId, transactionModel } = req.body;

    // Verify user existence
    const [raisedByUser, againstUserUser] = await Promise.all([
      User.findById(raisedBy),
      User.findById(againstUser),
    ]);
    if (!raisedByUser || !againstUserUser) {
      throw new NotFoundError('One or both users not found');
    }

    const newDispute = new Dispute({
      raisedBy,
      againstUser,
      description,
      transactionId,
      transactionModel,
      status: DISPUTE_STATUS.OPEN,
      timeline: [{ event: 'Dispute Created', timestamp: new Date(), value: null }],
    });

    const savedDispute = await newDispute.save();

    await triggerDisputeNotification({
      type: 'Dispute Created',
      disputeId: savedDispute._id.toString(),
      recipientId: [raisedBy, againstUser],
      message: `🚨 A new dispute has been filed.`,
      suppressDuplicates: true,
    });

    res.status(201).json(savedDispute);
  } catch (error: unknown) {
    logger.error(`d3e2c1b0: Create dispute error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Failed to create dispute'));
  }
};

/**
 * @function getDisputesByUser
 * @desc Gets all disputes where a user is either the creator or the subject.
 */
export const getDisputesByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;

    const disputes: IDispute[] = await Dispute.find({
      $or: [{ raisedBy: userId }, { againstUser: userId }],
    });

    res.status(200).json(disputes);
  } catch (error: unknown) {
    logger.error(`d3e2c1b0: Fetch user disputes error for user ${req.params.userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Server error fetching disputes'));
  }
};

/**
 * @function getAllDisputes
 * @desc Gets all disputes in the system (for admin use).
 */
export const getAllDisputes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const disputes: IDispute[] = await Dispute.find();
    res.status(200).json(disputes);
  } catch (error: unknown) {
    logger.error(`d3e2c1b0: Fetch all disputes error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Server error fetching disputes'));
  }
};

/**
 * @function resolveDisputeManually
 * @desc Allows an admin to manually resolve a dispute and set its outcome.
 */
export const resolveDisputeManually = async (req: Request<{ id: string }, {}, ResolveDisputeBody>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error } = validateResolveDispute(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { id } = req.params;
    const { resolution } = req.body;

    const dispute = await Dispute.findById(id);
    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    dispute.status = DISPUTE_STATUS.RESOLVED;
    dispute.resolution = resolution;
    dispute.timeline.push({
      event: 'Manual Resolution',
      value: resolution,
      timestamp: new Date(),
    });

    const updatedDispute = await dispute.save();

    await triggerDisputeNotification({
      type: 'Dispute Resolved',
      disputeId: id,
      recipientId: [dispute.raisedBy.toString(), dispute.againstUser.toString()],
      message: `✅ Dispute ${id} was resolved manually.`,
      suppressDuplicates: true,
    });

    res.status(200).json(updatedDispute);
  } catch (error: unknown) {
    logger.error(`d3e2c1b0: Manual dispute resolution error for dispute ${req.params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(error);
  }
};