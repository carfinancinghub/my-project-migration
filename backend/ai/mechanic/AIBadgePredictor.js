/**
 * File: AIBadgePredictor.js
 * Path: backend/ai/mechanic/AIBadgePredictor.js
 * Purpose: Predicts next likely mechanic badge based on inspection history and shift performance
 * Author: Cod1 (05060907)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 *
 * Features:
 * - Analyzes mechanic history to predict next badge
 * - Weights inspection quality, quantity, timeliness, and peer ranking
 * - Supports badge hints UI and gamified insights
 */

// --- Dependencies ---
const mechanicHistoryModel = require('@models/mechanic/MechanicHistory');
const badgeMeta = require('@data/badges/badgeMeta');
const logger = require('@utils/logger');

/**
 * predictNextBadge
 * Purpose: Given a mechanic ID, predicts the next likely badge to earn
 * @param {string} mechanicId - Mechanic's unique identifier
 * @returns {Object} { badgeId, confidence, reason }
 */
const predictNextBadge = async (mechanicId) => {
  try {
    const history = await mechanicHistoryModel.findOne({ mechanicId });
    if (!history) throw new Error('Mechanic history not found');

    const { inspections, punctualityScore, peerRank } = history;

    // Scoring logic
    const badgeScores = badgeMeta.map((badge) => {
      let score = 0;
      if (badge.criteria.includes('timeliness')) score += punctualityScore * 0.3;
      if (badge.criteria.includes('volume')) score += inspections.length * 0.2;
      if (badge.criteria.includes('peer-rank')) score += peerRank * 0.5;
      return { badgeId: badge.id, label: badge.label, score, reason: badge.criteria };
    });

    badgeScores.sort((a, b) => b.score - a.score);
    const top = badgeScores[0];

    return {
      badgeId: top.badgeId,
      confidence: Math.min(1, top.score / 100).toFixed(2),
      reason: top.reason.join(', ')
    };
  } catch (err) {
    logger.error(`AIBadgePredictor error: ${err.message}`);
    return null;
  }
};

module.exports = { predictNextBadge };
