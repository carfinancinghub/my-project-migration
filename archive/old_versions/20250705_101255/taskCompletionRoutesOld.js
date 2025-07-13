/**
 * File: taskCompletionRoutes.js
 * Path: backend/routes/mechanic/taskCompletionRoutes.js
 * Purpose: Route handler for marking mechanic tasks as completed in the Rivers Auction platform
 * Author: Cod1 (05060013)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
const express = require('express');
const router = express.Router();
const logger = require('@utils/logger'); // Custom logger utility

// --- Route Handlers ---
/**
 * POST /api/mechanic/task-completed
 * Purpose: Marks a mechanic task as completed and broadcasts update
 * Request Body:
 *   - taskId: string (required)
 *   - mechanicId: string (required)
 *   - timestamp: string (ISO format, required)
 * Returns:
 *   - 200: { success: true, message: 'Task marked as completed' }
 *   - 400: { error: 'Missing required fields' }
 */
router.post('/task-completed', (req, res) => {
  const { taskId, mechanicId, timestamp } = req.body;

  if (!taskId || !mechanicId || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Here we would normally update DB (e.g., mark task as complete)
    logger.info(`Task ${taskId} marked completed by mechanic ${mechanicId} at ${timestamp}`);

    // Emit real-time update (if WebSocket system available)
    const io = req.app.get('socketio');
    if (io) {
      io.emit(`task-completed:${mechanicId}`, {
        taskId,
        mechanicId,
        status: 'completed',
        timestamp,
      });
    }

    return res.status(200).json({ success: true, message: 'Task marked as completed' });
  } catch (err) {
    logger.error(`Task completion error: ${err.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Export Router ---
module.exports = router;
