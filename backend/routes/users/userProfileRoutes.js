/**
 * © 2025 CFH, All Rights Reserved
 * File: userProfileRoutes.js
 * Path: C:\CFH\backend\routes\user\userProfileRoutes.js
 * Purpose: Define API routes for user profile management.
 * Author: CFH Dev Team
 * Date: June 19, 2025
 * Artifact ID: d5f7c3e2-8b1c-4a9f-9d0c-1b2a3c4d5e6f
 * Save Location: C:\CFH\backend\routes\user\userProfileRoutes.js
 */

const express = require('express');
const router = express.Router();
const logger = require('@/utils/logger');
const { authenticateToken } = require('@/middleware/authMiddleware');
const userProfileService = require('@/services/user/UserProfile'); // Assuming this service exists

/**
 * Functions Summary:
 * - Purpose: Defines API endpoints for fetching and updating user profile information, including username, email, and subscription status.
 * - Inputs:
 * - GET /profile: Requires authenticated user token.
 * - POST /profile: Requires authenticated user token and update data (username, email, subscription preferences) in the request body.
 * - Outputs:
 * - GET /profile: JSON response with user profile details.
 * - POST /profile: JSON response confirming successful update or error message.
 * - Dependencies:
 * - express, router, @/utils/logger, @/middleware/authMiddleware, @/services/user/UserProfile.
 */

// GET user profile details
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    logger.info(`Fetching profile for user ID: ${userId}`);
    const userProfile = await userProfileService.getUserProfile(userId);

    if (userProfile) {
      res.status(200).json(userProfile);
    } else {
      res.status(404).json({ message: 'User profile not found.' });
    }
  } catch (error) {
    logger.error(`Error fetching user profile: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

// POST update user profile details
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body; // username, email, subscription status/preferences
    logger.info(`Updating profile for user ID: ${userId} with updates:`, updates);

    // Basic validation (more robust validation should be in service)
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No update data provided.' });
    }

    const updatedProfile = await userProfileService.updateUserProfile(userId, updates);

    if (updatedProfile) {
      res.status(200).json({ message: 'Profile updated successfully.', profile: updatedProfile });
    } else {
      res.status(404).json({ message: 'User profile not found or failed to update.' });
    }
  } catch (error) {
    logger.error(`Error updating user profile: ${error.message}`);
    res.status(500).json({ error: 'Failed to update user profile.' });
  }
});

module.exports = router;