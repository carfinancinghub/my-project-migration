// File: ComplianceEnhancer.js
// Path: C:\CFH\backend\services\operational\ComplianceEnhancer.js
// Purpose: Enhance compliance checks for listings
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const ComplianceEnhancer = {
  async verifyVehicleDetails(vehicleId) {
    try {
      const vehicle = await db.getVehicle(vehicleId);
      if (!vehicle) {
        logger.error(`[ComplianceEnhancer] Vehicle not found for vehicleId: ${vehicleId}`);
        throw new Error('Vehicle not found');
      }

      const issues = [];
      if (!vehicle.vin || vehicle.vin.length !== 17) {
        issues.push('Invalid VIN: Must be 17 characters');
      }
      if (!vehicle.year || vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
        issues.push('Invalid manufacturing year');
      }
      if (!vehicle.mileage || vehicle.mileage < 0) {
        issues.push('Invalid mileage');
      }

      const report = {
        vehicleId,
        isCompliant: issues.length === 0,
        issues
      };

      logger.info(`[ComplianceEnhancer] Verified vehicle details for vehicleId: ${vehicleId}`);
      return report;
    } catch (err) {
      logger.error(`[ComplianceEnhancer] Failed to verify vehicle details for vehicleId ${vehicleId}: ${err.message}`, err);
      throw err;
    }
  },

  async flagNonCompliantVehicle(vehicleId, issue) {
    try {
      const vehicle = await db.getVehicle(vehicleId);
      if (!vehicle) {
        logger.error(`[ComplianceEnhancer] Vehicle not found for vehicleId: ${vehicleId}`);
        throw new Error('Vehicle not found');
      }

      await db.flagVehicle(vehicleId, { issue, flaggedAt: new Date().toISOString() });
      logger.info(`[ComplianceEnhancer] Flagged non-compliant vehicle for vehicleId: ${vehicleId}, issue: ${issue}`);
      return { vehicleId, status: 'flagged', issue };
    } catch (err) {
      logger.error(`[ComplianceEnhancer] Failed to flag non-compliant vehicle for vehicleId ${vehicleId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = ComplianceEnhancer;