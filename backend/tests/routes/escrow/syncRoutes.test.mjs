// 👑 Crown Certified Test — syncRoutes.test.js
// Path: backend/tests/routes/escrow/syncRoutes.test.js
// Purpose: Test escrow sync routes for database and blockchain logging
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import request from 'supertest';
import express from 'express';
import syncRoutes from '@/routes/escrow/syncRoutes';
import EscrowChainSync from '@/services/escrow/EscrowChainSync';
import logger from '@/utils/logger';

vi.mock('@/services/escrow/EscrowChainSync');
vi.mock('@/utils/logger');

const app = express();
app.use(express.json());
app.use('/api/escrow', syncRoutes);

describe('Escrow Sync Routes', () => {
  const mockActionData = {
    transactionId: 'abc123',
    actionType: 'deposit',
    userId: 'user001',
    metadata: { amount: 5000 },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('POST /api/escrow/sync - database logging (free)', async () => {
    EscrowChainSync.syncEscrowAction.mockResolvedValue({ logged: true });
    const response = await request(app)
      .post('/api/escrow/sync')
      .send({ actionData: mockActionData, isPremium: false });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(EscrowChainSync.syncEscrowAction).toHaveBeenCalled();
  });

  test('POST /api/escrow/sync - blockchain logging (premium)', async () => {
    EscrowChainSync.syncToBlockchain.mockResolvedValue({ hash: '0xdef456' });
    const response = await request(app)
      .post('/api/escrow/sync')
      .send({ actionData: mockActionData, isPremium: true });

    expect(response.status).toBe(200);
    expect(response.body.data.hash).toBe('0xdef456');
  });

  test('GET /api/escrow/status/:id - with and without premium', async () => {
    EscrowChainSync.getEscrowStatus.mockResolvedValue({ status: 'released' });
    EscrowChainSync.getBlockchainAuditTrail.mockResolvedValue({ trail: [] });

    const res = await request(app)
      .get('/api/escrow/status/abc123')
      .query({ isPremium: true });

    expect(res.status).toBe(200);
    expect(res.body.data.status.status).toBe('released');
    expect(res.body.data.auditTrail).toBeDefined();
  });

  test('Handles sync error and logs it', async () => {
    EscrowChainSync.syncEscrowAction.mockRejectedValue(new Error('db failed'));
    const res = await request(app)
      .post('/api/escrow/sync')
      .send({ actionData: mockActionData });

    expect(res.status).toBe(500);
    expect(logger.error).toHaveBeenCalled();
  });

  test('Handles status fetch error and logs it', async () => {
    EscrowChainSync.getEscrowStatus.mockRejectedValue(new Error('not found'));
    const res = await request(app).get('/api/escrow/status/invalid');

    expect(res.status).toBe(500);
    expect(logger.error).toHaveBeenCalled();
  });
});
