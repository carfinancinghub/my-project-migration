/**
 * File: photoRoutes.js
 * Path: backend/routes/inspection/photoRoutes.js
 * Purpose: Mock API routes for handling photo uploads for inspections,
 *          supporting InspectionPhotoPreviewer.jsx in the Mechanic role
 * Author: Cod1 (05051500)
 * Date: May 05, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
const express = require('express');
const router = express.Router();

// --- Route Handlers ---

/**
 * POST /api/inspection/photos
 * Purpose:
 *   - Handle simulated photo uploads for a given inspection ID.
 *   - Used by InspectionPhotoPreviewer.jsx to test photo submission logic.
 *
 * Request Body:
 *   - inspectionId (string): The ID of the inspection the photos relate to.
 *   - photos (array): Simulated photo file references (e.g., filenames).
 *
 * Response:
 *   - 200 OK: Returns simulated success response with mocked photo URLs.
 *   - 400 Bad Request: Returned if inspectionId or photos array is missing/invalid.
 */
router.post('/photos', (req, res) => {
  const { inspectionId, photos } = req.body;

  // --- Validate inputs ---
  if (!inspectionId || !photos || !Array.isArray(photos) || photos.length === 0) {
    return res.status(400).json({
      error: 'No files uploaded or invalid inspection ID'
    });
  }

  // --- Simulate photo URL creation ---
  const mockPhotoUrls = photos.map((_, index) => `photo${index + 1}.jpg`);

  // --- Send response with mock data ---
  return res.status(200).json({
    message: 'Photos uploaded',
    inspectionId,
    photoUrls: mockPhotoUrls
  });
});

// --- Export Router ---
module.exports = router;
