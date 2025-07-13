// File: index.js
// Path: backend/routes/disputes/index.js
// 👑 Cod1 Crown Certified — Dispute Routes

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('@/middleware/authMiddleware'); // ✅ Correct!

const { awardArbitratorBadge } = require('@/controllers/disputes/arbitratorRecognition');
const { voteOnDispute } = require('@/controllers/disputes/votingController');
const { createDispute, getDisputesByUser, getAllDisputes } = require('@/controllers/disputes/disputeFlowController');
const { generateDisputePDF } = require('@/controllers/disputes/disputePdfController');
const { exportCaseBundle } = require('@/controllers/disputes/CaseBundleExporter');
const { uploadEvidenceMiddleware, saveEvidenceToDispute } = require('@/controllers/disputes/evidenceController');

// ✅ authenticateUser all dispute routes with authentication
router.use(authenticateUser);

// 🎖️ Badge recognition
router.post('/recognition', awardArbitratorBadge);

// 🗳️ Arbitrator vote
router.post('/vote', voteOnDispute);

// 📝 Dispute creation and queries
router.post('/create', createDispute);
router.get('/user/:userId', getDisputesByUser);
router.get('/all', getAllDisputes);

// 📄 Export dispute timeline PDF
router.get('/:disputeId/export', generateDisputePDF);

// 📦 Export full case bundle ZIP
router.get('/:disputeId/export/bundle', exportCaseBundle);

// 📤 Upload evidence to dispute
router.post('/:disputeId/evidence', uploadEvidenceMiddleware, saveEvidenceToDispute);

module.exports = router;
