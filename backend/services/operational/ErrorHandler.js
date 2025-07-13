// File: ErrorHandler.js
// Path: C:\CFH\backend\services\operational\ErrorHandler.js
// Purpose: Centralized error handling for the platform
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/db

const logger = require('@utils/logger');
const db = require('@services/db');

const ErrorHandler = {
  async handleError(error, context) {
    try {
      const errorDetails = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString()
      };

      await db.logError(errorDetails);
      logger.error(`[ErrorHandler] Handled error: ${error.message}`, errorDetails);
      return { status: 'error', message: error.message };
    } catch (logErr) {
      logger.error(`[ErrorHandler] Failed to log error: ${logErr.message}`, logErr);
      return { status: 'error', message: 'Failed to handle error' };
    }
  },

  async getErrorLogs(startDate, endDate) {
    try {
      const errors = await db.getErrorLogs(startDate, endDate);
      if (!errors || errors.length === 0) {
        logger.error(`[ErrorHandler] No error logs found for date range ${startDate} to ${endDate}`);
        throw new Error('No error logs found');
      }

      logger.info(`[ErrorHandler] Retrieved error logs for date range ${startDate} to ${endDate}`);
      return errors.map(err => ({
        message: err.message,
        context: err.context,
        timestamp: err.timestamp
      }));
    } catch (err) {
      logger.error(`[ErrorHandler] Failed to retrieve error logs: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = ErrorHandler;