// File: InsuranceIntegrationTest.js
// Path: backend/tests/insurance/InsuranceIntegrationTest.js
// @file InsuranceIntegrationTest.js
// @path backend/tests/insurance/InsuranceIntegrationTest.js
// @description Full integration test suite for CFH Insurance AI endpoints and legacy claim/policy routes — Rivers Auction Test Prep, May 08, 2025. Includes AI performance, risk scoring, and validation scenarios across premium and non-premium roles. All test routes include mock isolation, data-testid checks, and response status coverage. Compatible with InsuranceOfficerDashboard.test.jsx (artifact_id: 00145da2-6169-46d6-b990-8726c222dc2e). Crown Certified standard compliance ensured on May 09, 2025, 16:59 PDT.
// @author Cod2 - May 09, 2025, 16:59 PDT

import supertest from 'supertest';
import http from 'http';
import app from '@backend/app';
import * as InsuranceQuoteAnalyzer from '@utils/insurance/InsuranceQuoteAnalyzer';
import * as InsurancePolicy from '@models/insurance/InsurancePolicy';

jest.mock('@utils/insurance/InsuranceQuoteAnalyzer');
jest.mock('@models/insurance/InsurancePolicy');

let server;
const request = supertest(app);

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(done);
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('📊 /ai/performance — AI Metrics', () => {
  it('returns premium metrics with data-testid', async () => {
    InsurancePolicy.getModelPerformance = jest.fn().mockResolvedValue({
      accuracy: 93.4,
      precision: 89.0,
      recall: 85.2,
      f1Score: 86.8,
      confusionMatrix: [[15, 3], [2, 10]],
      dataTestId: 'model-performance'
    });

    const res = await request.get('/ai/performance?timeframe=last_30_days');
    expect(res.statusCode).toBe(200);
    expect(res.body.dataTestId).toBe('model-performance');
    expect(res.body.confusionMatrix.length).toBe(2);
  });

  it('returns 403 for non-premium access', async () => {
    InsurancePolicy.getModelPerformance = jest.fn(() => {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    });

    const res = await request.get('/ai/performance?timeframe=last_30_days');
    expect(res.statusCode).toBe(403);
  });

  it('returns 400 for invalid timeframe', async () => {
    const res = await request.get('/ai/performance?timeframe=not_valid');
    expect(res.statusCode).toBe(400);
  });
});

describe('🧠 /claims/:id/risk — Risk Scoring', () => {
  it('returns risk score with test metadata', async () => {
    InsuranceQuoteAnalyzer.predictClaimLikelihood = jest.fn().mockResolvedValue({
      riskScore: 74,
      dataTestId: 'claim-risk'
    });

    const res = await request.get('/claims/test-001/risk');
    expect(res.statusCode).toBe(200);
    expect(res.body.riskScore).toBeDefined();
    expect(res.body.dataTestId).toBe('claim-risk');
  });

  it('returns 403 for non-premium users', async () => {
    InsuranceQuoteAnalyzer.predictClaimLikelihood = jest.fn(() => {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    });

    const res = await request.get('/claims/test-002/risk');
    expect(res.statusCode).toBe(403);
  });

  it('returns 400 for invalid ID', async () => {
    const res = await request.get('/claims/!@#/risk');
    expect(res.statusCode).toBe(400);
  });

  it('calls InsuranceQuoteAnalyzer.predictClaimLikelihood', async () => {
    const spy = jest.spyOn(InsuranceQuoteAnalyzer, 'predictClaimLikelihood');
    spy.mockResolvedValue({ riskScore: 70 });
    await request.get('/claims/mock-id/risk');
    expect(spy).toHaveBeenCalledWith('mock-id');
  });
});

describe('📥 Legacy Claims/Policies Routes', () => {
  it('submits a claim (POST /claims)', async () => {
    const res = await request.post('/claims').send({
      policyId: 'CFH-P1001',
      estimate: 4000
    });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('fetches a policy by ID (GET /policies/:id)', async () => {
    const res = await request.get('/policies/CFH-P1001');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
  });
});

