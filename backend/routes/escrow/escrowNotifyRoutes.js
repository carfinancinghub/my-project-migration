// File: escrowNotifyRoutes.js
// Path: backend/routes/escrow/escrowNotifyRoutes.js
// Author: Cod1 (05051315)

const express = require('express');
const router = express.Router();
const { logger } = require('@utils/logger');

// @route   POST /api/escrow/notify-ready
// @desc    Notify escrow when a vehicle is ready post-repair
// @access  Private (Mocked only)
router.post('/notify-ready', (req, res) => {
  const { vehicleId } = req.body;

  if (!vehicleId) {
    logger.warn('[ESCROW] Missing vehicle ID in notify-ready request');
    return res.status(400).json({ success: false, message: 'Vehicle ID is required' });
  }

  // Simulate response for demo purposes
  const successMock = vehicleId.startsWith('X'); // Mock logic: vehicle IDs starting with 'X' fail

  if (successMock) {
    logger.warn(`[ESCROW] Failed to send notification for vehicle ${vehicleId}`);
    return res.status(500).json({ success: false, message: 'Notification failed for vehicle ID' });
  }

  logger.info(`[ESCROW] Notification sent for vehicle ${vehicleId}`);
  return res.status(200).json({ success: true, message: 'Notification sent to escrow' });
});

module.exports = router;
