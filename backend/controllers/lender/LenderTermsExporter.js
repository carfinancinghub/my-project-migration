/**
 * File: LenderTermsExporter.js
 * Path: backend/controllers/lender/LenderTermsExporter.js
 * Purpose: Export lender terms with AI recommendations, format optimization, and PDF/CSV export
 * Tier: Free (basic export), Enterprise (AI-driven export optimization)
 * 👑 Cod1 Crown Certified
 */

const fs = require('fs');
const path = require('path');
const logger = require('@utils/logger');
const AILenderTermsAnalyzer = require('@utils/AILenderTermsAnalyzer');
const analyticsExportUtils = require('@utils/analyticsExportUtils');
const PremiumChecker = require('@utils/PremiumChecker');
const Lender = require('@models/lender/Lender');
const LenderExport = require('@models/lender/LenderExport'); // <-- assume you store exports here

/**
 * @route   GET /api/lender/:id/export-terms
 * @desc    Export lender terms as CSV or PDF with optional premium insights
 * @access  Private (requires token)
 */
const exportLenderTerms = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const format = req.query.format || 'csv';

    const lender = await Lender.findById(id);
    if (!lender) {
      return res.status(404).json({ message: 'Lender not found' });
    }

    const termsData = {
      name: lender.name,
      offers: lender.loanOffers || [],
    };

    const basicExport = await analyticsExportUtils.exportTerms(termsData, format);

    if (await PremiumChecker.isFeatureUnlocked(user, 'lenderExportAnalytics')) {
      const formatTips = AILenderTermsAnalyzer.recommendExportTips(termsData);
      const optimizationTips = AILenderTermsAnalyzer.optimizeLenderTerms(termsData, user.profile);

      const enhancedExport = await analyticsExportUtils.exportTermsWithAI({
        format,
        termsData,
        formatTips,
        optimizationTips,
        user,
      });

      return res.status(200).json({
        success: true,
        premium: true,
        data: enhancedExport,
        tips: optimizationTips,
        recommendations: formatTips,
      });
    }

    return res.status(200).json({
      success: true,
      premium: false,
      data: basicExport,
    });

  } catch (err) {
    logger.error('Error exporting lender terms:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * 🔍 Cod1 ADDITION: Historical Export Terms Fetcher
 * @route   GET /api/lenders/terms-history/:userId
 * @desc    Fetch historical export data (basic or detailed based on premium access)
 * @access  Private (Free vs Premium gated)
 */
const getTermsHistory = async (userId, { detailed = false }) => {
  try {
    const exports = await LenderExport.find({ userId }).sort({ date: -1 });

    if (!exports || exports.length === 0) {
      return null;
    }

    if (!detailed) {
      return {
        exportCount: exports.length,
        period: '6 months', // Placeholder; adjust with time filtering if needed
      };
    }

    return exports.map(entry => ({
      date: entry.date,
      rate: entry.rate,
      term: entry.term,
      negotiationOutcome: entry.negotiationOutcome,
    }));
  } catch (err) {
    logger.error(`Error retrieving export history for ${userId}:`, err);
    throw new Error('Failed to retrieve export history');
  }
};

module.exports = {
  exportLenderTerms,
  getTermsHistory, // <-- Make sure to export the new function
};
