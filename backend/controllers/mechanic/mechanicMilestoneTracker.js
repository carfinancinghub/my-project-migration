/**
 * File: mechanicMilestoneTracker.js
 * Path: backend/controllers/mechanic/mechanicMilestoneTracker.js
 * Purpose: Provides milestone badge data for the mechanic badge timeline system
 * Author: Cod1 (05060823)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 *
 * Features:
 * - Returns mocked badge milestone progress for a given mechanic
 * - Can be extended to fetch real data from DB (e.g., MongoDB)
 * - Designed for integration with MechanicTimelineCelebration.jsx
 */

// --- Dependencies ---
const express = require('express');
const router = express.Router();

// --- Route Handler ---
/**
 * GET /api/mechanic/milestones/:mechanicId
 * Purpose: Returns a list of milestone badge progress for a mechanic
 * Example response:
 *   [
 *     { id: 'badge1', label: 'First Inspection', achieved: true },
 *     { id: 'badge2', label: '5 Tasks Completed', achieved: true },
 *     { id: 'badge3', label: '10 Tasks Completed', achieved: false },
 *   ]
 */
router.get('/milestones/:mechanicId', (req, res) => {
  const { mechanicId } = req.params;

  // Placeholder mock milestone data — replace with DB fetch in production
  const mockMilestones = [
    { id: 'badge1', label: 'First Inspection', achieved: true },
    { id: 'badge2', label: '5 Tasks Completed', achieved: true },
    { id: 'badge3', label: '10 Tasks Completed', achieved: false },
    { id: 'badge4', label: 'Top Rated Repair', achieved: false },
  ];

  res.status(200).json({ mechanicId, milestones: mockMilestones });
});

module.exports = router;
