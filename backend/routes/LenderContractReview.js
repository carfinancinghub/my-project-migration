// File: lenderRoutes.js
// Path: backend/routes/lenderRoutes.js

const express = require('express');
const router = express.Router();
const { getContractsForReview, approveContract, rejectContract } = require('../../controllers/lender/contractReviewController');
const authenticate = require('../../middleware/authenticate');

// GET all contracts pending lender review
router.get('/contracts', authenticate, getContractsForReview);

// POST approve a contract
router.post('/contracts/:id/approve', authenticate, approveContract);

// POST reject a contract
router.post('/contracts/:id/reject', authenticate, rejectContract);

module.exports = router;
