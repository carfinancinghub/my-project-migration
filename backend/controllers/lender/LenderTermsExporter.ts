/**
 * © 2025 CFH, All Rights Reserved
 * File: LenderTermsExporter.ts
 * Path: C:\CFH\backend\controllers\lender\LenderTermsExporter.ts
 * Purpose: Exports lender terms as CSV or PDF with optional premium insights.
 * Author: Mini Team
 * Date: 2025-07-06 [1052]
 * Version: 1.0.0
 * Version ID: y5z4a3b2-c1d0-e9f8-g7h6-i5j4k3l2m1n0
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: y5z4a3b2-c1d0-e9f8-g7h6-i5j4k3l2m1n0
 * Save Location: C:\CFH\backend\controllers\lender\LenderTermsExporter.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`AuthenticatedRequest`, `TermsData`, `LoanOffer`, `UserProfile`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Testing (Suggestion) [Grok]:
 * - Add unit tests for `exportLenderTerms` (e.g., format handling, premium checks).
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import logger from '@utils/logger';
import { AILenderTermsAnalyzer } from '@utils/AILenderTermsAnalyzer';
import { analyticsExportUtils } from '@utils/analyticsExportUtils';
import { PremiumChecker } from '@utils/PremiumChecker';
import Lender, { ILender } from '@models/lender/Lender';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { validateExportTerms } from '@validation/lender.validation';

/* --- Interfaces --- */
interface LoanOffer {
  rate: number;
  term: number;
  amount: number;
}

interface TermsData {
  name: string;
  offers: LoanOffer[];
}

interface UserProfile {
  id: string;
  role: string;
  preferences?: Record<string, any>;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    profile: UserProfile;
  };
}

/* --- Controller Function --- */

/**
 * @function exportLenderTerms
 * @desc Exports lender terms as CSV or PDF with optional premium insights.
 * @route GET /api/lender/:id/export-terms
 */
export const exportLenderTerms = async (req: AuthenticatedRequest<{ id: string }, {}, {}, { format?: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'y5z4a3b2-c1d0-e9f8-g7h6-i5j4k3l2m1n0';
  try {
    const { id } = req.params;
    const { format } = req.query;
    const { error } = validateExportTerms({ id, format });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to export terms');
    }

    const lender: ILender | null = await Lender.findById(id);
    if (!lender) {
      throw new NotFoundError('Lender not found');
    }

    const termsData: TermsData = {
      name: lender.name,
      offers: lender.loanOffers || [],
    };

    const basicExport = await analyticsExportUtils.exportTerms(termsData, format || 'csv');

    if (await PremiumChecker.isFeatureUnlocked(user, 'lenderExportAnalytics')) {
      const formatTips = AILenderTermsAnalyzer.recommendExportTips(termsData);
      const optimizationTips = AILenderTermsAnalyzer.optimizeLenderTerms(termsData, user.profile);

      const enhancedExport = await analyticsExportUtils.exportTermsWithAI({
        format: format || 'csv',
        termsData,
        formatTips,
        optimizationTips,
        user,
      });

      res.status(200).json({
        success: true,
        premium: true,
        data: enhancedExport,
        tips: optimizationTips,
        recommendations: formatTips,
      });
      return;
    }

    res.status(200).json({
      success: true,
      premium: false,
      data: basicExport,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to export lender terms';
    logger.error(`y5z4a3b2: Error exporting lender terms for id ${req.params.id}: ${errorMessage}`);
    next(new InternalServerError(errorMessage));
  }
};