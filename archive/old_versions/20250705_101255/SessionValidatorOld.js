// File: SessionValidator.js
// Path: C:\CFH\backend\services\security\SessionValidator.js
// Purpose: Validate user sessions for security
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const SessionValidator = {
  async validateSession(userId, sessionToken) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[SessionValidator] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const session = await db.getSession(userId, sessionToken);
      if (!session) {
        logger.error(`[SessionValidator] Invalid session for userId: ${userId}`);
        throw new Error('Invalid session');
      }

      if (new Date(session.expiresAt) < new Date()) {
        logger.error(`[SessionValidator] Session expired for userId: ${userId}`);
        throw new Error('Session expired');
      }

      logger.info(`[SessionValidator] Validated session for userId: ${userId}`);
      return { valid: true, expiresAt: session.expiresAt };
    } catch (err) {
      logger.error(`[SessionValidator] Failed to validate session for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async invalidateSession(userId, sessionToken) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[SessionValidator] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      await db.invalidateSession(userId, sessionToken);
      logger.info(`[SessionValidator] Invalidated session for userId: ${userId}`);
      return { status: 'invalidated' };
    } catch (err) {
      logger.error(`[SessionValidator] Failed to invalidate session for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = SessionValidator;