// File: SocialGamification.js
// Path: C:\CFH\backend\services\premium\SocialGamification.js
// Purpose: Provide social gamification features for premium users (Updated for moderation and Wow++ mission)
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const SocialGamification = {
  async createVRTour(userId, vehicleId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[SocialGamification] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const vehicle = await db.getVehicle(vehicleId);
      if (!vehicle) {
        logger.error(`[SocialGamification] Vehicle not found for vehicleId: ${vehicleId}`);
        throw new Error('Vehicle not found');
      }

      const tour = { id: `vr-tour-${vehicleId}`, url: `vr://tour-${vehicleId}` }; // Simulated
      logger.info(`[SocialGamification] Created VR tour for userId: ${userId}, vehicleId: ${vehicleId}`);
      return { tourId: tour.id, vrTourUrl: tour.url };
    } catch (err) {
      logger.error(`[SocialGamification] Failed to create VR tour for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async assignBadge(userId, badgeType) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[SocialGamification] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const badge = { type: badgeType, awardedAt: new Date().toISOString() };
      await db.addBadge(userId, badge);
      logger.info(`[SocialGamification] Assigned badge ${badgeType} to userId: ${userId}`);
      return { badge, status: 'assigned' };
    } catch (err) {
      logger.error(`[SocialGamification] Failed to assign badge for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async completeChallengeMission(userId, missionType, actionData) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[SocialGamification] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const missions = {
        strategicBidder: {
          condition: actionData.usedPredictiveAssistant && actionData.wonAuction,
          badge: 'Strategic Bidder'
        },
        fastBidder: {
          condition: actionData.bidPlacedWithinFirstMinute,
          badge: 'Fast Bidder'
        },
        insightMaster: { // Wow++ mission
          condition: actionData.usedPredictiveAssistant && actionData.wonAuction && actionData.predictionAccuracy > 0.8,
          badge: 'Insight Master'
        }
      };

      const mission = missions[missionType];
      if (!mission) {
        logger.error(`[SocialGamification] Invalid mission type ${missionType} for userId: ${userId}`);
        throw new Error('Invalid mission type');
      }

      if (mission.condition) {
        await this.assignBadge(userId, mission.badge);
        logger.info(`[SocialGamification] Completed mission ${missionType} for userId: ${userId}`);
        return { mission: missionType, badge: mission.badge, status: 'completed' };
      }

      return { mission: missionType, status: 'not_completed' };
    } catch (err) {
      logger.error(`[SocialGamification] Failed to complete mission for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async moderateContent(officerId, contentId, contentType, action) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[SocialGamification] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const validTypes = ['leaderboard_entry', 'mission_submission'];
      if (!validTypes.includes(contentType)) {
        logger.error(`[SocialGamification] Invalid content type ${contentType} for officerId: ${officerId}`);
        throw new Error('Invalid content type');
      }

      const validActions = ['approve', 'reject', 'flag'];
      if (!validActions.includes(action)) {
        logger.error(`[SocialGamification] Invalid action ${action} for officerId: ${officerId}`);
        throw new Error('Invalid action');
      }

      await db.updateContent(contentId, contentType, { moderationStatus: action });
      logger.info(`[SocialGamification] Moderated ${contentType} ${contentId} by officerId: ${officerId} with action: ${action}`);
      return { contentId, contentType, action, status: 'moderated' };
    } catch (err) {
      logger.error(`[SocialGamification] Failed to moderate content for officerId ${officerId}: ${err.message}`, err);
      throw err;
    }
  },

  async rateLimitSocialAction(userId, actionType) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[SocialGamification] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const rateLimitConfig = {
        mission_submission: { limit: 5, window: 3600 }, // 5 submissions per hour
        leaderboard_entry: { limit: 10, window: 3600 } // 10 entries per hour
      };

      const config = rateLimitConfig[actionType];
      if (!config) {
        logger.error(`[SocialGamification] Invalid action type ${actionType} for userId: ${userId}`);
        throw new Error('Invalid action type');
      }

      const actions = await db.getUserActions(userId, actionType, config.window);
      if (actions.length >= config.limit) {
        logger.warn(`[SocialGamification] Rate limit exceeded for userId: ${userId}, actionType: ${actionType}`);
        throw new Error('Rate limit exceeded');
      }

      await db.logAction(userId, actionType);
      logger.info(`[SocialGamification] Allowed action ${actionType} for userId: ${userId}`);
      return { status: 'allowed' };
    } catch (err) {
      logger.error(`[SocialGamification] Failed to rate limit action for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = SocialGamification;