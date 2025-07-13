// File: MobileNotifications.js
// Path: C:\CFH\backend\services\mobile\MobileNotifications.js
// Purpose: Handle push notifications for mobile users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/notifications

const logger = require('@utils/logger');
const db = require('@services/db');
const notifications = require('@services/notifications');

const MobileNotifications = {
  async sendPushNotification(userId, message, type) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[MobileNotifications] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const preferences = user.settings?.notifications || { push: false };
      if (!preferences.push) {
        logger.warn(`[MobileNotifications] Push notifications disabled for userId: ${userId}`);
        return { status: 'skipped', reason: 'Push notifications disabled' };
      }

      await notifications.sendPush(userId, message, type);
      await db.logMobileAction(userId, 'send_notification', { message, type });

      logger.info(`[MobileNotifications] Sent push notification to userId: ${userId}, type: ${type}`);
      return { status: 'sent' };
    } catch (err) {
      logger.error(`[MobileNotifications] Failed to send push notification to userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async scheduleNotification(userId, message, type, scheduleTime) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[MobileNotifications] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const preferences = user.settings?.notifications || { push: false };
      if (!preferences.push) {
        logger.warn(`[MobileNotifications] Push notifications disabled for userId: ${userId}`);
        return { status: 'skipped', reason: 'Push notifications disabled' };
      }

      await notifications.schedulePush(userId, message, type, scheduleTime);
      await db.logMobileAction(userId, 'schedule_notification', { message, type, scheduleTime });

      logger.info(`[MobileNotifications] Scheduled push notification for userId: ${userId}, type: ${type}, time: ${scheduleTime}`);
      return { status: 'scheduled', scheduleTime };
    } catch (err) {
      logger.error(`[MobileNotifications] Failed to schedule push notification for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = MobileNotifications;