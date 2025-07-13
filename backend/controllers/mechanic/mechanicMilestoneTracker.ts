/**
 * © 2025 CFH, All Rights Reserved
 * File: mechanicMilestoneTracker.ts
 * Path: C:\CFH\backend\controllers\mechanic\mechanicMilestoneTracker.ts
 * Purpose: Provides milestone badge data for the mechanic badge timeline system.
 * Author: Mini Team
 * Date: 2025-07-06 [1119]
 * Version: 1.1.0
 * Version ID: b2c1d0e9-f8g7-h6i5-j4k3-l2m1n0o9p8q7
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: b2c1d0e9-f8g7-h6i5-j4k3-l2m1n0o9p8q7
 * Save Location: C:\CFH\backend\controllers\mechanic\mechanicMilestoneTracker.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created `Milestone` and `AuthenticatedRequest` interfaces.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Services (Suggestion) [Mini, Cod1]:
 * - Move milestone logic to `MechanicMilestoneService.ts`.
 *
 * 4. Testing (Suggestion) [Cod1]:
 * - Add unit tests for `getMilestones` endpoint.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Mechanic from '@models/Mechanic';
import logger from '@utils/logger';
import { InternalServerError, BadRequestError, NotFoundError } from '@utils/errors';
import { getMilestonesValidation } from '@validation/mechanic.validation';

/* --- Interfaces --- */
interface Milestone {
  id: string;
  label: string;
  achieved: boolean;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/* --- Controller Function --- */

/**
 * @function getMilestones
 * @desc Retrieves milestone badge progress for a mechanic.
 */
export const getMilestones = async (
  req: AuthenticatedRequest<{ mechanicId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const ARTIFACT_ID = 'b2c1d0e9-f8g7-h6i5-j4k3-l2m1n0o9p8q7';
  try {
    const { error } = getMilestonesValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch milestones');
    }

    const { mechanicId } = req.params;
    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic) {
      throw new NotFoundError('Mechanic not found');
    }

    // TODO: Replace with MechanicMilestoneService.getMilestonesForMechanic(mechanicId)
    const mockMilestones: Milestone[] = [
      { id: 'badge1', label: 'First Inspection', achieved: true },
      { id: 'badge2', label: '5 Tasks Completed', achieved: true },
      { id: 'badge3', label: '10 Tasks Completed', achieved: false },
      { id: 'badge4', label: 'Top Rated Repair', achieved: false },
    ];

    res.status(200).json({ mechanicId, milestones: mockMilestones });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch mechanic milestones';
    logger.error(`b2c1d0e9: Error fetching milestones for mechanic ${req.params.mechanicId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};