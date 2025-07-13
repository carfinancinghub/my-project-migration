/**
 * File: equityFlowTasks.js
 * Path: backend/tasks/equityFlowTasks.js
 * Purpose: Scheduled task runner for evaluating escalation risk, role alerts, and compliance in equity financing flows
 * Author: Cod3 (05090056)
 * Date: May 09, 2025 (Revised)
 * Cod2 Crown Certified
 */

// --- Dependencies ---
const cron = require('node-cron');
const logger = require('@utils/logger');
const {
  predictEscalationRisk,
  checkRoleAlerts,
  ensureBlindPoolCompliance
} = require('@utils/EquityFlowOrchestrator');

// --- Mock Transaction List for Live Test ---
const mockTransactions = [
  { transactionId: 'EQTXN-20250509-001' },
  { transactionId: 'EQTXN-20250509-002' },
  { transactionId: 'EQTXN-20250509-003' }
];

// --- Cron Job: Run every 15 minutes ---
cron.schedule('*/15 * * * *', async () => {
  console.log(`[EquityFlowTasks] ⏱️ Running scheduled equity flow checks @ ${new Date().toLocaleString()}`);
  for (const txn of mockTransactions) {
    try {
      const riskReport = await predictEscalationRisk(txn.transactionId);
      console.log(`[EquityFlowTasks] 🔍 Risk for ${txn.transactionId}:`, riskReport);

      const roleAlerts = await checkRoleAlerts(txn.transactionId);
      console.log(`[EquityFlowTasks] ⚠️ Role alerts for ${txn.transactionId}:`, roleAlerts);

      const compliance = await ensureBlindPoolCompliance(txn.transactionId);
      console.log(`[EquityFlowTasks] 🕵️ Blind pool compliance for ${txn.transactionId}: ${compliance}`);
    } catch (err) {
      logger.error(`[EquityFlowTasks] ❌ Error processing ${txn.transactionId}: ${err.message}`);
    }
  }
});
