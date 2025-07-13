/**
 * © 2025 CFH, All Rights Reserved
 * File: LenderTermsService.ts
 * Path: C:\CFH\backend\services\lender\LenderTermsService.ts
 * Purpose: Handles fetching historical export data for lender terms.
 * Author: Mini Team
 * Date: 2025-07-06 [1052]
 * Version: 1.0.0
 * Version ID: y5z4a3b2-c1d0-e9f8-g7h6-i5j4k3l2m1n0
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: 8c9e0f1a-2b3c-4d5e-6f7g-3h4i5j6k7l8m
 * Save Location: C:\CFH\backend\services\lender\LenderTermsService.ts
 */

/*
 * --- Side Note: TypeScript Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax:
 * - Used ESM `import` for consistency.
 * - Defined interfaces (`ILenderExport`, `ExportHistory`) for type safety.
 *
 * 2. Error Handling & Logging:
 * - Used `@utils/logger` with `Artifact ID` tagging.
 * - Threw custom `InternalServerError` for consistency.
 *
 * 3. Testing (Suggestion):
 * - Add unit tests for `getTermsHistory` (e.g., empty exports, detailed vs. summary).
 */

/* --- Dependencies --- */
import logger from '@utils/logger';
import LenderExport, { ILenderExport } from '@models/lender/LenderExport';
import { InternalServerError } from '@utils/errors';

/* --- Interfaces --- */
interface ExportHistory {
  date: Date;
  rate: number;
  term: number;
  negotiationOutcome: string;
}

/* --- Service Function --- */

/**
 * @function getTermsHistory
 * @desc Fetches historical export data for a user.
 * @param userId The ID of the user.
 * @param options Options object, e.g., { detailed: boolean }.
 * @returns A summary or detailed list of historical exports.
 */
export const getTermsHistory = async (userId: string, { detailed = false }: { detailed?: boolean }): Promise<{ exportCount: number; period: string } | ExportHistory[] | null> => {
  const ARTIFACT_ID = '8c9e0f1a-2b3c-4d5e-6f7g-3h4i5j6k7l8m';
  try {
    const exports: ILenderExport[] = await LenderExport.find({ userId }).sort({ date: -1 }).lean();

    if (!exports || exports.length === 0) {
      return null;
    }

    if (!detailed) {
      return {
        exportCount: exports.length,
        period: '6 months',
      };
    }

    return exports.map(entry => ({
      date: entry.date,
      rate: entry.rate,
      term: entry.term,
      negotiationOutcome: entry.negotiationOutcome,
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve export history';
    logger.error(`${ARTIFACT_ID}: Error retrieving export history for user ${userId}: ${errorMessage}`);
    throw new InternalServerError(errorMessage);
  }
};