// File: WelcomeNotification.js
// Path: C:\CFH\backend\services\onboarding\WelcomeNotification.js
// Purpose: Send welcome notifications to new users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/notifications

const logger = require('@utils/logger');
const db = require('@services/db');
const notifications = require('@services/notifications');

const WelcomeNotification = {
  async sendWelcomeEmail(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[WelcomeNotification] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const message = `Welcome to Rivers Auction, ${user.profile?.name || 'User'}! Start exploring auctions now.`;
      await notifications.sendEmail(user.profile.email, message);
      await db.logNotification(userId, 'welcome_email', { message });

      logger.info(`[WelcomeNotification] Sent welcome email to userId: ${userId}`);
      return { status: 'email_sent' };
    } catch (err) {
      logger.error(`[WelcomeNotification] Failed to send welcome email to userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async sendWelcomePush(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[WelcomeNotification] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const preferences = user.settings?.notifications || { push: false };
      if (!preferences.push) {
        logger.warn(`[WelcomeNotification] Push notifications disabled for userId: ${userId}`);
        return { status: 'skipped', reason: 'Push notifications disabled' };
      }

      const message = `Welcome to Rivers Auction! Start bidding now!`;
      await notifications.sendPush(userId, message, 'welcome');
      await db.logNotification(userId, 'welcome_push', { message });

      logger.info(`[WelcomeNotification] Sent welcome push to userId: ${userId}`);
      return { status: 'push_sent' };
    } catch (err) {
      logger.error(`[WelcomeNotification] Failed to send welcome push to userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = WelcomeNotification;