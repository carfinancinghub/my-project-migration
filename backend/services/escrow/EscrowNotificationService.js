```
// 👑 Crown Certified Service — EscrowNotificationService.js
// Path: backend/services/escrow/EscrowNotificationService.js
// Purpose: Manages notifications for escrow transaction events, integrating with notification routes.
// Author: Rivers Auction Team — May 16, 2025

const Escrow = require('@models/Escrow');
const NotificationQueue = require('@services/notification/NotificationQueue');
const logger = require('@utils/logger');

/**
 * Sends a notification for an escrow event
 * @param {string} transactionId
 * @param {Object} notification - { type, recipientId, message }
 * @returns {Object} - { data: notification record }
 */
async function sendNotification(transactionId, notification) {
  try {
    const { type, recipientId, message } = notification;
    if (!transactionId || !type || !recipientId || !message) {
      throw new Error('Missing required fields');
    }

    const escrow = await Escrow.findOne({ transactionId });
    if (!escrow) {
      throw new Error('Escrow record not found');
    }

    const notificationRecord = {
      transactionId,
      type,
      recipientId,
      message,
      status: 'queued',
      createdAt: new Date(),
    };

    await NotificationQueue.enqueue(notificationRecord);
    logger.info(`Notification queued for ${transactionId}: ${type}`);
    return { data: notificationRecord };
  } catch (err) {
    logger.error(`Failed to send notification for ${transactionId}`, err);
    throw new Error('Notification send failed');
  }
}

/**
 * Retrieves notification history for a transaction
 * @param {string} transactionId
 * @returns {Object} - { data: notification records }
 */
async function getNotificationHistory(transactionId) {
  try {
    if (!transactionId) {
      throw new Error('Transaction ID required');
    }

    const notifications = await NotificationQueue.getHistory(transactionId);
    logger.info(`Retrieved notification history for ${transactionId}`);
    return { data: notifications };
  } catch (err) {
    logger.error(`Failed to fetch notification history for ${transactionId}`, err);
    throw new Error('Notification history retrieval failed');
  }
}

module.exports = {
  sendNotification,
  getNotificationHistory,
};

/*
Functions Summary:
- sendNotification
  - Purpose: Send a notification for an escrow event
  - Input: transactionId (string), notification { type, recipientId, message }
  - Output: { data: notification record }
- getNotificationHistory
  - Purpose: Retrieve notification history for a transaction
  - Input: transactionId (string)
  - Output: { data: notification records }
- Dependencies: @models/Escrow, @services/notification/NotificationQueue, @utils/logger
*/
```