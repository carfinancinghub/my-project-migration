/**
 * © 2025 CFH, All Rights Reserved
 * File: EvidenceViewer.ts
 * Path: C:\CFH\backend\controllers\disputes\EvidenceViewer.ts
 * Purpose: Handles viewing evidence for disputes in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-08 [1822]
 * Version: 1.0.0
 * Version ID: a6b5c4d3-e2f1-g0h9-i8j7-k6l5m4n3o2p1
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: a6b5c4d3-e2f1-g0h9-i8j7-k6l5m4n3o2p1
 * Save Location: C:\CFH\backend\controllers\disputes\EvidenceViewer.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Grok]:
 * - Converted ESM to TypeScript with ESM imports.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 *
 * 2. Error Handling & Logging [Grok]:
 * - Used `@utils/logger` with `Artifact ID` prefix and `next(error)`.
 *
 * 3. Validation [Grok]:
 * - Added Joi validation via `@validation/evidence.validation.ts`.
 *
 * 4. Authentication & Authorization [Grok]:
 * - Added `req.user` checks and role-based authorization.
 *
 * 5. Services (Suggestion) [Grok]:
 * - Move logic to `EvidenceService.ts`.
 *
 * 6. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 *
 * 7. Metadata [Grok]:
 * - Added `Artifact ID`, `Version ID`, and updated Author/Timestamp.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Evidence, { IEvidence } from '@models/Evidence';
import Dispute from '@models/Dispute';
import User from '@models/User';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getEvidenceByIdValidation } from '@validation/evidence.validation';

/* --- Interfaces --- */
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'judge' | 'user';
  };
}

/* --- Controller Functions --- */

/**
 * @function getEvidenceById
 * @desc Retrieves evidence by its unique ID for a dispute.
 */
export const getEvidenceById = async (req: AuthenticatedRequest<{ evidenceId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'a6b5c4d3-e2f1-g0h9-i8j7-k6l5m4n3o2p1';
  try {
    const { error } = getEvidenceByIdValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch evidence');
    }
    if (user.role !== 'admin' && user.role !== 'judge' && user.role !== 'user') {
      throw new ForbiddenError('Only admins, judges, or users may fetch evidence');
    }

    const { evidenceId } = req.params;
    const evidence: IEvidence | null = await Evidence.findById(evidenceId).lean();
    if (!evidence) {
      throw new NotFoundError('Evidence not found');
    }

    const dispute = await Dispute.findById(evidence.disputeId);
    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }
    if (user.role !== 'admin' && dispute.createdBy !== user.id && dispute.defendantId !== user.id && !dispute.judges.includes(user.id)) {
      throw new ForbiddenError('User is not authorized to access this evidence');
    }

    res.status(200).json(evidence);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch evidence';
    logger.error(`a6b5c4d3: Error fetching evidence ${req.params.evidenceId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};