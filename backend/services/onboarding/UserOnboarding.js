// File: UserOnboarding.js
// Path: C:\CFH\backend\services\onboarding\UserOnboarding.js
// Purpose: Manage user onboarding process
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const UserOnboarding = {
  async completeProfile(userId, profileData) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserOnboarding] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const requiredFields = ['name', 'email', 'phone'];
      const missingFields = requiredFields.filter(field => !profileData[field]);
      if (missingFields.length > 0) {
        logger.error(`[UserOnboarding] Missing required fields for userId: ${userId}: ${missingFields.join(', ')}`);
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      await db.updateUser(userId, { profile: profileData, onboarded: true });
      logger.info(`[UserOnboarding] Completed profile for userId: ${userId}`);
      return { status: 'profile_completed' };
    } catch (err) {
      logger.error(`[UserOnboarding] Failed to complete profile for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async getOnboardingStatus(userId) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserOnboarding] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      logger.info(`[UserOnboarding] Retrieved onboarding status for userId: ${userId}`);
      return { onboarded: user.onboarded || false, profile: user.profile || {} };
    } catch (err) {
      logger.error(`[UserOnboarding] Failed to get onboarding status for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = UserOnboarding;