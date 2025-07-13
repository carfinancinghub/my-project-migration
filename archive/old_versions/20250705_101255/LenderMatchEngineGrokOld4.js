// File: LenderMatchEngine.js
// Path: backend/utils/LenderMatchEngine.js
// Purpose: Match lenders based on borrower data and analyze results
// Author: Cod2
// Date: 2025-05-02
// 👑 Cod2 Crown Certified

const Lender = require('@models/lender/Lender');
const logger = require('@utils/logger');
const analyticsExportUtils = require('@utils/analyticsExportUtils');
const { generateRecommendations } = require('@utils/AILenderMatchRecommender');

/**
 * Match lenders based on credit score and loan amount
 * @param {Object} borrowerData - { creditScore: Number, loanAmount: Number }
 * @returns {Array} - List of matched lenders
 */
async function basicLenderMatch(borrowerData) {
  try {
    const lenders = await Lender.find().lean();
    return lenders.filter(lender => (
      borrowerData.creditScore >= lender.minCreditScore &&
      borrowerData.loanAmount <= lender.maxLoanAmount
    ));
  } catch (err) {
    logger.error('Error in basicLenderMatch:', err);
    return [];
  }
}

/**
 * Add success probability score to lender matches
 * @param {Array} matches - List of lender matches
 * @returns {Array} - Matches with added success probability
 */
function analyzeMatchSuccess(matches) {
  return matches.map(lender => ({
    ...lender,
    successProbability: lender.matchScore || 0.9  // Default static logic
  }));
}

/**
 * Generate AI-driven lender recommendations (Premium)
 * @param {Object} borrowerData
 * @returns {Array} - Recommended lenders with insights
 */
async function getLenderRecommendations(borrowerData) {
  try {
    return await generateRecommendations(borrowerData);
  } catch (err) {
    logger.error('Error in getLenderRecommendations:', err);
    return [];
  }
}

/**
 * Export PDF report of lender matches and insights (Premium)
 * @param {Array} matchData - Lender matches with scores
 * @param {String} userId - ID of the user generating the report
 * @returns {Buffer} - PDF Buffer
 */
async function exportMatchReport(matchData, userId) {
  try {
    return await analyticsExportUtils.generateLenderMatchReport(matchData, userId);
  } catch (err) {
    logger.error('Error exporting lender match report:', err);
    return null;
  }
}

module.exports = {
  basicLenderMatch,
  analyzeMatchSuccess,
  getLenderRecommendations,
  exportMatchReport
};
