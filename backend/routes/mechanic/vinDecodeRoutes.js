/**
 * File: vinDecodeRoutes.js
 * Path: backend/routes/mechanic/vinDecodeRoutes.js
 * Purpose: Mock API route to decode VINs and return basic vehicle details, supporting the VINDecoder.jsx component
 * Author: Cod1 (05051445)
 * Date: May 05, 2025
 * Cod1 Crown Certified
 */

/// --- Dependencies ---
const express = require('express');
const router = express.Router();

/// --- Route Handlers ---

/**
 * GET /api/mechanic/vin/:vin
 * Purpose:
 *   - Mock VIN decoder to simulate decoding VIN into basic vehicle information.
 *
 * Request Parameters:
 *   - req.params.vin (string): VIN number to decode.
 *
 * Response:
 *   - 200 OK: Returns mock decoded vehicle data.
 *   - 400 Bad Request: Returns error if VIN is missing or invalid.
 */
router.get('/vin/:vin', (req, res) => {
  const { vin } = req.params;

  // --- Simple validation ---
  if (!vin || vin.length < 5) {
    return res.status(400).json({ error: 'Invalid VIN provided' });
  }

  // --- Mock VIN decode result ---
  const mockDecodedData = {
    vin,
    make: 'Toyota',
    model: 'Camry',
    year: 2019
  };

  return res.status(200).json(mockDecodedData);
});

/// --- Export Router ---
module.exports = router;
