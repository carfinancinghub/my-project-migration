// File: insuranceRoutes.js
// Path: backend/routes/insuranceRoutes.js
// @file insuranceRoutes.js
// @path backend/routes/insuranceRoutes.js
// @description Defines Insurance role routes including AI performance metrics, claim risk scoring, and standard insurance endpoints for the Car Financing Hub test prep on May 08, 2025
// @author Cod2 - May 09, 2025, 01:00 PDT

import express from 'express';
import Joi from 'joi';
import { getModelPerformance, getClaimRisk } from '@controllers/insurance/InsuranceAIController';
import { submitClaim, getClaimById } from '@controllers/insurance/InsuranceClaimsController';
import { createPolicy, getPolicyById } from '@controllers/insurance/InsurancePolicyController';

const router = express.Router();

/**
 * @wow Routes for AI model performance, risk scoring, and core insurance operations
 */

// GET /ai/performance - Returns AI model metrics (premium-enabled)
router.get('/ai/performance', async (req, res) => {
  try {
    await getModelPerformance(req, res);
  } catch (err) {
    console.error('[route:/ai/performance]', err.message);
    res.status(500).json({ error: 'Internal route error' });
  }
});

// GET /claims/:id/risk - Returns risk score for a given claim (premium-required)
router.get('/claims/:id/risk', async (req, res, next) => {
  const schema = Joi.object({ id: Joi.string().required() });
  const { error } = schema.validate(req.params);
  if (error) return res.status(400).json({ error: 'Invalid claim ID format' });
  try {
    await getClaimRisk(req, res);
  } catch (err) {
    console.error('[route:/claims/:id/risk]', err.message);
    res.status(500).json({ error: 'Internal route error' });
  }
});

// POST /claims - Submit new insurance claim
router.post('/claims', async (req, res) => {
  try {
    await submitClaim(req, res);
  } catch (err) {
    console.error('[route:/claims]', err.message);
    res.status(500).json({ error: 'Failed to submit claim' });
  }
});

// GET /claims/:id - Retrieve insurance claim by ID
router.get('/claims/:id', async (req, res) => {
  try {
    await getClaimById(req, res);
  } catch (err) {
    console.error('[route:/claims/:id]', err.message);
    res.status(500).json({ error: 'Failed to retrieve claim' });
  }
});

// POST /policies - Create new insurance policy
router.post('/policies', async (req, res) => {
  try {
    await createPolicy(req, res);
  } catch (err) {
    console.error('[route:/policies]', err.message);
    res.status(500).json({ error: 'Failed to create policy' });
  }
});

// GET /policies/:id - Get policy by ID
router.get('/policies/:id', async (req, res) => {
  try {
    await getPolicyById(req, res);
  } catch (err) {
    console.error('[route:/policies/:id]', err.message);
    res.status(500).json({ error: 'Failed to retrieve policy' });
  }
});

export default router;
