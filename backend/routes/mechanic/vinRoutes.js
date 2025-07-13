/**
 * File: vinRoutes.js
 * Path: backend/routes/mechanic/vinRoutes.js
 * Purpose: Express routes for VIN decoding in the Mechanic role
 * Author: Cod1 (05052350)
 * Date: May 05, 2025
 * Cod2 Crown Certified
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/mechanic/vin-decode/:vin
 * Purpose: Decodes a VIN and returns mock vehicle details
 */
router.get('/vin-decode/:vin', (req, res) => {
  const { vin } = req.params;

  // Return mocked vehicle details
  res.status(200).json({
    vin,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    condition: 'Good',
    equityValue: 15000
  });
});

module.exports = router;
