/*
File: gamificationRoutes.ts
Path: C:\CFH\backend\routes\auctions\gamificationRoutes.ts
Created: 2025-07-03 14:30 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Express.js routes for gamification features (Wow++ tier).
Artifact ID: q8r9s0t1-u2v3-w4x5-y6z7-a8b9c0d1e2f3
Version ID: r9s0t1u2-v3w4-x5y6-z7a8-b9c0d1e2f3g4
*/

import express, { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger'; // Centralized logging utility
import { authenticate } from '@/middleware/auth'; // JWT authentication middleware
import { tierCheck } from '@/middleware/tierCheck'; // Centralized tier checking middleware
import { gamificationService } from '@/backend/services/auction/gamificationService'; // Gamification service

const router = express.Router();

// --- Custom Request Interface (assuming authentication middleware adds 'user') ---
interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: string;
        isPremium?: boolean;
        tier?: 'free' | 'standard' | 'premium' | 'wowplus';
    };
}

// --- HTTPS Enforcement Middleware ---
router.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.secure && process.env.NODE_ENV !== 'development') {
        logger.warn(Insecure request blocked: HTTPS required for ${req.method} ${req.originalUrl});
        return res.status(403).json({ status: 'error', message: 'HTTPS connection required.' });
    }
    next();
});

// --- Route-specific Audit Logging Helper ---
const auditLog = (req: AuthenticatedRequest, action: string, details: any) => {
    const userId = req.user?.userId || 'anonymous';
    const role = req.user?.role || 'guest';
    const userTier = req.user?.tier || 'unknown';
    logger.info(AUDIT: User ${userId} (${role}, ${userTier}) | Action: ${action} | Path: ${req.path} | Details: ${JSON.stringify(details)});
};

// --- Route Definitions ---

// Wow++ Tier: GET /gamification/user/me - Get user's gamification profile (points, badges, missions)
router.get('/user/me', authenticate, tierCheck('wowplus'), async (req: AuthenticatedRequest, res: Response) => {
    auditLog(req, 'Access Gamification Profile', { userId: req.user?.userId });
    const startTime = process.hrtime.bigint();

    try {
        const userProfile = await gamificationService.getUserGamificationProfile(req.user!.userId);

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(Gamification profile for user ${req.user?.userId} served in ${responseTimeMs.toFixed(2)}ms.);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(Gamification profile response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms);
        }

        res.status(200).json({ status: 'success', data: userProfile });
    } catch (error) {
        logger.error(Error fetching gamification profile for user ${req.user?.userId}:, error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve gamification profile.' });
    }
});

// Wow++ Tier: GET /gamification/leaderboard - Get global/auction-specific leaderboards
router.get('/leaderboard', authenticate, tierCheck('wowplus'), async (req: AuthenticatedRequest, res: Response) => {
    const { type, auctionId } = req.query; // e.g., type='global_bids', type='auction_wins', auctionId='xyz'
    auditLog(req, 'Access Gamification Leaderboard', { userId: req.user?.userId, type, auctionId });
    const startTime = process.hrtime.bigint();

    try {
        if (!type) {
            return res.status(400).json({ status: 'error', message: 'Leaderboard type is required.' });
        }
        const leaderboard = await gamificationService.getLeaderboard(type as string, auctionId as string);

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(Gamification leaderboard served in ${responseTimeMs.toFixed(2)}ms.);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(Gamification leaderboard response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms);
        }

        res.status(200).json({ status: 'success', data: leaderboard });
    } catch (error) {
        logger.error(Error fetching gamification leaderboard for user ${req.user?.userId}:, error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve leaderboard.' });
    }
});

// Wow++ Tier: POST /gamification/missions/:missionId/complete - Mark a mission as complete
router.post('/missions/:missionId/complete', authenticate, tierCheck('wowplus'), async (req: AuthenticatedRequest, res: Response) => {
    const { missionId } = req.params;
    auditLog(req, 'Complete Gamification Mission', { userId: req.user?.userId, missionId });
    const startTime = process.hrtime.bigint();

    try {
        const result = await gamificationService.completeMission(req.user!.userId, missionId);

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(Mission ${missionId} completed by user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(Mission completion response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms);
        }

        res.status(200).json({ status: 'success', message: 'Mission completed successfully.', rewards: result.rewards });
    } catch (error) {
        logger.error(Error completing mission ${missionId} for user ${req.user?.userId}:, error);
        res.status(500).json({ status: 'error', message: 'Failed to complete mission.' });
    }
});

// --- General Error Handling Middleware ---
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if ((err as any).name === 'AccessDeniedError' || (err as any).name === 'NotAuthenticatedError') {
        logger.warn(Access denied for user ${req.user?.userId || 'N/A'} on route ${req.originalUrl}: ${err.message}.);
        return res.status(403).json({ status: 'error', message: err.message });
    }
    logger.error(Unhandled error in gamificationRoutes for route ${req.originalUrl}:, err);
    res.status(500).json({ status: 'error', message: 'An internal server error occurred.' });
});

export default router;
File 8/8: gamificationService.ts

Purpose: Service for gamification (points, badges).
Requirements: Audit logging, <500ms response, and error handling.

