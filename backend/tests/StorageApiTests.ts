/**
 * © 2025 CFH, All Rights Reserved
 * File: StorageApiTests.ts
 * Path: backend/tests/StorageApiTests.ts
 * Purpose: Test storage API endpoints for storageRoutes.ts using Jest and Supertest
 * Author: Cod1 Team
 * Date: 2025-07-18 [0815]
 * Version: 1.0.2 // bumped for improvements
 * Version ID: 5g4f3d2s1a0p9o8i7u6y5t4r3e2w1q0z
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: 5g4f3d2s1a0p9o8i7u6y5t4r3e2w1q0z
 * Save Location: backend/tests/StorageApiTests.ts
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed mocks and responses
 * - Tests: 404, 400, auth failures (401/403), JWT edge cases, input validation, CRUD flows
 * - Placeholders for rate-limit, analytics (Premium), and audit (Wow++)
 * - Uses supertest with Express app instance and auth middleware
 * - Suggest: Add multi-tenant/large file/analytics once backend supports it
 * - DRY: Move repeated mock setups to test utils if reused elsewhere
 */

import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import Storage from '@models/storage/Storage';
import storageRoutes from '@routes/storage/storageRoutes';
// import authMiddleware from '@middleware/authMiddleware'; // Route uses its own, already attached

jest.mock('@models/storage/Storage');

const app = express();
app.use(express.json());
app.use('/api/storage', storageRoutes);

describe('Storage API Endpoints', () => {
  const mockHost = {
    _id: '1234567890abcdef12345678',
    name: 'Storage Host A',
    capacity: 1000,
    location: 'New York',
    status: 'active',
  };
  const jwtSecret = process.env.JWT_SECRET || 'secret';
  const mockToken = jwt.sign(
    { userId: mockHost._id, role: 'host' },
    jwtSecret,
    { expiresIn: '1h' }
  );
  const adminToken = jwt.sign(
    { userId: 'admin123', role: 'admin' },
    jwtSecret,
    { expiresIn: '1h' }
  );
  const wrongRoleToken = jwt.sign(
    { userId: mockHost._id, role: 'guest' },
    jwtSecret,
    { expiresIn: '1h' }
  );
  const expiredToken = jwt.sign(
    { userId: mockHost._id, role: 'host' },
    jwtSecret,
    { expiresIn: -1 }
  );
  const invalidToken = mockToken.slice(0, -1) + 'X';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/storage/:hostId - returns storage host profile', async () => {
    (Storage.findById as jest.Mock).mockResolvedValue(mockHost);
    const response = await request(app)
      .get(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${mockToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockHost);
    expect(Storage.findById).toHaveBeenCalledWith(mockHost._id);
  });

  it('GET /api/storage/:hostId - 404 if host not found', async () => {
    (Storage.findById as jest.Mock).mockResolvedValue(null);
    const response = await request(app)
      .get(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${mockToken}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Storage host not found');
  });

  it('GET /api/storage/:hostId - 401 if unauthorized', async () => {
    const response = await request(app).get(`/api/storage/${mockHost._id}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });

  it('GET /api/storage/:hostId - 401 if token expired', async () => {
    const response = await request(app)
      .get(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${expiredToken}`);
    expect([401, 403]).toContain(response.status);
  });

  it('GET /api/storage/:hostId - 401 if token is invalid', async () => {
    const response = await request(app)
      .get(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${invalidToken}`);
    expect([401, 403]).toContain(response.status);
  });

  it('GET /api/storage/:hostId - 403 if wrong role', async () => {
    const response = await request(app)
      .get(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${wrongRoleToken}`);
    expect([401, 403]).toContain(response.status);
  });

  it('POST /api/storage/:hostId - creates new storage resource', async () => {
    const newResource = { name: 'Storage Unit B', capacity: 500, location: 'Boston' };
    const createdResource = { _id: '9876543210fedcba09876543', ...newResource };
    (Storage.create as jest.Mock).mockResolvedValue(createdResource);

    const response = await request(app)
      .post(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send(newResource);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdResource);
    expect(Storage.create).toHaveBeenCalledWith({ ...newResource, hostId: mockHost._id });
  });

  it('POST /api/storage/:hostId - 400 if invalid input', async () => {
    const invalidResource = { name: '' };
    const response = await request(app)
      .post(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send(invalidResource);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Name is required');
  });

  it('PUT /api/storage/:hostId - updates storage host profile', async () => {
    const updatedData = { name: 'Updated Storage Host', capacity: 1500 };
    const updatedHost = { ...mockHost, ...updatedData };
    (Storage.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedHost);

    const response = await request(app)
      .put(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedHost);
    expect(Storage.findByIdAndUpdate).toHaveBeenCalledWith(
      mockHost._id, updatedData, { new: true }
    );
  });

  it('PUT /api/storage/:hostId - 404 if host not found', async () => {
    (Storage.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ name: 'Updated Host' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Storage host not found');
  });

  it('DELETE /api/storage/:hostId - deletes storage host', async () => {
    (Storage.findByIdAndDelete as jest.Mock).mockResolvedValue(mockHost);

    const response = await request(app)
      .delete(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Storage host deleted');
    expect(Storage.findByIdAndDelete).toHaveBeenCalledWith(mockHost._id);
  });

  it('DELETE /api/storage/:hostId - 404 if host not found', async () => {
    (Storage.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .delete(`/api/storage/${mockHost._id}`)
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Storage host not found');
  });

  // Rate-limit: Placeholder (requires backend support for real test)
  it.skip('POST /api/storage/:hostId - should rate-limit if too many requests', async () => {
    // Simulate flooding endpoint; backend must support rate-limit first.
    expect(true).toBe(true);
  });

  // Premium: Analytics (upload/download), audit logs, etc.
  // Wow++: AI-based storage scaling, dynamic pricing, compliance logs (future test cases).
});

/**
 * Cod1+ Crown Certified.
 * - Free: Core CRUD and access control.
 * - Premium: Analytics, export, advanced validations.
 * - Wow++: AI-driven scaling, audit log checks, multi-tenancy.
 * For future: add E2E tests for large file uploads, S3/Blob integrations, and tier-based features.
 */
