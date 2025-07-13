// File: AIDisputePredictor.js
// Path: backend/utils/AIDisputePredictor.js
// Purpose: Predict dispute outcomes with AI scoring, simulate resolution
// Author: Cod2
// Date: 2025-04-29
// 👑 Cod2 Crown Certified

const Dispute = require('@models/dispute/Dispute');
const { getUserReputation } = require('@utils/reputationEngine');

/**
 * Predict outcome of a dispute based on case data and reputation
 * @param {String} disputeId
 * @returns {Object} prediction { score, likelyOutcome, factors }
 */
async function predictDispute(disputeId) {
  const dispute = await Dispute.findById(disputeId).populate('parties');
  if (!dispute) return { error: 'Dispute not found' };

  const buyerRep = await getUserReputation(dispute.buyerId);
  const sellerRep = await getUserReputation(dispute.sellerId);

  const severityFactor = dispute.details?.severity === 'High' ? 0.8 : 0.4;
  const repDelta = buyerRep - sellerRep;

  const score = 50 + repDelta * 3 - severityFactor * 10;
  const likelyOutcome = score >= 60 ? 'Buyer-favored' : score <= 40 ? 'Seller-favored' : 'Neutral';

  return {
    score: Math.round(score),
    likelyOutcome,
    factors: {
      buyerReputation: buyerRep,
      sellerReputation: sellerRep,
      severityFactor,
      repDelta,
    },
  };
}

module.exports = { predictDispute };
