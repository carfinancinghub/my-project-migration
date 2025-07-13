// File: exportSignableRoute.js
// Path: backend/routes/hauler/exportSignableRoute.js
// 👑 Cod1 Certified — Export Route for Signable Delivery PDF

const express = require('express');
const router = express.Router();
const generateSignablePDF = require('../../controllers/hauler/generateSignablePDF');
const authenticate = require('../../middleware/authenticate');

// @route   GET /api/hauler/jobs/:jobId/export-signable-pdf
// @desc    Generate PDF with signature-ready lines for hauler, buyer, and escrow officer
// @access  Protected
router.get('/jobs/:jobId/export-signable-pdf', authenticate, generateSignablePDF);

module.exports = router;
