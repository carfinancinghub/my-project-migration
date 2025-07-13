// File: UserSettings.js
// Path: C:\CFH\backend\services\user\UserSettings.js
// Purpose: Manage user settings and preferences
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const UserSettings = {
  async getSettings(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserSettings] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const settings = user.settings || {
        notifications: { email: true, push: false },
        theme: 'light',
        language: 'en'
      };

      logger.info(`[UserSettings] Retrieved settings for userId: ${userId}`);
      return settings;
    } catch (err) {
      logger.error(`[UserSettings] Failed to retrieve settings for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async updateSettings(userId, updates) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserSettings] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const allowedUpdates = ['notifications', 'theme', 'language'];
      const updateKeys = Object.keys(updates);
      const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));
      if (!isValidUpdate) {
        logger.error(`[UserSettings] Invalid update fields for userId ${userId}`);
        throw new Error('Invalid update fields');
      }

      const currentSettings = user.settings || {};
      const newSettings = { ...currentSettings, ...updates };
      await db.updateUser(userId, { settings: newSettings });

      logger.info(`[UserSettings] Updated settings for userId: ${userId}`);
      return { status: 'updated', settings: newSettings };
    } catch (err) {
      logger.error(`[UserSettings] Failed to update settings for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = UserSettings;