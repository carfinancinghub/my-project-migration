// File: loanAiApprovalRoutes.js
// Path: backend/routes/lender/loanAiApprovalRoutes.js
// 👑 Cod1 Crown Certified Route for AI Approval Logic

const express = require('express');
const router = express.Router();
const { evaluateLoanBid } = require('../../controllers/lender/loanAiApprovalController');

// Route: POST /api/lender/loan-eval
// Description: Accepts a bid payload and returns an AI-generated evaluation
router.post('/loan-eval', async (req, res) => {
  try {
    const bid = req.body;
    const result = evaluateLoanBid(bid);
    res.json(result);
  } catch (error) {
    console.error('Loan evaluation error:', error);
    res.status(500).json({ message: 'Failed to evaluate bid' });
  }
});

module.exports = router;
