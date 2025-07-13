// File: sellerReputationMeta.js
// Path: backend/routes/seller/sellerReputationMeta.js
// 👑 Cod1 Crown Certified — Premium-Ready API: Badge Progress, AI Tips, Rankings with Monetization Tags

const express = require('express');
const router = express.Router();
const SellerBadgeEngine = require('@utils/SellerBadgeEngine');
const Reputation = require('@models/system/Reputation');
const authMiddleware = require('@middleware/authMiddleware');

/**
 * @route   GET /api/seller/:id/reputation/meta
 * @desc    Fetch seller reputation meta info (AI tips, badge progress, ranking) with premium tagging
 * @access  Private (seller or admin JWT)
 */
router.get('/:id/reputation/meta', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch reputation record
    const repData = await Reputation.findOne({ sellerId: id });
    if (!repData) {
      return res.status(404).json({ message: 'Reputation record not found' });
    }

    // Calculate all reputation-related fields
    const badgeProgress = SellerBadgeEngine.calculateProgress(repData);
    const aiTips = SellerBadgeEngine.generateAiTips(repData);
    const ranking = await SellerBadgeEngine.getRanking(id);

    // Premium feature gating logic
    const premiumUnlocked = [];
    const gatedFeatures = {
      aiTips: { premium: true },
      badgeProgress: { premium: false }, // Core feature
      ranking: { premium: true },
    };

    if (req.user && req.user.plan === 'premium') {
      premiumUnlocked.push('aiTips', 'ranking');
    }

    return res.status(200).json({
      sellerId: id,
      currentScore: repData.score,
      badges: repData.badges,
      nextBadge: badgeProgress,
      aiTips: aiTips,
      percentile: repData.percentile,
      ranking,
      gated: gatedFeatures,
      premiumUnlocked,
    });
  } catch (err) {
    console.error('Error fetching seller reputation meta:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
