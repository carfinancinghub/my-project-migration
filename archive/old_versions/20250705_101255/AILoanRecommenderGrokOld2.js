/**
 * File: AILoanRecommender.js
 * Path: backend/utils/AILoanRecommender.js
 * Purpose: Recommend optimal loan configurations based on user data
 * Author: Cod1
 * Crown Certified ✅
 */

const LoanCalculator = require('@utils/LoanCalculatorWidget');
const logger = require('@utils/logger');

/**
 * Recommend optimal loan configuration based on goals
 */
function recommendOptimalLoan(principal, options = []) {
  try {
    const scenarios = options.map(opt => {
      const analytics = LoanCalculator.getLoanAnalytics(principal, opt.rate, opt.term);
      return {
        ...opt,
        ...analytics,
        score: calculateScore(analytics)
      };
    });

    scenarios.sort((a, b) => b.score - a.score);
    return {
      recommended: scenarios[0],
      allScenarios: scenarios
    };
  } catch (err) {
    logger.error('Loan recommendation failed:', err);
    throw new Error('Failed to generate loan recommendation');
  }
}

/**
 * Heuristic to rank loan options
 */
function calculateScore(loan) {
  const interestWeight = 0.6;
  const termWeight = 0.3;
  const monthlyWeight = 0.1;

  return (
    10000 -
    loan.totalInterest * interestWeight -
    loan.termYears * 100 * termWeight -
    loan.monthlyPayment * monthlyWeight
  );
}

module.exports = {
  recommendOptimalLoan
};
