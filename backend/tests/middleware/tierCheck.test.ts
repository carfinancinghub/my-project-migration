/*
File: tierCheck.test.ts
Path: C:\CFH\backend\tests\middleware\tierCheck.test.ts
Created: 2025-07-02 12:05 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest tests for tierCheck middleware with ≥95% coverage.
Artifact ID: f8g9h0i1-j2k3-l4m5-n6o7-p8q9r0s1t2u3
Version ID: g9h0i1j2-k3l4-m5n6-o7p8-q9r0s1t2u3v4
*/

import { tierCheck, AccessDeniedError, isFree, isStandard, isPremium, isWowPlus } from '@/middleware/tierCheck';
import { Request, Response, NextFunction } from 'express';

// Mock Express request, response, and next function
// Using a simple manual mock as @jest-mock/express might add unnecessary dependency
const getMockReq = (user?: any) => ({
    user: user,
} as Request);

const getMockRes = () => {
    const res: Partial<Response> = {};
    return { res, next: jest.fn() as NextFunction };
};

describe('tierCheck Middleware', () => {

    // Test cases for tierCheck factory function
    describe('tierCheck(requiredTier)', () => {
        it('should call next() if user tier meets required tier (free -> free)', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'user1', role: 'buyer', tier: 'free' } });
            tierCheck('free')(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(); // Expect no arguments for success
        });

        it('should call next() if user tier is higher than required (premium -> standard)', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'user2', role: 'seller', tier: 'premium' } });
            tierCheck('standard')(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith();
        });

        it('should call next(AccessDeniedError) if user tier is lower than required (free -> premium)', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'user3', role: 'buyer', tier: 'free' } });
            tierCheck('premium')(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(expect.any(AccessDeniedError));
            expect((next as jest.Mock).mock.calls[0][0].message).toBe("Access denied: 'premium' tier required.");
            expect((next as jest.Mock).mock.calls[0][0].name).toBe('AccessDeniedError');
        });

        it('should call next(AccessDeniedError) if user is not authenticated (no req.user)', () => {
            const { res, next } = getMockRes();
            const req = getMockReq(undefined); // No user object
            tierCheck('standard')(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(expect.any(AccessDeniedError));
            expect((next as jest.Mock).mock.calls[0][0].message).toBe('Authentication required or user tier not found.');
        });

        it('should call next(AccessDeniedError) if req.user.tier is missing but user exists', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'user4', role: 'admin' } }); // User exists, but no tier
            tierCheck('premium')(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(expect.any(AccessDeniedError));
            expect((next as jest.Mock).mock.calls[0][0].message).toBe('Authentication required or user tier not found.');
        });
    });

    // Test cases for convenience functions (isFree, isStandard, etc.)
    describe('Convenience Tier Check Functions', () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Clear mocks before each test in this suite
        });

        it('isFree allows a free user', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'u1', role: 'buyer', tier: 'free' } });
            isFree(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        it('isFree allows a premium user', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'u2', role: 'seller', tier: 'premium' } });
            isFree(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        it('isStandard denies a free user', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'u3', role: 'buyer', tier: 'free' } });
            isStandard(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(AccessDeniedError));
            expect((next as jest.Mock).mock.calls[0][0].message).toBe("Access denied: 'standard' tier required.");
        });

        it('isStandard allows a standard user', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'u4', role: 'buyer', tier: 'standard' } });
            isStandard(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        it('isStandard allows a wowplus user', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'u5', role: 'admin', tier: 'wowplus' } });
            isStandard(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        it('isPremium denies a standard user', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'u6', role: 'seller', tier: 'standard' } });
            isPremium(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(AccessDeniedError));
            expect((next as jest.Mock).mock.calls[0][0].message).toBe("Access denied: 'premium' tier required.");
        });

        it('isPremium allows a premium user', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'u7', role: 'lender', tier: 'premium' } });
            isPremium(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        it('isWowPlus denies a premium user', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'u8', role: 'officer', tier: 'premium' } });
            isWowPlus(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(AccessDeniedError));
            expect((next as jest.Mock).mock.calls[0][0].message).toBe("Access denied: 'wowplus' tier required.");
        });

        it('isWowPlus allows a wowplus user', () => {
            const { res, next } = getMockRes();
            const req = getMockReq({ user: { userId: 'u9', role: 'admin', tier: 'wowplus' } });
            isWowPlus(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });
    });
});