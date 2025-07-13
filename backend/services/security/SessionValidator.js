// File: SessionValidator.js
// Path: C:\CFH\backend\services\security\SessionValidator.js
// Purpose: Validate user sessions and enforce security (Updated for MFA and suspicious login detection)
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
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
      if (!session || session.expires < new Date()) {
        logger.error(`[SessionValidator] Invalid or expired session for userId: ${userId}`);
        throw new Error('Invalid or expired session');
      }

      logger.info(`[SessionValidator] Validated session for userId: ${userId}`);
      return { status: 'valid' };
    } catch (err) {
      logger.error(`[SessionValidator] Failed to validate session for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async requireMFA(userId, action) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[SessionValidator] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const sensitiveActions = ['place_bid', 'initiate_payment', 'update_profile'];
      if (sensitiveActions.includes(action)) {
        const mfaStatus = await db.getMFAStatus(userId);
        if (!mfaStatus || !mfaStatus.verified) {
          logger.warn(`[SessionValidator] MFA required for action ${action} by userId: ${userId}`);
          throw new Error('MFA required for this action');
        }
      }

      logger.info(`[SessionValidator] MFA check passed for userId: ${userId}, action: ${action}`);
      return { status: 'passed' };
    } catch (err) {
      logger.error(`[SessionValidator] Failed to require MFA for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  },

  async detectSuspiciousLogin(userId, loginDetails) {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        logger.error(`[SessionValidator] User not found for userId: ${userId}`);
        throw new Error('User not found');
      }

      const lastLogin = await db.getLastLogin(userId);
      const isSuspicious = lastLogin && (
        lastLogin.device !== loginDetails.device ||
        lastLogin.location !== loginDetails.location ||
        (new Date() - new Date(lastLogin.timestamp)) < 300000 // 5 minutes
      );

      if (isSuspicious) {
        await db.lockAccount(userId);
        await db.notifyUser(userId, { type: 'suspicious_login', details: loginDetails });
        logger.warn(`[SessionValidator] Suspicious login detected for userId: ${userId}`);
        throw new Error('Suspicious login detected. Account locked.');
      }

      await db.logLogin(userId, loginDetails);
      logger.info(`[SessionValidator] Login validated for userId: ${userId}`);
      return { status: 'valid' };
    } catch (err) {
      logger.error(`[SessionValidator] Failed to detect suspicious login for userId ${userId}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = SessionValidator;