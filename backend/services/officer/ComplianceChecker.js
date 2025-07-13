// File: ComplianceChecker.js
// Path: C:\CFH\backend\services\officer\ComplianceChecker.js
// Purpose: Check auction listings for compliance
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const ComplianceChecker = {
  async checkListingCompliance(officerId, auctionId) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[ComplianceChecker] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[ComplianceChecker] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      const complianceIssues = [];
      if (!auction.vehicleDetails || !auction.vehicleDetails.vin) {
        complianceIssues.push('Missing VIN in vehicle details');
      }
      if (!auction.images || auction.images.length === 0) {
        complianceIssues.push('No images provided for listing');
      }
      if (auction.reservePrice <= 0) {
        complianceIssues.push('Invalid reserve price');
      }

      const report = {
        auctionId,
        isCompliant: complianceIssues.length === 0,
        issues: complianceIssues
      };

      logger.info(`[ComplianceChecker] Checked compliance for auctionId: ${auctionId} by officerId: ${officerId}`);
      return report;
    } catch (err) {
      logger.error(`[ComplianceChecker] Failed to check compliance for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  },

  async flagNonCompliantListing(officerId, auctionId, issue) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[ComplianceChecker] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const auction = await db.getAuction(auctionId);
      if (!auction) {
        logger.error(`[ComplianceChecker] Auction not found for auctionId: ${auctionId}`);
        throw new Error('Auction not found');
      }

      await db.flagAuction(auctionId, { flaggedBy: officerId, issue, flaggedAt: new Date().toISOString() });
      logger.info(`[ComplianceChecker] Flagged non-compliant listing for auctionId: ${auctionId} by officerId: ${officerId}`);
      return { auctionId, status: 'flagged', issue };
    } catch (err) {
      logger.error(`[ComplianceChecker] Failed to flag non-compliant listing for auctionId ${auctionId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = ComplianceChecker;