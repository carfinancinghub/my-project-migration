// File: ARVehicleView.js
// Path: C:\CFH\backend\services\premium\ARVehicleView.js
// Purpose: Provide AR vehicle visualization for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db, @services/ar

const logger = require('@utils/logger');
const db = require('@services/db');
const ar = require('@services/ar');

const ARVehicleView = {
  async getARModel(vehicleId) {
    try {
      const vehicle = await db.getVehicle(vehicleId);
      if (!vehicle) {
        logger.error(`[ARVehicleView] Vehicle not found for vehicleId: ${vehicleId}`);
        throw new Error('Vehicle not found');
      }

      const arModel = await ar.generateARModel(vehicle.model, vehicle.color, vehicle.dimensions);
      logger.info(`[ARVehicleView] Generated AR model for vehicleId: ${vehicleId}`);
      return { vehicleId, arModelUrl: arModel.url };
    } catch (err) {
      logger.error(`[ARVehicleView] Failed to generate AR model for vehicleId ${vehicleId}: ${err.message}`, err);
      throw err;
    }
  },

  async renderARView(userId, vehicleId) {
    try {
      const user = await db.getUser(userId);
      if (!user || !user.isPremium) {
        logger.error(`[ARVehicleView] Premium access required for userId: ${userId}`);
        throw new Error('Premium access required');
      }

      const arModel = await this.getARModel(vehicleId);
      const arSession = await ar.startARSession(userId, arModel.arModelUrl);
      logger.info(`[ARVehicleView] Rendered AR view for userId: ${userId}, vehicleId: ${vehicleId}`);
      return { sessionId: arSession.id, arModelUrl: arModel.arModelUrl };
    } catch (err) {
      logger.error(`[ARVehicleView] Failed to render AR view for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = ARVehicleView;