// File: UserManagement.js
// Path: C:\CFH\backend\services\officer\UserManagement.js
// Purpose: Manage user accounts for officers
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const UserManagement = {
  async suspendUser(officerId, userId, reason) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[UserManagement] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserManagement] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      await db.updateUser(userId, { status: 'suspended', suspendedBy: officerId, suspendedAt: new Date().toISOString(), reason });
      logger.info(`[UserManagement] Suspended user for userId: ${userId} by officerId: ${officerId}`);
      return { userId, status: 'suspended', reason };
    } catch (err) {
      logger.error(`[UserManagement] Failed to suspend user for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async reinstateUser(officerId, userId) {
    try {
      const officer = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') {
        logger.error(`[UserManagement] Officer access required for officerId: ${officerId}`);
        throw new Error('Officer access required');
      }

      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[UserManagement] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      if (user.status !== 'suspended') {
        logger.error(`[UserManagement] User is not suspended for userId: ${userId}`);
        throw new Error('User is not suspended');
      }

      await db.updateUser(userId, { status: 'active', reinstatedBy: officerId, reinstatedAt: new Date().toISOString() });
      logger.info(`[UserManagement] Reinstated user for userId: ${userId} by officerId: ${officerId}`);
      return { userId, status: 'reinstated' };
    } catch (err) {
      logger.error(`[UserManagement] Failed to reinstate user for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = UserManagement;