// File: UserProfile.js
// Path: C:\CFH\backend\services\user\UserProfile.js
// Purpose: Manage user profile data and updates
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const UserProfile = {
  async getProfile(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserProfile] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const profile = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name || 'N/A',
        createdAt: user.createdAt
      };

      logger.info(`[UserProfile] Retrieved profile for userId: ${userId}`);
      return profile;
    } catch (err) {
      logger.error(`[UserProfile] Failed to retrieve profile for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async updateProfile(userId, updates) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserProfile] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const allowedUpdates = ['name'];
      const updateKeys = Object.keys(updates);
      const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));
      if (!isValidUpdate) {
        logger.error(`[UserProfile] Invalid update fields for userId ${userId}`);
        throw new Error('Invalid update fields');
      }

      await db.updateUser(userId, updates);
      logger.info(`[UserProfile] Updated profile for userId: ${userId}`);
      return { status: 'updated' };
    } catch (err) {
      logger.error(`[UserProfile] Failed to update profile for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = UserProfile;