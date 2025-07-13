// File: hashAnchorRoute.js
// Path: backend/routes/hauler/hashAnchorRoute.js
// 👑 Cod1 Certified — Route to Generate SHA256 Hash + Anchor Link

const express = require('express');
const router = express.Router();
const hashAndAnchorPDF = require('../../controllers/hauler/hashAndAnchorPDF');
const authenticate = require('../../middleware/authenticate');

// @route   GET /api/hauler/jobs/:jobId/hash-anchor
// @desc    Generate SHA256 hash + simulated blockchain anchor for delivery report
// @access  Protected
router.get('/jobs/:jobId/hash-anchor', authenticate, hashAndAnchorPDF);

module.exports = router;
