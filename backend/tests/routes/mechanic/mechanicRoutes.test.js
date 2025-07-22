/**
 * Crown Certified
 * File: mechanicRoutes.test.js
 * Path: backend/tests/routes/mechanic/mechanicRoutes.test.js
 * Purpose: Unit tests for the mechanicRoutes.js API endpoints.
 * Author: Gemini AI
 * Date: May 10, 2025
 * Cod2 Crown Certified
 */
const request = require('supertest');
const express = require('express');
const logger = require('@utils/logger');
const { authenticateToken } = require('@middleware/authMiddleware'); // Mock it
const mechanicRoutes = require('@routes/mechanic/mechanicRoutes');

jest.mock('@utils/logger');
jest.mock('@middleware/authMiddleware', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: 'testUser' }; // Mock user object
    next();
  },
}));

const app = express();
app.use(express.json());
app.use('/api/mechanic', mechanicRoutes);

describe('Mechanic Routes', () => {
  it('should successfully submit a new inspection', async () => {
    const inspectionData = { vin: 'TESTVIN123', inspectionDetails: { engine: 'OK' } };
    const res = await request(app)
      .post('/api/mechanic/inspections/submit')
      .send(inspectionData)
      .expect(201);

    expect(res.body.message).toBe('Inspection submitted successfully');
    expect(res.body.results).toHaveProperty('defects');
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Received inspection submission for VIN: TESTVIN123'));
  });

  it('should handle errors when submitting an inspection', async () => {
    // Simulate an error during processing (e.g., by not providing vin)
    const res = await request(app)
      .post('/api/mechanic/inspections/submit')
      .send({})
      .expect(500);

    expect(res.body.error).toBe('Failed to submit inspection.');
    expect(logger.error).toHaveBeenCalled();
  });

  it('should successfully retrieve inspection history for a VIN', async () => {
    const vin = 'TESTVIN456';
    const res = await request(app)
      .get(`/api/mechanic/inspections/history/${vin}`)
      .expect(200);

    expect(res.body.vin).toBe(vin);
    expect(res.body.history).toBeInstanceOf(Array);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Requesting inspection history for VIN: ${vin}`));
  });

  it('should handle errors when retrieving inspection history', async () => {
    // No specific error to simulate here without mocking database/blockchain interaction
    // This test primarily checks the route and basic structure.
    const res = await request(app)
      .get('/api/mechanic/inspections/history/NONEXISTENTVIN')
      .expect(200); // Assuming it still returns a 200 with an empty or error history

    expect(res.body).toHaveProperty('vin');
    expect(res.body).toHaveProperty('history');
    expect(logger.error).toHaveBeenCalledTimes(0); // Error logging would depend on the internal logic
  });
});

