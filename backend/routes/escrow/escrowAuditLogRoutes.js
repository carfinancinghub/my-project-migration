// File: escrowAuditLogRoutes.js
// Path: backend/routes/escrow/escrowAuditLogRoutes.js
// Author: Cod2 (05071955)
// Description: Express routes for fetching audit logs for escrow transactions

const express = require('express');
const router = express.Router();

// Mock audit log store
const mockAuditLogs = {
  'tx123': [
    { actor: 'admin@cfh.com', action: 'Released funds', timestamp: '2025-05-06 14:32' },
    { actor: 'system', action: 'Checklist completed', timestamp: '2025-05-06 14:30' }
  ]
};

router.get('/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const logs = mockAuditLogs[transactionId] || [];
  res.json({ auditLog: logs });
});

module.exports = router;
