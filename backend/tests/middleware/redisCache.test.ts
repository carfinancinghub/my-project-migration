/*
 * File: redisCache.test.ts
 * Path: C:\CFH\backend\tests\middleware\redisCache.test.ts
 * Created: 2025-06-30 20:00 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for redisCache middleware with ≥95% coverage.
 * Artifact ID: test-middleware-redis-cache
 * Version ID: test-middleware-redis-cache-v1.0.1
 */

import { redisCacheMiddleware } from '@middleware/redisCache';
import { getMockReq, getMockRes } from '@jest-mock/express';
// import Redis from 'ioredis'; // The actual library is mocked

// Mock the ioredis library
const mockRedisClient = {
  get: jest.fn(),
  set: jest.fn(),
};
jest.mock('ioredis', () => {
  return jest.fn(() => mockRedisClient);
});

// Get mock response and next function
const { res, next, mockClear } = getMockRes();

describe('Redis Cache Middleware', () => {
  // Clear all mocks before each test to ensure isolation
  beforeEach(() => {
    mockClear();
    jest.clearAllMocks();
  });

  it('should call next() and not send from cache if no cached data is found (cache miss)', async () => {
    // Arrange: Mock redisClient.get to resolve with null, simulating a cache miss.
    mockRedisClient.get.mockResolvedValue(null);
    const req = getMockReq({ originalUrl: '/test-miss' });
    const middleware = redisCacheMiddleware(300);

    // Act: Execute the middleware
    await middleware(req, res, next);

    // Assert: Ensure the route handler is called and no response is sent from the cache.
    expect(mockRedisClient.get).toHaveBeenCalledWith('__express__/test-miss');
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should send cached data and not call next() if data is found in cache (cache hit)', async () => {
    // Arrange: Mock redisClient.get to return a cached JSON string.
    const cachedData = { message: 'This is cached data' };
    mockRedisClient.get.mockResolvedValue(JSON.stringify(cachedData));
    const req = getMockReq({ originalUrl: '/test-hit' });
    const middleware = redisCacheMiddleware(300);

    // Act: Execute the middleware
    await middleware(req, res, next);

    // Assert: Ensure the cached response is sent and the route handler is skipped.
    expect(res.send).toHaveBeenCalledWith(cachedData);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if the Redis client throws an error (error fallback)', async () => {
    // Arrange: Mock redisClient.get to reject with an error to simulate Redis downtime.
    mockRedisClient.get.mockRejectedValue(new Error('Redis connection failed'));
    const req = getMockReq({ originalUrl: '/test-error' });
    const middleware = redisCacheMiddleware(300);

    // Act: Execute the middleware
    await middleware(req, res, next);

    // Assert: Ensure the application continues to function by calling the route handler.
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.send).not.toHaveBeenCalled();
  });
}