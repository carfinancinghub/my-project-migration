/**
 * File: missionRoutes.js
 * Path: backend/routes/hauler/missionRoutes.js
 * Purpose: Mock API routes for retrieving Hauler mission data, supporting HaulerMissionsEngine.js
 * Author: Cod3 (05051715)
 * Date: May 05, 2025
 * 👑 Cod2 Crown Certified
 */

// --- Dependencies ---
const express = require('express');
const router = express.Router();

// --- Route Handlers ---
/**
 * GET /api/hauler/missions
 * Purpose: Mock endpoint to retrieve Hauler mission data
 * Parameters:
 *   - req.query.haulerId: Hauler ID (string, required)
 * Returns:
 *   - 200: Success response with mission data
 *   - 400: Error response if hauler ID is missing
 */
router.get('/missions', (req, res) => {
  const { haulerId } = req.query;

  // Validate hauler ID
  if (!haulerId) {
    return res.status(400).json({ error: 'Hauler ID required' });
  }

  // Mock mission data
  const mockMissions = [
    {
      missionId: 'mission1',
      title: 'Deliver Vehicle 123',
      xpReward: 50,
      status: 'active'
    },
    {
      missionId: 'mission2',
      title: 'Transport Vehicle 456',
      xpReward: 75,
      status: 'pending'
    }
  ];

  // Return mock mission data
  res.status(200).json(mockMissions);
});

// --- Error Handling ---
// Add middleware for unhandled errors if needed

module.exports = router;
