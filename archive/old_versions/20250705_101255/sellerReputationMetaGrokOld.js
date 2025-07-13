// File: sellerReputationMeta.js
// Path: backend/routes/seller/sellerReputationMeta.js
// 👑 Cod1 Crown Certified — API Endpoint for Seller Reputation Meta (AI insights, badge progress, rankings)

const express = require('express');
const router = express.Router();
const SellerBadgeEngine = require('@utils/SellerBadgeEngine');
const Reputation = require('@models/system/Reputation'); // Assumes schema includes badgeProgress, aiTips, percentile
const authMiddleware = require('@middleware/authMiddleware');

/**
 * @route   GET /api/seller/:id/reputation/meta
 * @desc    Fetch seller's badge progress, AI tips, percentile, and ranking info
 * @access  Private (requires JWT, seller or admin)
 */
router.get('/:id/reputation/meta', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Load reputation from DB
    const repData = await Reputation.findOne({ sellerId: id });
    if (!repData) {
      return res.status(404).json({ message: 'Reputation record not found' });
    }

    // Calculate badge progress, AI tips, ranking position
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
    console.error('Error in seller reputation meta:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
