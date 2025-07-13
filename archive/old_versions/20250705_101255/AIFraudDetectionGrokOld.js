// File: AIFraudDetection.js
// Path: backend/utils/AIFraudDetection.js
// Purpose: Real-time fraud monitoring with user activity analysis
// Author: Cod2
// Date: 2025-04-29
// 👑 Cod2 Crown Certified

const FraudAlert = require('@models/fraud/FraudAlert');
const User = require('@models/User');

const analyzeActivity = (activityLog) => {
  let score = 0;

  if (activityLog.failedLogins > 5) score += 30;
  if (activityLog.accountChanges > 3) score += 20;
  if (activityLog.flaggedTransactions > 0) score += 50;

  return score;
};

const monitorUserForFraud = async (userId, activityLog) => {
  const score = analyzeActivity(activityLog);

  if (score >= 70) {
    const alert = new FraudAlert({ userId, riskScore: score, details: activityLog });
    await alert.save();
    return alert;
  }

  return null;
};

module.exports = { monitorUserForFraud };

