// File: export.js
// Path: backend/routes/hauler/export.js
// 👑 Cod1 Certified — Export Routes for Hauler PDF Report

const express = require('express');
const router = express.Router();
const exportDeliveryPDF = require('../../controllers/hauler/exportDeliveryPDF');
const authenticate = require('../../middleware/authenticate');

// @route   GET /api/hauler/jobs/:jobId/export-pdf
// @desc    Generate and return PDF delivery report
// @access  Protected (Hauler, Admin, Judge)
router.get('/jobs/:jobId/export-pdf', authenticate, exportDeliveryPDF);

module.exports = router;
