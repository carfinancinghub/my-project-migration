// 👑 Crown Certified Test Suite — escrowRoutes.test.js
// Path: backend/tests/routes/escrow/escrowRoutes.test.js
// Purpose: Validate routing logic of escrowRoutes.js for Escrow Chain Sync module
// Author: Rivers Auction Team — Date: May 17, 2025

const request = require('supertest');
const express = require('express');
const router = require('@routes/escrow/escrowRoutes');
const logger = require('@utils/logger');

jest.mock('@services/escrow/EscrowChainSync');
jest.mock('@services/notification/WebSocketService');
jest.mock('@routes/escrow/sync');
jest.mock('@routes/escrow/escrowAuditLogRoutes');
jest.mock('@routes/escrow/escrowNotifyRoutes');
jest.mock('@routes/escrow/escrowPaymentRoutes');

const app = express();
app.use(express.json());
app.use('/api/escrow', router);

describe('🧪 escrowRoutes.js — Routing & Gating', () => {
  test('Routes POST /sync to sync.js correctly', async () => {
    const res = await request(app).post('/api/escrow/sync').send({});
    expect(res.statusCode).not.toBe(404);
  });

  test('Routes POST /audit/log to escrowAuditLogRoutes.js correctly', async () => {
    const res = await request(app).post('/api/escrow/audit/log').send({});
    expect(res.statusCode).not.toBe(404);
  });

  test('Routes POST /notify/deposit to escrowNotifyRoutes.js correctly', async () => {
    const res = await request(app).post('/api/escrow/notify/deposit').send({});
    expect(res.statusCode).not.toBe(404);
  });

  test('Routes POST /pay/initiate to escrowPaymentRoutes.js correctly', async () => {
    const res = await request(app).post('/api/escrow/pay/initiate').send({});
    expect(res.statusCode).not.toBe(404);
  });

  test('Handles 400 error for malformed input', async () => {
    const res = await request(app).post('/api/escrow/sync').send(null);
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('Handles 403 for non-premium access to gated features', async () => {
    const res = await request(app).get('/api/escrow/audit/auditTrail?isPremium=false');
    expect(res.statusCode).toBeGreaterThanOrEqual(403);
  });

  test('Handles 500 server errors gracefully', async () => {
    const syncMock = require('@routes/escrow/sync');
    syncMock.post = jest.fn((_, res) => {
      throw new Error('Simulated failure');
    });
    const result = await request(app).post('/api/escrow/sync').send({});
    expect([500, 400]).toContain(result.statusCode);
  });
});


