// File: AIDisputePredictor.js
// Path: backend/utils/AIDisputePredictor.js
// Purpose: Predict dispute outcomes using historical scoring and case similarity AI
// Author: Cod2
// Date: 2025-04-30
// 👑 Cod2 Crown Certified

const Dispute = require('@models/dispute/Dispute');

const AIDisputePredictor = {
  async getHistoricalScore(dispute) {
    const similarCases = await Dispute.find({
      type: dispute.type,
      verdict: { $ne: null },
    });

    const outcomes = similarCases.reduce(
      (acc, item) => {
        acc.total++;
        if (item.verdict === 'favor_buyer') acc.buyer++;
        if (item.verdict === 'favor_seller') acc.seller++;
        return acc;
      },
      { buyer: 0, seller: 0, total: 0 }
    );

    const buyerScore = (outcomes.buyer / outcomes.total) * 100;
    const sellerScore = (outcomes.seller / outcomes.total) * 100;

    return {
      buyerLikelihood: buyerScore.toFixed(1),
      sellerLikelihood: sellerScore.toFixed(1),
      historicalCases: outcomes.total,
    };
  },

  async simulateOutcome(disputeId) {
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) throw new Error('Dispute not found');

    const prediction = await this.getHistoricalScore(dispute);
    return prediction;
  },
};

module.exports = AIDisputePredictor;
