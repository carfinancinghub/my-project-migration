// File: AuctionGamificationEngine.js
// Path: backend/services/auction/AuctionGamificationEngine.js
// Purpose: Compute dynamic auction gamification metrics (points, badges, ranks, progress, suggestions)
// Author: Rivers Auction Team
// Date: May 14, 2025
// 👑 Cod2 Crown Certified

const logger = require('@utils/logger');
const rewardsConfig = require('@config/rewardsConfig.json');

/**
 * computeAuctionGamification
 * Calculate user points, badge unlocks, progress status, and next recommendation
 * @param {Object} activity - Includes all role-based signals (bidsPlaced, auctionsListed, wins, mechanicStars, buyerRatings)
 * @returns {Object} rewards - { points, badges, rank, progress, nextBadge, recommendation }
 */
function computeAuctionGamification(activity) {
  try {
    const { bidsPlaced, auctionsListed, wins, mechanicStars = 0, buyerRatings = 0 } = activity;

    // Dynamic weights from config
    const weights = rewardsConfig.weights;
    const pointBreaks = rewardsConfig.rankThresholds;
    const badgeDefinitions = rewardsConfig.badges;

    const points = (
      bidsPlaced * weights.bid +
      auctionsListed * weights.list +
      wins * weights.win +
      mechanicStars * weights.mechanicStars +
      buyerRatings * weights.buyerRatings
    );

    const badges = [];
    for (const badge of badgeDefinitions) {
      if (points >= badge.unlockPoints) badges.push(badge.name);
    }

    let rank = 'Bronze';
    for (const level of pointBreaks) {
      if (points >= level.points) rank = level.rank;
    }

    const nextBadge = badgeDefinitions.find(b => !badges.includes(b.name));
    const progress = nextBadge
      ? { current: points, required: nextBadge.unlockPoints }
      : { current: points, required: null };

    // Recommendation
    const needed = nextBadge ? nextBadge.unlockPoints - points : 0;
    let recommendation = 'Maximize activity to unlock all ranks.';
    if (needed > 0) {
      recommendation = `Earn ${needed} more points — try listing cars, bidding more, or increasing seller ratings.`;
    }

    return {
      points,
      badges,
      rank,
      progress,
      nextBadge: nextBadge ? nextBadge.name : null,
      recommendation,
    };
  } catch (error) {
    logger.error('AuctionGamificationEngine failed to compute metrics:', error);
    throw new Error('Unable to compute gamification data.');
  }
}

module.exports = {
  computeAuctionGamification,
};

/*
Functions Summary:
- computeAuctionGamification
  - Purpose: Compute reward metrics including dynamic badges, ranks, progress, and recommendations
  - Inputs:
    - activity: {
        bidsPlaced,
        auctionsListed,
        wins,
        mechanicStars,
        buyerRatings
      }
  - Outputs:
    - {
        points,
        badges[],
        rank,
        progress: { current, required },
        nextBadge,
        recommendation
      }
  - Dependencies: @utils/logger, @config/rewardsConfig.json
*/
