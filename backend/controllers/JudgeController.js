// File: JudgeController.js
// Path: backend/controllers/judge/JudgeController.js
// 👑 Cod2 Crown Certified
// Purpose: Manage judge operations including arbitration and voting for dispute resolution
// Author: SG
// Date: April 28, 2025

const Judge = require('@models/judge/Judge'); // Judge model
const asyncHandler = require('express-async-handler'); // Middleware for async error handling
const authMiddleware = require('@middleware/authMiddleware'); // JWT-based auth
const { body, validationResult } = require('express-validator'); // Input validation

// @desc    Get judge profile
// @route   GET /api/judge/:judgeId
// @access  Private (Judge)
const getJudgeProfile = [
  authMiddleware,
  asyncHandler(async (req, res) => {
    const judge = await Judge.findById(req.params.judgeId).select('-password');
    if (!judge) {
      res.status(404);
      throw new Error('Judge not found');
    }
    res.status(200).json(judge);
  }),
];

// @desc    Get arbitration cases assigned to judge
// @route   GET /api/judge/:judgeId/arbitrations
// @access  Private (Judge)
const getArbitrations = [
  authMiddleware,
  asyncHandler(async (req, res) => {
    const judge = await Judge.findById(req.params.judgeId);
    if (!judge) {
      res.status(404);
      throw new Error('Judge not found');
    }

    const arbitrations = await Judge.getArbitrations(req.params.judgeId);
    res.status(200).json(arbitrations);
  }),
];

// @desc    Submit arbitration decision
// @route   POST /api/judge/:judgeId/arbitrations/:caseId
// @access  Private (Judge)
const submitArbitrationDecision = [
  authMiddleware,
  body('decision').notEmpty().withMessage('Decision is required'),
  body('reason').notEmpty().withMessage('Reason is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array().map(err => err.msg).join(', '));
    }

    const { decision, reason } = req.body;
    const { judgeId, caseId } = req.params;

    const judge = await Judge.findById(judgeId);
    if (!judge) {
      res.status(404);
      throw new Error('Judge not found');
    }

    const arbitration = await Judge.submitArbitration(caseId, judgeId, { decision, reason });
    if (!arbitration) {
      res.status(404);
      throw new Error('Arbitration case not found or not assigned to judge');
    }

    res.status(200).json({ message: 'Arbitration decision submitted', arbitration });
  }),
];

// @desc    Cast vote on community proposals
// @route   POST /api/judge/:judgeId/vote/:proposalId
// @access  Private (Judge)
const castVote = [
  authMiddleware,
  body('vote').isIn(['approve', 'reject']).withMessage('Vote must be "approve" or "reject"'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array().map(err => err.msg).join(', '));
    }

    const { vote } = req.body;
    const { judgeId, proposalId } = req.params;

    const judge = await Judge.findById(judgeId);
    if (!judge) {
      res.status(404);
      throw new Error('Judge not found');
    }

    const voteResult = await Judge.castVote(proposalId, judgeId, vote);
    if (!voteResult) {
      res.status(404);
      throw new Error('Proposal not found or judge not authorized to vote');
    }

    res.status(200).json({ message: 'Vote cast successfully', vote });
  }),
];

module.exports = {
  getJudgeProfile,
  getArbitrations,
  submitArbitrationDecision,
  castVote,
};
