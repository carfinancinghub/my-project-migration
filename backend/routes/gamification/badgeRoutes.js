/**
 * File: badgeRoutes.js
 * Path: C:\CFH\backend\routes\gamification\badgeRoutes.js
 * Purpose: Provides API endpoints for badge purchases and user achievement tracking within the gamification system.
 * Author: Rivers Auction Dev Team
 * Date: 2025-05-20
 * Cod2 Crown Certified: Yes
 */

const express = require('express');
const router = express.Router();

const logger = require('@utils/logger');
const escrowService = require('@services/escrow/EscrowChainSync');
const badgeService = require('@services/api/gamification/badgeService');

// GET /badges - Retrieve available badges
router.get('/badges', async (req, res) => {
  try {
    const badges = await badgeService.getAvailableBadges();
    res.status(200).json({ success: true, badges });
  } catch (error) {
    logger.error('Failed to fetch badges:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve badges.' });
  }
});

// POST /badges/purchase - Purchase a badge
router.post('/badges/purchase', async (req, res) => {
  const { userId, badgeId } = req.body;
  try {
    const result = await escrowService.processBadgePurchase(userId, badgeId);
    res.status(200).json({ success: true, result });
  } catch (error) {
    logger.error('Badge purchase failed:', error);
    res.status(500).json({ success: false, message: 'Badge purchase failed.' });
  }
});

// GET /achievements/:userId - Fetch user achievements
router.get('/achievements/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const achievements = await badgeService.getUserAchievements(userId);
    res.status(200).json({ success: true, achievements });
  } catch (error) {
    logger.error(`Failed to fetch achievements for user ${userId}:`, error);
    res.status(500).json({ success: false, message: 'Could not retrieve achievements.' });
  }
});

module.exports = router;
