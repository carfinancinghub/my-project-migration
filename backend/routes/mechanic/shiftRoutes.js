/**
 * File: shiftRoutes.js
 * Path: backend/routes/mechanic/shiftRoutes.js
 * Purpose: Mock API routes for retrieving shift data, supporting MechanicShiftPlanner.jsx in the Mechanic role
 * Author: Cod1 (05051445)
 * Date: May 05, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
const express = require('express');
const router = express.Router();

// --- Route Handlers ---

/**
 * GET /api/mechanic/shifts
 * Purpose:
 *   - Retrieve mock shift assignments for a given mechanic.
 *
 * Request Parameters (Query):
 *   - mechanicId (string): The unique ID of the mechanic requesting shift data.
 *
 * Response:
 *   - 200 OK: Returns a list of mock shift records for the mechanic.
 *   - 400 Bad Request: Returned if mechanicId is missing.
 */
router.get('/shifts', (req, res) => {
  const { mechanicId } = req.query;

  // Validate mechanic ID is present
  if (!mechanicId) {
    return res.status(400).json({ error: 'Mechanic ID required' });
  }

  // --- Mocked shift schedule ---
  const mockShifts = [
    {
      shiftId: 'shift1',
      date: '2025-05-06',
      hours: '08:00-16:00',
      tasks: ['Inspect Vehicle 123', 'Repair Vehicle 456']
    },
    {
      shiftId: 'shift2',
      date: '2025-05-07',
      hours: '09:00-17:00',
      tasks: ['Inspect Vehicle 789']
    }
  ];

  // Send mock shift response
  res.status(200).json(mockShifts);
});

// --- Export Router ---
module.exports = router;
