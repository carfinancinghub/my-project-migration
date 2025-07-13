/*
 * File: auth.test.ts
 * Path: C:\CFH\backend\tests\middleware\auth.test.ts
 * Created: 2025-06-30 19:45 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for auth middleware with ≥95% coverage.
 * Artifact ID: test-middleware-auth
 * Version ID: test-middleware-auth-v1.0.0
 */

import { checkTier } from '@middleware/auth';
import { getMockReq, getMockRes } from '@jest-mock/express';

const { res, next, mockClear } = getMockRes();

describe('Auth Middleware', () => {
  beforeEach(() => {
    mockClear();
  });

  it('checkTier should allow access for a user with the required tier', () => {
    const req = getMockReq({ auth: { tier: 'Premium' } });
    checkTier('Premium')(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('checkTier should deny access for a user with an insufficient tier', () => {
    const req = getMockReq({ auth: { tier: 'Standard' } });
    checkTier('Premium')(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});