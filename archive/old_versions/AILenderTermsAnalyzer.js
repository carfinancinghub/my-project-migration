/**
 * File: AILenderTermsAnalyzer.js
 * Path: backend/utils/AILenderTermsAnalyzer.js
 * Purpose: Generate AI-driven export suggestions and format logic
 * Author: Cod1
 * Date: May 1, 2025
 * 👑 Crown Certified
 */

const logger = require('@utils/logger');

/**
 * generateInsights
 * @param {Array} terms - array of lender term objects (interestRate, term, type)
 * @returns {Object} insights for export enhancements
 */
function generateInsights(terms) {
  try {
    const avgRate =
      terms.reduce((acc, cur) => acc + cur.interestRate, 0) / terms.length;
    const longestTerm = Math.max(...terms.map((t) => t.term));
    const fixedCount = terms.filter((t) => t.type === 'fixed').length;

    return {
      recommendation:
        avgRate < 6
          ? '🟢 Rates are competitive. Include visual breakdown by lender.'
          : '🔴 Highlight high rates in red to signal caution.',
      exportEnhancements: [
        `Highlight ${fixedCount} fixed-rate offers.`,
        `Mark ${longestTerm}-year terms as "long-term risk"`,
      ],
    };
  } catch (err) {
    logger.error('Failed to generate lender term insights:', err);
    return {
      recommendation: 'Include basic lender information in export.',
      exportEnhancements: ['Add interest rate labels.', 'Sort by lowest rate.'],
    };
  }
}

module.exports = { generateInsights };
