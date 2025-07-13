/**
 * File: judgeApiTests.js
 * Path: backend/tests/judgeApiTests.js
 * Purpose: Test judge API endpoints for judgeRoutes.js using Jest and Supertest
 * Author: SG
 * Date: April 28, 2025
 */

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const Judge = require('@models/judge/Judge'); // Alias for Judge model
const judgeRoutes = require('@routes/judge/judgeRoutes'); // Alias for judge routes
const authMiddleware = require('@middleware/authMiddleware'); // Alias for auth middleware

// Mock the Judge model
jest.mock('@models/judge/Judge');

// Initialize Express app for testing
const app = express();
app.use(express.json());
app.use('/api/judge', judgeRoutes);

describe('Judge API Endpoints', () => {
  // Mock JWT token and judge data
  const mockJudge = {
    _id: '1234567890abcdef12345678',
    name: 'Judge Doe',
    expertise: 'general',
    assignedCases: [],
    currentCaseLoad: 0,
  };
  const mockToken = jwt.sign(
    { userId: mockJudge._id, role: 'judge' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );

  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test GET /api/judge/:judgeId
   * Should retrieve judge profile for authenticated judge
   */
  it('GET /api/judge/:judgeId - should return judge profile', async () => {
    // Mock Judge.findById to return mock judge
    Judge.findById.mockResolvedValue(mockJudge);

    const response = await request(app)
      .get(`/api/judge/${mockJudge._id}`)
      .set('Authorization', `Bearer ${mockToken}`);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockJudge);
    expect(Judge.findById).toHaveBeenCalledWith(mockJudge._id);
  });

  /**
   * Test GET /api/judge/:judgeId - should return 404 if judge not found
   */
  it('GET /api/judge/:judgeId - should return 404 if judge not found', async () => {
    // Mock Judge.findById to return null
    Judge.findById.mockResolvedValue(null);

    const response = await request(app)
      .get(`/api/judge/${mockJudge._id}`)
      .set('Authorization', `Bearer ${mockToken}`);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Judge not found');
  });

  /**
   * Test GET /api/judge/:judgeId - should return 401 if no token provided
   */
  it('GET /api/judge/:judgeId - should return 401 if unauthorized', async () => {
    const response = await request(app).get(`/api/judge/${mockJudge._id}`);

    // Assertions
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });

  /**
   * Test GET /api/judge/:judgeId/arbitrations
   * Should retrieve arbitration cases for authenticated judge
   */
  it('GET /api/judge/:judgeId/arbitrations - should return arbitration cases', async () => {
    const mockArbitrations = [
      { caseId: 'case1', status: 'pending' },
      { caseId: 'case2', status: 'in-progress' },
    ];

    // Mock Judge.findById and Judge.getArbitrations
    Judge.findById.mockResolvedValue(mockJudge);
    Judge.getArbitrations = jest.fn().mockResolvedValue(mockArbitrations);

    const response = await request(app)
      .get(`/api/judge/${mockJudge._id}/arbitrations`)
      .set('Authorization', `Bearer ${mockToken}`);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockArbitrations);
    expect(Judge.getArbitrations).to HasBeenCalledWith(mockJudge._id);
  });

  /**
   * Test POST /api/judge/:judgeId/arbitrations/:caseId
   * Should submit arbitration decision for authenticated judge
   */
  it('POST /api/judge/:judgeId/arbitrations/:caseId - should submit arbitration decision', async () => {
    const mockCaseId = 'case123';
    const mockDecision = {
      decision: 'approved',
      reason: 'Valid evidence provided',
    };
    const mockArbitrationResult = { caseId: mockCaseId, ...mockDecision };

    // Mock Judge.findById and Judge.submitArbitration
    Judge.findById.mockResolvedValue(mockJudge);
    Judge.submitArbitration = jest.fn().mockResolvedValue(mockArbitrationResult);

    const response = await request(app)
      .post(`/api/judge/${mockJudge._id}/arbitrations/${mockCaseId}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send(mockDecision);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Arbitration decision submitted');
    expect(response.body.arbitration).toEqual(mockArbitrationResult);
    expect(Judge.submitArbitration).toHaveBeenCalledWith(mockCaseId, mockJudge._id, mockDecision);
  });

  /**
   * Test POST /api/judge/:judgeId/arbitrations/:caseId - should return 400 if validation fails
   */
  it('POST /api/judge/:judgeId/arbitrations/:caseId - should return 400 if invalid input', async () => {
    const response = await request(app)
      .post(`/api/judge/${mockJudge._id}/arbitrations/case123`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({}); // Missing required fields

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Decision is required');
  });

  /**
   * Test POST /api/judge/:judgeId/vote/:proposalId
   * Should cast vote for authenticated judge
   */
  it('POST /api/judge/:judgeId/vote/:proposalId - should cast vote', async () => {
    const mockProposalId = 'proposal123';
    const mockVote = { vote: 'approve' };
    const mockVoteResult = { proposalId: mockProposalId, vote: 'approve' };

    // Mock Judge.findById and Judge.castVote
    Judge.findById.mockResolvedValue(mockJudge);
    Judge.castVote = jest.fn().mockResolvedValue(mockVoteResult);

    const response = await request(app)
      .post(`/api/judge/${mockJudge._id}/vote/${mockProposalId}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send(mockVote);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Vote cast successfully');
    expect(response.body.vote).toEqual(mockVoteResult);
    expect(Judge.castVote).toHaveBeenCalledWith(mockProposalId, mockJudge._id, mockVote.vote);
  });

  /**
   * Test POST /api/judge/:judgeId/vote/:proposalId - should return 400 if invalid vote
   */
  it('POST /api/judge/:judgeId/vote/:proposalId - should return 400 if invalid vote', async () => {
    const response = await request(app)
      .post(`/api/judge/${mockJudge._id}/vote/proposal123`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ vote: 'invalid' });

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Vote must be approve or reject');
  });

  // Placeholder for PUT /api/judge/:judgeId - Future implementation
  /*
  it('PUT /api/judge/:judgeId - should update judge profile', async () => {
    // Mock Judge.findByIdAndUpdate
    const updatedJudge = { ...mockJudge, name: 'Judge Updated' };
    Judge.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedJudge);

    const response = await request(app)
      .put(`/api/judge/${mockJudge._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ name: 'Judge Updated' });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedJudge);

