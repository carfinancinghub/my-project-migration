// File: sellerReputationMeta.js
// Path: backend/routes/seller/sellerReputationMeta.js
// 👑 Cod1 Crown Certified — Seller Meta Reputation Route with AI Insights and Badge Tracking

const express = require('express');
const router = express.Router();
const SellerBadgeEngine = require('@utils/SellerBadgeEngine');
const Reputation = require('@models/system/Reputation');
const asyncHandler = require('express-async-handler');

/**
 * @route   GET /api/seller/:id/reputation/meta
 * @desc    Fetch seller badge progress, AI insights, and percentile ranking
 * @access  Public (read-only)
 */
router.get('/:id/reputation/meta', asyncHandler(async (req, res) => {
  const sellerId = req.params.id;

  // Fetch basic reputation data from DB
  const reputation = await Reputation.findOne({ sellerId });
  if (!reputation) {
    res.status(404);
    throw new Error('Reputation not found');
  }

  // Run badge engine to get next badge info, insights, percentile, etc.
  const badgeMeta = SellerBadgeEngine.evaluateSellerMeta(reputation);

  res.status(200).json({
    score: reputation.score,
    badges: reputation.badges,
    totalReviews: reputation.totalReviews,
    verifiedSales: reputation.verifiedSales,
    aiTip: badgeMeta.aiTip,
    percentile: badgeMeta.percentile,
    nextBadge: badgeMeta.nextBadge,
    leaderboardRank: badgeMeta.leaderboardRank,
  });
}));

module.exports = router;
