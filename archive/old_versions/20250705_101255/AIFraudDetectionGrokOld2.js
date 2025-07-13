// File: AIFraudDetection.js
// Path: backend/utils/AIFraudDetection.js
// Purpose: Real-time fraud monitoring with anomaly detection, insights, and alerts
// Author: Cod2
// Date: 2025-04-29
// 👑 Cod2 Crown Certified

const FraudAlert = require('@models/fraud/FraudAlert');
const axios = require('axios');
const { sendNotification } = require('@utils/notificationDispatcher');

// Simulated fraud patterns for matching (can expand with AI models)
const knownPatterns = ['multiple_accounts', 'suspicious_login', 'rapid_bids', 'duplicate_listings'];

/**
 * Analyze user activity and trigger fraud alerts
 * @param {Object} activityData - Includes userId, actionType, metadata
 */
async function analyzeActivity(activityData) {
  const { userId, actionType, metadata } = activityData;

  const isSuspicious = knownPatterns.includes(actionType) ||
    (metadata?.ip && metadata.ip.startsWith('192.168'));

  if (isSuspicious) {
    const alert = new FraudAlert({
      userId,
      action: actionType,
      metadata,
      severity: 'High',
    });

    await alert.save();
    sendNotification(userId, `⚠️ Suspicious activity detected: ${actionType}`);

    // Optional webhook alert
    if (process.env.FRAUD_ALERT_WEBHOOK) {
      await axios.post(process.env.FRAUD_ALERT_WEBHOOK, alert);
    }
  }
}

module.exports = { analyzeActivity };
