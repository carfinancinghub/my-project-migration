/**
 * File: haulerHealthCheck.test.js
 * Path: backend/routes/hauler/haulerHealthCheck.test.js
 * Purpose: Jest tests for /api/hauler/health endpoint to validate Hauler-related endpoint health checks, including snapshot tests and mock helpers
 * Author: Cod3 (05051645)
 * Date: May 05, 2025
 * 👑 Cod3 Crown Certified
 */

// --- Dependencies ---
const request = require('supertest');
const express = require('express');
const axios = require('axios');
const haulerHealthCheck = require('@routes/hauler/haulerHealthCheck');

jest.mock('axios');

// --- Mock Helpers ---
/**
 * setupAxiosMocks
 * Purpose: Centralize axios mock configuration for health check endpoints
 * Parameters:
 *   - shiftsStatus: Status code for /api/mechanic/shifts (default: 200)
 *   - photosStatus: Status code for /api/inspection/photos (default: 200)
 */
const setupAxiosMocks = (shiftsStatus = 200, photosStatus = 200) => {
  if (shiftsStatus === 200) {
    axios.get.mockResolvedValue({ status: 200 });
  } else {
    axios.get.mockRejectedValue(new Error('Network error'));
  }

  if (photosStatus === 200) {
    axios.post.mockResolvedValue({ status: 200 });
  } else {
    axios.post.mockRejectedValue(new Error('Network error'));
  }
};

// --- Test Setup ---
const app = express();
app.use(express.json());
app.use('/api/hauler', haulerHealthCheck);

beforeEach(() => {
  jest.clearAllMocks();
});

// --- Test Cases ---
describe('GET /api/hauler/health', () => {
  it('returns healthy status when all endpoints are up and matches snapshot', async () => {
    setupAxiosMocks(200, 200);
    const response = await request(app).get('/api/hauler/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
    expect(response.body).toEqual({
      status: 'healthy',
      endpoints: {
        '/api/mechanic/shifts': 'up',
        '/api/inspection/photos': 'up'
      }
    });
  });

  it('returns unhealthy status when /api/mechanic/shifts fails and matches snapshot', async () => {
    setupAxiosMocks(500, 200);
    const response = await request(app).get('/api/hauler/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
    expect(response.body).toEqual({
      status: 'unhealthy',
      endpoints: {
        '/api/mechanic/shifts': 'down',
        '/api/inspection/photos': 'up'
      }
    });
  });

  it('returns unhealthy status when /api/inspection/photos fails', async () => {
    setupAxiosMocks(200, 500);
    const response = await request(app).get('/api/hauler/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'unhealthy',
      endpoints: {
        '/api/mechanic/shifts': 'up',
        '/api/inspection/photos': 'down'
      }
    });
  });

  it('returns unhealthy status when both endpoints fail', async () => {
    setupAxiosMocks(500, 500);
    const response = await request(app).get('/api/hauler/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'unhealthy',
      endpoints: {
        '/api/mechanic/shifts': 'down',
        '/api/inspection/photos': 'down'
      }
    });
  });
});
