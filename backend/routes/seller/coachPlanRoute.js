// File: coachPlanRoute.js
// Path: backend/routes/seller/coachPlanRoute.js
// Purpose: Serve AI Reputation Coach Plans for sellers (modular, gated)
// Author: Cod1
// Date: May 2025

const express = require('express');
const router = express.Router();
const authMiddleware = require('@middleware/authMiddleware');
const logger = require('@utils/logger');
const Reputation = require('@models/system/Reputation');
const SellerBadgeEngine = require('@utils/SellerBadgeEngine');

/**
 * @route   GET /api/seller/:id/coach-plan
 * @desc    Fetch badge progress + coaching plan (premium if flagged)
 * @access  Private (requires JWT, seller or admin), gated by sellerAnalytics flag
 */
router.get('/:id/coach-plan', authMiddleware, async (req, res) => {
  try {
    const sellerId = req.params.id;

    const repData = await Reputation.findOne({ sellerId });
    if (!repData) {
      return res.status(404).json({ message: 'Reputation record not found' });
    }

    // Always return basic badge progress (Free tier)
    const currentBadges = SellerBadgeEngine.computeBadges(repData);
    const badgeProgress = SellerBadgeEngine.calculateProgress(repData);

    // Check premium access
    const isPremium = req.user?.features?.includes('sellerAnalytics');
    const coachPlan = isPremium
      ? SellerBadgeEngine.generateReputationCoachPlan(repData)
      : null;

    return res.status(200).json({
      sellerId,
      badges: currentBadges,
      nextBadge: badgeProgress,
      coachPlan,
      tier: isPremium ? 'Enterprise' : 'Free',
    });
  } catch (err) {
    logger.error('Coach plan route error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
