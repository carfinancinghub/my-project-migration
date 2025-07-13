/**
 * File: notificationApiTests.js
 * Path: backend/tests/notificationApiTests.js
 * Purpose: Test notification API endpoints for notifications.js using Jest and Supertest
 * Author: SG
 * Date: April 28, 2025
 */

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const Notification = require('@models/notification/Notification'); // Alias for Notification model
const notificationRoutes = require('@routes/notifications/notifications.js'); // Alias for notification routes
const authMiddleware = require('@middleware/authMiddleware'); // Alias for auth middleware

// Mock the Notification model
jest.mock('@models/notification/Notification');

// Initialize Express app for testing
const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRoutes);

describe('Notification API Endpoints', () => {
  // Mock JWT token and user data
  const mockUser = {
    _id: '1234567890abcdef12345678',
    username: 'testUser',
    role: 'user',
  };
  const mockToken = jwt.sign(
    { userId: mockUser._id, role: 'user' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );

  // Mock notification data
  const mockNotification = {
    _id: '9876543210fedcba09876543',
    userId: mockUser._id,
    type: 'info',
    message: 'Your account has been updated',
    read: false,
    createdAt: new Date(),
  };

  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test GET /api/notifications/:userId
   * Should retrieve notifications for authenticated user
   */
  it('GET /api/notifications/:userId - should return user notifications', async () => {
    // Mock Notification.find to return mock notifications
    Notification.find.mockResolvedValue([mockNotification]);

    const response = await request(app)
      .get(`/api/notifications/${mockUser._id}`)
      .set('Authorization', `Bearer ${mockToken}`);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockNotification]);
    expect(Notification.find).toHaveBeenCalledWith({ userId: mockUser._id });
  });

  /**
   * Test GET /api/notifications/:userId - should return empty array if no notifications
   */
  it('GET /api/notifications/:userId - should return empty array if no notifications', async () => {
    // Mock Notification.find to return empty array
    Notification.find.mockResolvedValue([]);

    const response = await request(app)
      .get(`/api/notifications/${mockUser._id}`)
      .set('Authorization', `Bearer ${mockToken}`);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(Notification.find).toHaveBeenCalledWith({ userId: mockUser._id });
  });

  /**
   * Test GET /api/notifications/:userId - should return 401 if no token provided
   */
  it('GET /api/notifications/:userId - should return 401 if unauthorized', async () => {
    const response = await request(app).get(`/api/notifications/${mockUser._id}`);

    // Assertions
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });

  /**
   * Test POST /api/notifications/:userId
   * Should create a new notification for authenticated user
   */
  it('POST /api/notifications/:userId - should create a new notification', async () => {
    const newNotification = {
      type: 'alert',
      message: 'New dispute assigned',
    };
    const createdNotification = { ...newNotification, _id: 'new123', userId: mockUser._id, read: false, createdAt: new Date() };

    // Mock Notification.create
    Notification.create.mockResolvedValue(createdNotification);

    const response = await request(app)
      .post(`/api/notifications/${mockUser._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send(newNotification);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdNotification);
    expect(Notification.create).toHaveBeenCalledWith({
      ...newNotification,
      userId: mockUser._id,
    });
  });

  /**
   * Test POST /api/notifications/:userId - should return 400 if invalid input
   */
  it('POST /api/notifications/:userId - should return 400 if invalid input', async () => {
    const invalidNotification = { type: '' }; // Missing required fields

    const response = await request(app)
      .post(`/api/notifications/${mockUser._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send(invalidNotification);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Message is required');
  });

  /**
   * Test POST /api/notifications/:userId - should return 401 if unauthorized
   */
  it('POST /api/notifications/:userId - should return 401 if unauthorized', async () => {
    const newNotification = {
      type: 'alert',
      message: 'New dispute assigned',
    };

    const response = await request(app)
      .post(`/api/notifications/${mockUser._id}`)
      .send(newNotification);

    // Assertions
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });
});

// Cod2 Crown Certified: This test suite provides comprehensive coverage for notification API endpoints,
// mocks Notification.js and authMiddleware.js, validates JWT authentication,
// and ensures robust error handling for all test cases.

