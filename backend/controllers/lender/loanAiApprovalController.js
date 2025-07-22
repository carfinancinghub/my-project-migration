// File: loanAiApprovalController.js
// Path: backend/controllers/lender/loanAiApprovalController.js
// 👑 Cod1 Crown Certified — AI Loan Approval Logic Engine

const Loan = require('../../models/Loan');
const User = require('../../models/User');
const LenderReputation = require('../../models/LenderReputation');

// Utility to calculate approval score based on multiple factors
const calculateApprovalScore = ({ interestRate, downPayment, termLength, lenderReputation }) => {
  let score = 0;

  // Score based on terms
  score += interestRate < 7 ? 30 : interestRate < 10 ? 20 : 10;
  score += downPayment < 2000 ? 30 : downPayment < 5000 ? 20 : 10;
  score += termLength <= 36 ? 30 : termLength <= 60 ? 20 : 10;

  // Add lender reputation weight
  if (lenderReputation >= 4.5) score += 20;
  else if (lenderReputation >= 3.5) score += 10;

  return score;
};

exports.generateAiInsights = async (req, res) => {
  try {
    const { bidId, interestRate, downPayment, termLength, lenderId } = req.body;

    const lenderRep = await LenderReputation.findOne({ lender: lenderId });
    const lenderRating = lenderRep ? lenderRep.rating : 3.0;

    const score = calculateApprovalScore({
      interestRate,
      downPayment,
      termLength,
      lenderReputation: lenderRating
    });

    let recommendation = 'Neutral';
    if (score >= 90) recommendation = 'Strong Approval';
    else if (score >= 70) recommendation = 'Approve';
    else if (score >= 50) recommendation = 'Consider with Conditions';
    else recommendation = 'Reject';

    const aiSummary = `AI evaluated this loan bid and recommends: ${recommendation}. Composite Score: ${score}/110.`;

    res.json({ aiSummary, score, recommendation });
  } catch (error) {
    console.error('AI approval generation error:', error);
    res.status(500).json({ message: 'AI engine failed to process the bid' });
  }
};
