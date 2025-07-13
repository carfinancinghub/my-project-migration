// File: SocialGamification.js
// Path: C:\CFH\backend\services\premium\SocialGamification.js
// Purpose: Provide social gamification features for premium users (Updated for challenge missions)
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
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
  }
};

module.exports = SocialGamification;