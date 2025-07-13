// File: UserPreferences.js
// Path: C:\CFH\backend\services\user\UserPreferences.js
// Purpose: Manage user preferences for personalized experience
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const UserPreferences = {
  async getPreferences(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserPreferences] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const preferences = user.preferences || {
        currency: 'USD',
        vehicleType: 'all',
        priceRange: { min: 0, max: 100000 },
        location: 'all'
      };

      logger.info(`[UserPreferences] Retrieved preferences for userId: ${userId}`);
      return preferences;
    } catch (err) {
      logger.error(`[UserPreferences] Failed to retrieve preferences for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async updatePreferences(userId, updates) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserPreferences] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const allowedUpdates = ['currency', 'vehicleType', 'priceRange', 'location'];
      const updateKeys = Object.keys(updates);
      const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));
      if (!isValidUpdate) {
        logger.error(`[UserPreferences] Invalid update fields for userId ${userId}`);
        throw new Error('Invalid update fields');
      }

      const currentPreferences = user.preferences || {};
      const newPreferences = { ...currentPreferences, ...updates };
      await db.updateUser(userId, { preferences: newPreferences });

      logger.info(`[UserPreferences] Updated preferences for userId: ${userId}`);
      return { status: 'updated', preferences: newPreferences };
    } catch (err) {
      logger.error(`[UserPreferences] Failed to update preferences for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = UserPreferences;