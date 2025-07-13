// File: PreferencesSetup.js
// Path: C:\CFH\backend\services\onboarding\PreferencesSetup.js
// Purpose: Set up user preferences during onboarding
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const PreferencesSetup = {
  async setPreferences(userId, preferences) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[PreferencesSetup] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const allowedFields = ['currency', 'vehicleType', 'priceRange', 'location'];
      const invalidFields = Object.keys(preferences).filter(field => !allowedFields.includes(field));
      if (invalidFields.length > 0) {
        logger.error(`[PreferencesSetup] Invalid preference fields for userId: ${userId}: ${invalidFields.join(', ')}`);
        throw new Error(`Invalid preference fields: ${invalidFields.join(', ')}`);
      }

      await db.updateUser(userId, { preferences });
      logger.info(`[PreferencesSetup] Set preferences for userId: ${userId}`);
      return { status: 'preferences_set' };
    } catch (err) {
      logger.error(`[PreferencesSetup] Failed to set preferences for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getDefaultPreferences(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[PreferencesSetup] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const defaultPreferences = {
        currency: 'USD',
        vehicleType: 'all',
        priceRange: { min: 0, max: 100000 },
        location: 'all'
      };

      logger.info(`[PreferencesSetup] Retrieved default preferences for userId: ${userId}`);
      return defaultPreferences;
    } catch (err) {
      logger.error(`[PreferencesSetup] Failed to get default preferences for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = PreferencesSetup;