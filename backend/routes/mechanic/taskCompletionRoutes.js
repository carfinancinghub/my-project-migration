/**
 * File: taskCompletionRoutes.js
 * Path: backend/routes/mechanic/taskCompletionRoutes.js
 * Purpose: Handle task completion submissions from mechanics
 * Author: Cod1 (05060712)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');

// --- POST /api/mechanic/task-completed ---
/**
 * Endpoint: Mark a mechanic's task as completed
 * Body:
 *   - taskId: string (required)
 *   - mechanicId: string (required)
 *   - timestamp: ISO string (required)
 * Returns:
 *   - 200 OK: Task marked as completed
 *   - 400 Bad Request: Missing fields
 */
router.post('/task-completed', (req, res) => {
  const { taskId, mechanicId, timestamp } = req.body;

  // --- Validation ---
  if (!taskId || !mechanicId || !timestamp) {
    logger.warn('Missing task completion data');
    return res.status(400).json({ error: 'Missing taskId, mechanicId, or timestamp' });
  }

  // --- Simulate DB Update (mocked) ---
  logger.info(`Task ${taskId} marked as completed by ${mechanicId} at ${timestamp}`);

  // --- Return Success Response ---
  return res.status(200).json({
    message: `Task ${taskId} marked as completed`,
    taskId,
    mechanicId,
    timestamp
  });
});

module.exports = router;
