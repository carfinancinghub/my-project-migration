// File: VRVehicleTour.js
// Path: C:\CFH\backend\services\premium\VRVehicleTour.js
// Purpose: Provide VR vehicle tours for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/vr

const logger = require('@utils/logger');
const db = require('@services/db');
const vr = require('@services/vr');

const VRVehicleTour = {
  async createVRTour(userId, vehicleId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[VRVehicleTour] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const vehicle = await db.getVehicle(vehicleId);
      if (!vehicle) {
        logger.error(`[VRVehicleTour] Vehicle not found for vehicleId: ${vehicleId}`);
        throw new Error('Vehicle not found');
      }

      const tour = await vr.createVehicleTour(vehicleId, vehicle.model, vehicle.interiorImages || []);
      logger.info(`[VRVehicleTour] Created VR tour for userId: ${userId}, vehicleId: ${vehicleId}`);
      return { tourId: tour.id, vrTourUrl: tour.url };
    } catch (err) {
      logger.error(`[VRVehicleTour] Failed to create VR tour for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async startVRTour(userId, tourId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[VRVehicleTour] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const tour = await vr.getTour(tourId);
      if (!tour) {
        logger.error(`[VRVehicleTour] VR tour not found for tourId: ${tourId}`);
        throw new Error('VR tour not found');
      }

      const session = await vr.startTourSession(userId, tourId);
      logger.info(`[VRVehicleTour] Started VR tour session for userId: ${userId}, tourId: ${tourId}`);
      return { sessionId: session.id, vrTourUrl: tour.url };
    } catch (err) {
      logger.error(`[VRVehicleTour] Failed to start VR tour for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = VRVehicleTour;