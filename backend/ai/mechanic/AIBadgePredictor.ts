/**
 * © 2025 CFH, All Rights Reserved
 * File: AIBadgePredictor.ts
 * Path: C:\CFH\backend\ai\mechanic\AIBadgePredictor.ts
 * Purpose: Predicts the next likely mechanic badge based on inspection history and performance.
 * Author: Mini Team
 * Date: 2025-07-05 [1807]
 * Version: 1.0.0
 * VersionID: 1de9ab48-736c-4bef-8867-80812b0d27f4
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: b9c8d7e6-a5f4-3e2d-1c0b-9a8f7e6d5c4b
 * Save Location: C:\CFH\backend\ai\mechanic\AIBadgePredictor.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Stricter Typing:
 * - Added interfaces for `MechanicHistory`, `BadgeMeta`, `BadgeScore`, and the `PredictionResult` return type to ensure type safety throughout the module.
 *
 * 2. Configuration Constants:
 * - The "magic numbers" used for scoring (e.g., 0.3, 0.2, 0.5) have been extracted into a `SCORING_WEIGHTS` constant. This makes the scoring logic easier to read, configure, and maintain.
 *
 * 3. Improved Error Handling:
 * - Replaced the generic `new Error(...)` with the more specific `NotFoundError` from our custom error utilities (`@utils/errors`) for consistent error handling across the application.
 *
 * 4. Return Type Correction:
 * - The `confidence` value is returned as a number instead of a formatted string. This allows the consumer of the function (e.g., a frontend component) to format the number as needed, making the function more reusable.
 *
 * 5. Modern ES Module Syntax:
 * - Converted all CommonJS `require` statements to ES Module `import` statements and replaced `module.exports` with `export` for modern JavaScript standards.
 *
 * 6. Confidence Calculation:
 * - Added `MAX_SCORE` constant to dynamically calculate the maximum possible score based on weights, ensuring accurate confidence scaling.
 */

// --- Dependencies ---
import mechanicHistoryModel, { IMechanicHistory } from '@models/mechanic/MechanicHistory';
import { badgeMeta, IBadgeMeta } from '@data/badges/badgeMeta';
import logger from '@utils/logger';
import { NotFoundError } from '@utils/errors';

// --- Interfaces & Types ---
interface BadgeScore {
  badgeId: string;
  label: string;
  score: number;
  reason: string[];
}

interface PredictionResult {
  badgeId: string;
  confidence: number;
  reason: string;
}

// --- Configuration ---
const SCORING_WEIGHTS = {
  TIMELINESS: 0.3,
  VOLUME: 0.2,
  PEER_RANK: 0.5,
};

const MAX_SCORE = Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0) * 100; // Hypothetical max

/**
 * @function predictNextBadge
 * @purpose Given a mechanic ID, predicts the next likely badge to earn.
 * @param {string} mechanicId - The mechanic's unique identifier.
 * @returns {Promise<PredictionResult | null>} An object containing the predicted badge, confidence score, and reason, or null if an error occurs.
 */
export const predictNextBadge = async (mechanicId: string): Promise<PredictionResult | null> => {
  try {
    const history: IMechanicHistory | null = await mechanicHistoryModel.findOne({ mechanicId });
    if (!history) {
      throw new NotFoundError('Mechanic history not found');
    }

    const { inspections, punctualityScore, peerRank } = history;

    // Scoring logic using constants for clarity
    const badgeScores: BadgeScore[] = badgeMeta.map((badge: IBadgeMeta): BadgeScore => {
      let score = 0;
      if (badge.criteria.includes('timeliness')) score += punctualityScore * SCORING_WEIGHTS.TIMELINESS;
      if (badge.criteria.includes('volume')) score += inspections.length * SCORING_WEIGHTS.VOLUME;
      if (badge.criteria.includes('peer-rank')) score += peerRank * SCORING_WEIGHTS.PEER_RANK;
      
      return { badgeId: badge.id, label: badge.label, score, reason: badge.criteria };
    });

    // Sort to find the badge with the highest score
    badgeScores.sort((a, b) => b.score - a.score);
    const topBadge = badgeScores[0];

    if (!topBadge) {
      throw new Error('No badges could be scored.');
    }

    return {
      badgeId: topBadge.badgeId,
      confidence: Math.min(1, topBadge.score / MAX_SCORE), // Use dynamic MAX_SCORE
      reason: topBadge.reason.join(', ')
    };
  } catch (err: any) {
    logger.error(`AIBadgePredictor error for mechanicId ${mechanicId}: ${err.message}`);
    return null;
  }
};