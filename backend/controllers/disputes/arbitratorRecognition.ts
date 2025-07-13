/**
 * © 2025 CFH, All Rights Reserved
 * File: arbitratorRecognition.ts
 * Path: C:\CFH\backend\controllers\disputes\arbitratorRecognition.ts
 * Purpose: Awards badges and updates reputation for arbitrators after case resolution.
 * Author: Mini Team
 * Date: 2025-07-05 [1910]
 * Version: 1.0.0
 * VersionID: f4e3d2c1-a0b9-4c8d-7e6f-b5a4c3d2e1f0
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: b3c2d1a0-f9e8-d7c6-b5a4-f3e2d1c0b9a
 * Save Location: C:\CFH\backend\controllers\disputes\arbitratorRecognition.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - Created interfaces (`ArbitrationStats`, `AwardBadgeRequestBody`) to define the structure of the request body and user stats.
 *
 * 2. Separation of Concerns (Suggestion):
 * - Consider moving business logic for awarding badges and calculating reputation to a dedicated `ArbitrationService` or `ReputationService` for better testability and maintainability.
 *
 * 3. Configuration & Constants (Suggestion):
 * - Consider extracting badge thresholds (1, 5, 15, 30), badge names ('First Verdict', etc.), and reputation points (10, 5) into a central constants file (e.g., `@config/gamification.ts`) to make the rules easier to manage.
 *
 * 4. Error Handling & Logging:
 * - Replaced `console.error` with the standardized `@utils/logger` for structured logging.
 * - Implemented the `next(error)` pattern to pass errors to a centralized error-handling middleware.
 * - Used custom error classes (`NotFoundError`) for consistent API responses.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '@/models/User';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError } from '@utils/errors';
import { validateAwardBadge } from '@/validation/arbitration.validation';

// --- Interfaces & Types ---
interface ArbitrationStats {
  resolvedCases: number;
  badges: string[];
  reputation: number;
}

interface AwardBadgeRequestBody {
  userId: string;
  caseId: string;
  outcome: 'unanimous' | 'majority' | 'split';
}

// --- Constants ---
const BADGE_THRESHOLDS = {
  FIRST_VERDICT: 1,
  BRONZE_ARBITRATOR: 5,
  SILVER_ARBITRATOR: 15,
  GOLD_ARBITRATOR: 30,
};

const BADGE_NAMES = {
  FIRST_VERDICT: 'First Verdict',
  BRONZE_ARBITRATOR: 'Bronze Arbitrator',
  SILVER_ARBITRATOR: 'Silver Arbitrator',
  GOLD_ARBITRATOR: 'Gold Arbitrator',
};

const REPUTATION_POINTS = {
  UNANIMOUS: 10,
  DEFAULT: 5,
};

// --- Controller Function ---

/**
 * @function awardArbitratorBadge
 * @desc Awards a badge and updates reputation stats for an arbitrator after case resolution.
 */
export const awardArbitratorBadge = async (req: Request<{}, {}, AwardBadgeRequestBody>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error } = validateAwardBadge(req.body);
    if (error) {
      throw new InternalServerError(error.details[0].message);
    }

    const { userId, caseId, outcome } = req.body;

    const user: IUser | null = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Initialize arbitration stats if they don't exist
    user.arbitrationStats = user.arbitrationStats || { resolvedCases: 0, badges: [], reputation: 0 };
    const stats = user.arbitrationStats;

    stats.resolvedCases += 1;

    // Award badges based on milestones
    switch (stats.resolvedCases) {
      case BADGE_THRESHOLDS.FIRST_VERDICT:
        stats.badges.push(BADGE_NAMES.FIRST_VERDICT);
        break;
      case BADGE_THRESHOLDS.BRONZE_ARBITRATOR:
        stats.badges.push(BADGE_NAMES.BRONZE_ARBITRATOR);
        break;
      case BADGE_THRESHOLDS.SILVER_ARBITRATOR:
        stats.badges.push(BADGE_NAMES.SILVER_ARBITRATOR);
        break;
      case BADGE_THRESHOLDS.GOLD_ARBITRATOR:
        stats.badges.push(BADGE_NAMES.GOLD_ARBITRATOR);
        break;
    }

    // Adjust reputation score based on outcome
    stats.reputation += outcome === 'unanimous' ? REPUTATION_POINTS.UNANIMOUS : REPUTATION_POINTS.DEFAULT;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Badge awarded and stats updated successfully',
      arbitrationStats: user.arbitrationStats,
    });
  } catch (error: any) {
    logger.error(`b3c2d1a0: Arbitrator recognition error for user ${req.body.userId}: ${error.message}`);
    next(new InternalServerError('Failed to update arbitrator stats'));
  }
};