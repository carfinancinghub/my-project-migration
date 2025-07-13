// File: EscrowIntegrationTest.js
// Path: backend/tests/escrow/EscrowIntegrationTest.js
// Purpose: Integration tests for escrow APIs (escrowRoutes.js), dashboard features, and premium tools
// Author: Cod2 Crown Certified (05072155)

const request = require('supertest');
const app = require('../../../index'); // Assuming express app is exported from here
const mongoose = require('mongoose');
const EscrowTransaction = require('@models/escrow/EscrowTransaction');

let escrowId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('🚦 Escrow API Integration', () => {
  it('should create a new escrow transaction', async () => {
    const res = await request(app)
      .post('/api/escrow/create')
      .send({
        buyerId: '1234',
        sellerId: '5678',
        amount: 10000,
        dealId: 'auction-test-001'
      })
      .expect(200);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.status).toBe('Pending');
    escrowId = res.body._id;
  });

  it('should retrieve metadata for the created escrow transaction', async () => {
    const res = await request(app)
      .get(`/api/escrow/metadata/${escrowId}`)
      .expect(200);

    expect(res.body.title).toContain('Escrow Transaction');
    expect(res.body).toHaveProperty('description');
  });

  it('should list escrow transactions with search filters', async () => {
    const res = await request(app)
      .get('/api/escrow')
      .query({ dealId: 'auction-test-001' })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].dealId).toBe('auction-test-001');
  });

  it('should export PDF (mocked)', async () => {
    const res = await request(app)
      .get(`/api/escrow/${escrowId}/export-pdf`)
      .expect(200);

    expect(res.headers['content-type']).toBe('application/pdf');
  });
});


