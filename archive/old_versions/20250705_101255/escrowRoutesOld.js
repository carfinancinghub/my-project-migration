// File: escrowRoutes.js
// Path: backend/routes/escrow/escrowRoutes.js
// Author: Cod2 (05071958)
// Description: Main API routes for escrow workflows

const express = require('express');
const router = express.Router();
const { deposit, release, refund, updateConditions } = require('@/controllers/escrow/EscrowAPIController');

router.post('/:transactionId/deposit', deposit);
router.post('/:transactionId/release', release);
router.post('/:transactionId/refund', refund);
router.post('/:escrowId/update-conditions', updateConditions);

module.exports = router;
