/**
 * © 2025 CFH, All Rights Reserved
 * Purpose: User Profile routes for the CFH Automotive Ecosystem
 * Author: CFH Dev Team
 * Date: 2025-06-22T17:44:00.000Z
 * Version: 1.0.0
 * Crown Certified: Yes
 * Batch ID: UserProfile-061725
 * Save Location: C:\CFH\backend\routes\user\userProfile.js
 */
const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const { authenticateToken } = require('@middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('@services/userProfileService');
const Joi = require('joi');

const updateSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
});

router.get('/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getUserProfile(userId);
    res.status(200).json(profile);
  } catch (err) {
    logger.error('Failed to fetch user profile', {
      error: err.message,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    });
    res.status(500).json({ message: 'Unable to retrieve profile' });
  }
});

router.put('/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { error } = updateSchema.validate(req.body);
    if (error) {
      logger.warn('Invalid profile update data', {
        error: error.details,
        userId,
        timestamp: new Date().toISOString(),
      });
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedProfile = await updateUserProfile(userId, req.body);
    res.status(200).json(updatedProfile);
  } catch (err) {
    logger.error('Failed to update user profile', {
      error: err.message,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    });
    res.status(500).json({ message: 'Unable to update profile' });
  }
});

module.exports = router;