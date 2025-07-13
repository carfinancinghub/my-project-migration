// File: judgeRoutes.js
// Path: backend/routes/judge/judgeRoutes.js
// 👑 Cod2 Crown Certified
// Purpose: Define API routes for judge operations
// Author: SG
// Date: April 28, 2025

const express = require('express');
const router = express.Router();

const authMiddleware = require('@middleware/authMiddleware');
const {
  getJudgeProfile,
  getArbitrations,
  submitArbitrationDecision,
  castVote,
} = require('@controllers/JudgeController');

/**
 * @route   GET /api/judge/:judgeId
 * @desc    Retrieve judge profile
 * @access  Private (Judge role)
 */
router.get('/:judgeId', authMiddleware, getJudgeProfile);

/**
 * @route   GET /api/judge/:judgeId/arbitrations
 * @desc    Retrieve arbitration cases assigned to judge
 * @access  Private (Judge role)
 */
router.get('/:judgeId/arbitrations', authMiddleware, getArbitrations);

/**
 * @route   POST /api/judge/:judgeId/arbitrations/:caseId
 * @desc    Submit arbitration decision for a case
 * @access  Private (Judge role)
 */
router.post('/:judgeId/arbitrations/:caseId', authMiddleware, submitArbitrationDecision);

/**
 * @route   POST /api/judge/:judgeId/vote/:proposalId
 * @desc    Cast vote on community proposals
 * @access  Private (Judge role)
 */
router.post('/:judgeId/vote/:proposalId', authMiddleware, castVote);

module.exports = router;

// Cod2 Crown Certified: This route module follows REST best practices,
// uses secure auth middleware, and integrates seamlessly with JudgeController.js.
