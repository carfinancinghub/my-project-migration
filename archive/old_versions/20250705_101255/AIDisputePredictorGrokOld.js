// File: AIDisputePredictor.js
// Path: backend/utils/AIDisputePredictor.js
// Purpose: Predict dispute outcomes with AI scoring
// Author: Cod2
// Date: 2025-04-29
// 👑 Cod2 Crown Certified

const Dispute = require('@models/dispute/Dispute');

const calculateDisputeScore = (dispute) => {
  let score = 0;

  if (dispute.evidence && dispute.evidence.length > 2) score += 40;
  if (dispute.messages && dispute.messages.length > 5) score += 20;
  if (dispute.hasExpertWitness) score += 30;

  return score;
};

const predictDisputeOutcome = async (disputeId) => {
  const dispute = await Dispute.findById(disputeId);
  if (!dispute) throw new Error('Dispute not found');

  const score = calculateDisputeScore(dispute);

  return {
    predictedOutcome: score >= 70 ? 'Favor Buyer' : score >= 40 ? 'Neutral' : 'Favor Seller',
    score,
  };
};

module.exports = { predictDisputeOutcome };
