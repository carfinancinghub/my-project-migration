// File: loanMatchRoutes.js
// Path: backend/routes/lender/loanMatchRoutes.js
// 👑 Cod1 Crown Certified — Smart Lender Match API

const express = require('express');
const router = express.Router();
const LoanRequest = require('@/models/loan/LoanRequest');
const Lender = require('@/models/lender/Lender');
const { matchLendersToLoan } = require('@/utils/LoanMatchEngine');
const { authenticateUser } = require('@/middleware/authMiddleware');

router.get('/:loanId', authenticateUser, async (req, res) => {
  try {
    const loan = await LoanRequest.findById(req.params.loanId);
    if (!loan) return res.status(404).json({ message: 'Loan request not found' });

    const lenders = await Lender.find({ status: 'approved' });

    const matches = matchLendersToLoan(loan, lenders);

    res.json(matches);
  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({ message: 'Server error during matching' });
  }
});

module.exports = router;
