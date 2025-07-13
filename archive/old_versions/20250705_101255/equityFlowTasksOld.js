/**
 * File: equityFlowTasks.js
 * Path: backend/tasks/equityFlowTasks.js
 * Purpose: Background task scheduler for equity flow orchestration
 * Author: Cod3 (05052330)
 * Date: May 05, 2025
 * Cod2 Crown Certified
 */

const cron = require('node-cron');
const {
  predictEscalationRisk,
  checkRoleAlerts,
} = require('@utils/EquityFlowOrchestrator');

// Mock transaction list for testing purposes
const mockTransactions = ['txn101', 'txn102', 'txn103'];

// Schedule to run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('⏳ Running scheduled equity flow tasks...');
  for (const transactionId of mockTransactions) {
    await predictEscalationRisk(transactionId);
    await checkRoleAlerts(transactionId);
  }
});
