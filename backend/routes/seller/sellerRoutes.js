// File: sellerRoutes.js
// Path: backend/routes/seller/sellerRoutes.js
// 👑 Cod1 Crown Certified — Consolidated Seller API Router (Meta, Coach Plan)

const express = require('express');
const router = express.Router();
const authMiddleware = require('@middleware/authMiddleware');
const SellerBadgeEngine = require('@utils/SellerBadgeEngine');
const Reputation = require('@models/system/Reputation');

/**
 * @route   GET /api/seller/:id/reputation/meta
 * @desc    Fetch seller's badge progress, AI tips, percentile, and ranking info
 * @access  Private (JWT required)
 */
router.get('/:id/reputation/meta', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const repData = await Reputation.findOne({ sellerId: id });
    if (!repData) return res.status(404).json({ message: 'Reputation not found' });

    const badgeProgress = SellerBadgeEngine.calculateProgress(repData);
    const aiInsights = SellerBadgeEngine.generateAiTips(repData);
    const ranking = await SellerBadgeEngine.getRanking(id);

    return res.status(200).json({
      sellerId: id,
      currentScore: repData.score,
      badges: repData.badges,
      nextBadge: badgeProgress,
      aiTips: aiInsights,
      percentile: repData.percentile,
      ranking,
    });
  } catch (error) {
    console.error('Error in /reputation/meta:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/seller/:id/coach-plan
 * @desc    Generate and return AI coaching plan
 * @access  Premium (Enterprise)
 */
router.get('/:id/coach-plan', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const repData = await Reputation.findOne({ sellerId: id });
    if (!repData) return res.status(404).json({ message: 'Seller not found' });

    const plan = SellerBadgeEngine.generateReputationCoachPlan(repData);
    const steps = SellerBadgeEngine.generateVisualTimelineSteps(repData);

    res.status(200).json({
      sellerId: id,
      premiumUnlocked: ['sellerAnalytics'],
      coachPlan: plan,
      timeline: steps,
    });
  } catch (err) {
    console.error('Error generating coach plan:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
