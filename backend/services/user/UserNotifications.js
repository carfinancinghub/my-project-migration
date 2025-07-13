// File: UserNotifications.js
// Path: C:\CFH\backend\services\user\UserNotifications.js
// Purpose: Manage user notification preferences and delivery
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/notifications

const logger = require('@utils/logger');
const db = require('@services/db');
const notifications = require('@services/notifications');

const UserNotifications = {
  async updateNotificationPreferences(userId, preferences) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserNotifications] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const allowedPreferences = ['email', 'push', 'sms'];
      const preferenceKeys = Object.keys(preferences);
      const isValid = preferenceKeys.every(key => allowedPreferences.includes(key));
      if (!isValid) {
        logger.error(`[UserNotifications] Invalid notification preferences for userId ${userId}`);
        throw new Error('Invalid notification preferences');
      }

      const currentSettings = user.settings || {};
      const updatedSettings = {
        ...currentSettings,
        notifications: { ...currentSettings.notifications, ...preferences }
      };
      await db.updateUser(userId, { settings: updatedSettings });

      logger.info(`[UserNotifications] Updated notification preferences for userId: ${userId}`);
      return { status: 'updated', preferences: updatedSettings.notifications };
    } catch (err) {
      logger.error(`[UserNotifications] Failed to update notification preferences for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async sendUserNotification(userId, message, type) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserNotifications] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const preferences = user.settings?.notifications || { email: true, push: false, sms: false };
      if (preferences.email) {
        await notifications.sendEmail(user.email, message);
      }
      if (preferences.push) {
        await notifications.sendPush(userId, message);
      }
      if (preferences.sms) {
        await notifications.sendSMS(user.phone, message);
      }

      logger.info(`[UserNotifications] Sent notification to userId: ${userId}, type: ${type}`);
      return { status: 'sent' };
    } catch (err) {
      logger.error(`[UserNotifications] Failed to send notification to userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = UserNotifications;