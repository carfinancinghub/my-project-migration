/**
 * File: inspectionReportRoutes.js
 * Path: backend/routes/inspection/inspectionReportRoutes.js
 * Purpose: Mock API routes for retrieving inspection reports, supporting InspectionReportViewer.js in the Mechanic role
 * Author: Cod1 (05051430)
 * Date: May 05, 2025
 * Cod1 Crown Certified
 */

/// --- Dependencies ---
const express = require('express');
const router = express.Router();

/// --- Route Handlers ---

/**
 * GET /api/inspection/reports/:id
 * Purpose:
 *   - Mock route to simulate fetching an inspection report by its ID.
 *   - Designed for integration with frontend component InspectionReportViewer.js.
 *
 * Request Parameters:
 *   - req.params.id (string): The unique report ID to query.
 *
 * Response:
 *   - 200 OK: Returns mocked inspection report data if the ID is "123".
 *   - 404 Not Found: Returns error if the ID is anything other than "123".
 */
router.get('/reports/:id', (req, res) => {
  const { id } = req.params;

  // --- Mocked inspection report object ---
  const mockReport = {
    id: id,
    car: {
      make: 'Honda',
      model: 'Accord',
      year: 2003
    },
    mechanic: {
      email: 'mechanic@example.com'
    },
    createdAt: new Date().toISOString(),
    status: 'Completed',
    notes: 'Needs tire replacement and oil change.',
    aiTags: ['Tire Wear', 'Low Oil'],
    photos: [
      'https://cdn.example.com/photos/inspection_1.jpg',
      'https://cdn.example.com/photos/inspection_2.jpg'
    ],
    attachments: [
      { name: 'inspection-summary.pdf', url: 'https://cdn.example.com/docs/summary.pdf' }
    ]
  };

  // --- Error: Simulate "report not found" ---
  if (id !== '123') {
    return res.status(404).json({ error: 'Report not found' });
  }

  // --- Success: Return mocked data ---
  return res.status(200).json(mockReport);
});

/// --- Export Router ---
module.exports = router;
