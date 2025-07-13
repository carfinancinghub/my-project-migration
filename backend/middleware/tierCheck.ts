/*
File: tierCheck.ts
Path: C:\CFH\backend\middleware\tierCheck.ts
Created: 2025-07-02 12:00 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Middleware for tier-based access control in the analytics dashboard.
Artifact ID: e6f7g8h9-i0j1-k2l3-m4n5-o6p7q8r9s0t1
Version ID: f7g8h9i0-j1k2-l3m4-n5o6-p7q8r9s0t1u2
*/

import { Request, Response, NextFunction } from 'express';

// Custom Error Class for Access Denials
export class AccessDeniedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AccessDeniedError';
        Object.setPrototypeOf(this, AccessDeniedError.prototype);
    }
}

// Define the tiers and their hierarchy
const TIER_ORDER = {
    'free': 0,
    'standard': 1,
    'premium': 2,
    'wowplus': 3
};

// Define the AuthenticatedRequest interface, consistent with analyticsRoutes.ts
// This interface should ideally be in a shared types file (e.g., @/types/express.d.ts)
interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: string;
        isPremium?: boolean;
        tier?: 'free' | 'standard' | 'premium' | 'wowplus';
    };
}

/**
 * Checks if a user's tier meets the required tier for accessing a resource.
 * @param userTier The tier of the authenticated user.
 * @param requiredTier The minimum tier required to access the resource.
 * @returns True if the user's tier is authorized, false otherwise.
 */
const isAuthorized = (userTier: keyof typeof TIER_ORDER, requiredTier: keyof typeof TIER_ORDER): boolean => {
    return TIER_ORDER[userTier] >= TIER_ORDER[requiredTier];
};

/**
 * Express middleware to enforce tier-based access control.
 * Throws an AccessDeniedError if the user's tier is insufficient.
 * @param requiredTier The minimum tier required for the route.
 * @returns An Express middleware function.
 */
export const tierCheck = (requiredTier: keyof typeof TIER_ORDER) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        // Ensure user object and tier are present after authentication
        if (!req.user || !req.user.tier) {
            // If authentication middleware didn't set user or tier, it's an unauthenticated/malformed request
            // Or if tierCheck is used before authenticate, it should fail here.
            const error = new AccessDeniedError('Authentication required or user tier not found.');
            return next(error);
        }

        // Check if the user's tier meets the required tier
        if (!isAuthorized(req.user.tier, requiredTier)) {
            const error = new AccessDeniedError(`Access denied: '${requiredTier}' tier required.`);
            return next(error);
        }

        // If authorized, proceed to the next middleware/route handler
        next();
    };
};

// Export specific tier check functions for convenience (optional, but good DX)
export const isFree = tierCheck('free');
export const isStandard = tierCheck('standard');
export const isPremium = tierCheck('premium');
export const isWowPlus = tierCheck('wowplus');