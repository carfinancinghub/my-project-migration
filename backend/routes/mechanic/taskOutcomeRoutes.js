/**
 * File: taskOutcomeRoutes.js
 * Path: backend/routes/mechanic/taskOutcomeRoutes.js
 * Purpose: Handles POST requests for reporting mechanic task outcomes
 * Author: Cod1 (05060839)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
const express = require('express');
const router = express.Router();

// --- Route Handler ---
/**
 * POST /api/mechanic/tasks/report
 * Purpose: Accepts task outcome reports (status + notes) from mechanics
 * Parameters (req.body):
 *   - taskId: string (required)
 *   - status: string ("successful" | "partial" | "failed")
 *   - notes: string (optional)
 * Returns: 200 on success, 400 if missing required fields
 */
router.post('/tasks/report', (req, res) => {
  const { taskId, status, notes } = req.body;

  // Basic validation
  if (!taskId || !status) {
    return res.status(400).json({ error: 'taskId and status are required.' });
  }

  // Mock storing logic
  const taskOutcome = {
    taskId,
    status,
    notes,
    timestamp: new Date().toISOString()
  };

  console.log('Task outcome recorded:', taskOutcome);

  return res.status(200).json({ message: 'Task outcome submitted', taskOutcome });
});

module.exports = router;
