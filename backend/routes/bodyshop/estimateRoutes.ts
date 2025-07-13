/*
File: estimateRoutes.ts
Path: C:\CFH\backend\routes\bodyshop\estimateRoutes.ts
Created: 2025-07-04 10:00 PDT
Author: Mini (AI Assistant)
Version: 1.1
Description: Express.js routes for managing repair estimate requests with tiered features.
Artifact ID: j9k0l1m2-n3o4-p5q6-r7s8-t9u0v1w2x3y4
Version ID: k0l1m2n3-o4p5-q6r7-s8t9-u0v1w2x3y4z5 // New unique ID for version 1.1
*/

import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod'; // For input validation
import { v4 as uuidv4 } from 'uuid'; // For request IDs
import logger from '@/utils/logger'; // Centralized logging utility
import { authenticate } from '@/middleware/auth'; // JWT authentication middleware
import { tierCheck } from '@/middleware/tierCheck'; // Centralized tier checking middleware
import { rateLimiter } from '@/middleware/rateLimiter'; // Rate limiting middleware
import { redisCacheMiddleware } from '@/middleware/redisCache'; // Redis caching middleware
import { validateRequest, pdfExportSchema, customReportGenerationSchema, getAIInsightsSchema } from '@/backend/validation/analytics/validation'; // Reusing general validation schemas

// Cod1+ TODO: Import the actual estimate service
// import { estimateService } from '@/backend/services/bodyshop/estimateService';
// Cod1+ TODO: Import AI assessment service
// import { aiDamageAssessmentService } from '@/backend/services/ai/aiDamageAssessmentService';
// Cod1+ TODO: Import AI conflict resolution service
// import { aiConflictResolutionService } from '@/backend/services/ai/aiConflictResolutionService';
// Cod1+ TODO: Import notification service for reminders
// import { reminderService } from '@/backend/services/notifications/reminderService';

const router = express.Router();

// --- Zod Schemas for Input Validation ---

// Base schema for estimate request (Free Tier)
const baseEstimateRequestSchema = z.object({
    shopId: z.string().uuid("Invalid shop ID format").optional(), // Optional for broadcast
    userId: z.string().uuid("Invalid user ID format"),
    vehicleMake: z.string().min(2).max(50),
    vehicleModel: z.string().min(1).max(50),
    damageDescription: z.string().min(10).max(1000),
    photos: z.array(z.string().url("Invalid photo URL format")).min(1).max(3), // Free: Max 3 photos
});

// Schema for Standard Tier estimate request (adds photos/videos, contact, insurance)
const standardEstimateRequestSchema = baseEstimateRequestSchema.extend({
    photos: z.array(z.string().url("Invalid photo URL format")).min(1).max(5), // Standard: Max 5 photos
    videos: z.array(z.string().url("Invalid video URL format")).optional(),
    insuranceProvider: z.string().optional(),
    policyNumber: z.string().optional(),
    preferredContact: z.enum(['email', 'phone', 'in_app']).optional(),
    contactEmail: z.string().email("Invalid email format").optional(),
    contactPhone: z.string().optional(),
}).refine(data => { // Refine for preferred contact
    if (data.preferredContact === 'email' && !data.contactEmail) return false;
    if (data.preferredContact === 'phone' && !data.contactPhone) return false;
    return true;
}, { message: "Contact details required for preferred method." });

// Schema for Premium Tier estimate request (multi-shop, unlimited uploads)
const premiumEstimateRequestSchema = standardEstimateRequestSchema.extend({
    shopId: z.string().uuid("Invalid shop ID format").optional(), // Optional for broadcast
    selectedShopIds: z.array(z.string().uuid("Invalid shop ID format")).min(1).max(5).optional(), // Premium: 3-5 shops for broadcast
    photos: z.array(z.string().url("Invalid photo URL format")).min(1).max(999), // Unlimited for Premium
    videos: z.array(z.string().url("Invalid video URL format")).optional(),
}).refine(data => data.shopId || (data.selectedShopIds && data.selectedShopIds.length > 0), {
    message: "Either shopId or selectedShopIds must be provided for estimate request."
});

// Schema for AI assessment request (Wow++ Tier)
const aiAssessRequestSchema = z.object({
    estimateId: z.string().uuid("Invalid estimate ID format"),
    damagePhotos: z.array(z.string().url("Invalid photo URL for AI assessment")).min(1),
});

// Schema for estimate response (PUT /bodyshop/estimates/:estimateId/respond)
const estimateResponseSchema = z.object({
    quotedCost: z.number().positive("Quoted cost must be positive"),
    timelineDays: z.number().int().positive("Timeline must be a positive integer").optional(),
    details: z.string().min(10).max(1000).optional(),
    // Add fields for parts, labor breakdown etc.
});

// Schema for setting estimate expiry (PATCH /bodyshop/estimates/:estimateId/set-expiry)
const setExpirySchema = z.object({
    expiresAt: z.string().datetime("Invalid ISO 8601 datetime format for expiry date"),
});

// Schema for applying AI resolution (POST /bodyshop/estimates/:estimateId/resolve-with-ai)
const resolveWithAISchema = z.object({
    resolutionId: z.string().uuid("Invalid resolution ID format"), // ID of the AI-suggested resolution option
    notes: z.string().max(500).optional(),
    optionSelected: z.string().max(100).optional(), // e.g., 'renegotiate', 'mediate'
});


// --- Custom Request Interface (assuming authentication middleware adds 'user') ---
interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: string;
        isPremium?: boolean;
        tier?: 'free' | 'standard' | 'premium' | 'wowplus';
        shopId?: string; // For shop owners
    };
}

// --- HTTPS Enforcement Middleware ---
router.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.secure && process.env.NODE_ENV !== 'development') {
        logger.warn(`Insecure request blocked: HTTPS required for ${req.method} ${req.originalUrl}`);
        return res.status(403).json({ status: 'error', message: 'HTTPS connection required.' });
    }
    next();
});

// --- Route-specific Audit Logging Helper ---
const auditLog = (req: AuthenticatedRequest, action: string, details: any) => {
    const userId = req.user?.userId || 'anonymous';
    const role = req.user?.role || 'guest';
    const userTier = req.user?.tier || 'unknown';
    logger.info(`AUDIT: User ${userId} (${role}, ${userTier}) | Action: ${action} | Path: ${req.path} | Details: ${JSON.stringify(details)}`);
};

// --- Route Definitions ---

// Free Tier: POST /bodyshop/estimates - Submit single-shop estimate request
router.post('/estimates', authenticate, tierCheck('free'), validate(baseEstimateRequestSchema), async (req: AuthenticatedRequest, res: Response) => {
    auditLog(req, 'Submit Free Tier Estimate Request', { userId: req.user?.userId, shopId: req.body.shopId });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call estimateService to create single-shop estimate
        // const newEstimate = await estimateService.createEstimate(req.user?.userId, req.body);
        const newEstimateId = uuidv4();
        const newEstimate = { id: newEstimateId, status: 'Pending', ...req.body }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Free tier estimate ${newEstimateId} submitted for user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response (95% requests)
            logger.warn(`Estimate submission response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(201).json({ status: 'success', message: 'Estimate request submitted.', estimate: newEstimate });
    } catch (error) {
        logger.error(`Error submitting free tier estimate for user ${req.user?.userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to submit estimate request.' });
    }
});

// Free Tier: GET /bodyshop/estimates/user/:userId - Get basic estimate history for a user
router.get('/estimates/user/:userId', authenticate, tierCheck('free'), async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.params;
    auditLog(req, 'Get User Estimate History (Basic)', { userId });
    const startTime = process.hrtime.bigint();

    try {
        if (req.user?.userId !== userId && req.user?.role !== 'admin') { // Basic authorization
            return res.status(403).json({ status: 'error', message: 'Access denied to view other user\'s estimates.' });
        }
        // Cod1+ TODO: Call estimateService to get basic history
        // const estimates = await estimateService.getUserEstimates(userId, { basic: true });
        const estimates = [ // Mock data
            { id: 'est_free_1', shopName: 'Auto Fix', status: 'Pending', requestedAt: '2025-07-01' },
            { id: 'est_free_2', shopName: 'Car Care', status: 'Quoted', requestedAt: '2025-06-28' },
        ];

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Basic estimate history for user ${userId} served in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Basic estimate history response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', data: estimates });
    } catch (error) {
        logger.error(`Error fetching basic estimate history for user ${userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve estimate history.' });
    }
});

// Standard Tier: GET /bodyshop/estimates/shop/:shopId - Get estimates for a shop
router.get('/estimates/shop/:shopId', authenticate, tierCheck('standard'), async (req: AuthenticatedRequest, res: Response) => {
    const { shopId } = req.params;
    auditLog(req, 'Get Shop Estimates', { shopId, userId: req.user?.userId });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call estimateService to get estimates for a shop
        // Ensure user is authorized to view this shop's estimates (e.g., shop owner, admin)
        // const estimates = await estimateService.getShopEstimates(shopId, req.user?.userId);
        const estimates = [ // Mock data
            { id: 'est_shop_1', vehicle: 'Ford Focus', damage: 'Rear bumper', status: 'New', requestedAt: '2025-07-03' },
            { id: 'est_shop_2', vehicle: 'Toyota Camry', damage: 'Front fender', status: 'Assessing', requestedAt: '2025-07-02' },
        ];

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Shop estimates for ${shopId} served in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Shop estimates response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', data: estimates });
    } catch (error) {
        logger.error(`Error fetching shop estimates for ${shopId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve shop estimates.' });
    }
});

// Standard Tier: PUT /bodyshop/estimates/:estimateId/respond - Shop responds to estimate
router.put('/estimates/:estimateId/respond', authenticate, tierCheck('standard'), validate(estimateResponseSchema), async (req: AuthenticatedRequest, res: Response) => {
    const { estimateId } = req.params;
    auditLog(req, 'Shop Respond to Estimate', { estimateId, response: req.body, shopId: req.user?.userId });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call estimateService to update estimate with shop's response
        // Ensure user is authorized as the owner of the shop for this estimate
        // const updatedEstimate = await estimateService.respondToEstimate(estimateId, req.user?.userId, req.body);
        const updatedEstimate = { id: estimateId, status: 'Quoted', ...req.body }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Estimate ${estimateId} responded to by shop ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Estimate response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', message: 'Estimate response submitted.', estimate: updatedEstimate });
    } catch (error) {
        logger.error(`Error responding to estimate ${estimateId} by shop ${req.user?.userId}:`, error);
        // CQS: Handle 409 (conflicts) - this would be handled by the service layer
        if ((error as any).name === 'EstimateConflictError') {
            return res.status(409).json({ status: 'error', message: error.message });
        }
        res.status(500).json({ status: 'error', message: 'Failed to submit estimate response.' });
    }
});

// Premium Tier: POST /bodyshop/estimates/broadcast - Submit multi-shop estimate request
router.post('/estimates/broadcast', authenticate, tierCheck('premium'), validate(premiumEstimateRequestSchema), async (req: AuthenticatedRequest, res: Response) => {
    auditLog(req, 'Submit Multi-Shop Estimate Request', { userId: req.user?.userId, selectedShopIds: req.body.selectedShopIds });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call estimateService to broadcast estimate to multiple shops
        // This might involve adding to a priority queue
        // const newEstimate = await estimateService.broadcastEstimate(req.user?.userId, req.body);
        const newEstimateId = uuidv4();
        const newEstimate = { id: newEstimateId, status: 'Broadcasted', ...req.body }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Multi-shop estimate ${newEstimateId} broadcasted for user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Multi-shop estimate broadcast response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(201).json({ status: 'success', message: 'Multi-shop estimate request broadcasted.', estimate: newEstimate });
    } catch (error) {
        logger.error(`Error broadcasting multi-shop estimate for user ${req.user?.userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to broadcast estimate request.' });
    }
});

// Premium Tier: GET /bodyshop/estimates/leads - Get leads for a shop (from broadcast requests)
router.get('/estimates/leads', authenticate, tierCheck('premium'), redisCacheMiddleware(5 * 60), async (req: AuthenticatedRequest, res: Response) => {
    auditLog(req, 'Get Estimate Leads for Shop', { shopId: req.user?.userId });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call estimateService to get leads for the authenticated shop owner
        // const leads = await estimateService.getShopLeads(req.user?.userId);
        const leads = [ // Mock data
            { id: 'lead1', vehicle: 'BMW X5', damage: 'Front damage', userId: 'userA', status: 'New Lead' },
        ];

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Estimate leads for shop ${req.user?.userId} served in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Estimate leads response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', data: leads });
    } catch (error) {
        logger.error(`Error fetching estimate leads for shop ${req.user?.userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve estimate leads.' });
    }
});

// Premium Tier: POST /bodyshop/estimates/webhook/insurance - Receive insurance updates for an estimate.
// This endpoint might not require JWT auth if it's a webhook from a trusted external service,
// but it should definitely have strong shared secret/signature validation.
router.post('/estimates/webhook/insurance', 
    // Cod1+ TODO: Implement webhook signature validation middleware (e.g., validateWebhookSignature)
    // No tierCheck directly applied here as webhooks are typically external system calls,
    // but the incoming data should map to an estimate within the premium tier context.
    rateLimiter({ windowMs: 60 * 60 * 1000, limit: 50, keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'] as string }),
    async (req: Request, res: Response) => { // AuthenticatedRequest not strictly needed if only webhook specific auth
    const requestId = uuidv4();
    auditLog(req as AuthenticatedRequest, 'Receive Insurance Webhook', { requestId, payload: req.body });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Validate webhook signature/secret
        // if (!validateWebhookSignature(req)) { return res.status(401).json({ message: 'Unauthorized webhook' }); }

        // Cod1+ TODO: Process the insurance update via estimateService
        // This might involve finding the relevant estimate, updating its status based on claimId, etc.
        // const claimResult = await estimateService.processInsuranceWebhook(req.body);
        const claimResult = { claimId: req.body.claimId, estimateLinked: true, status: 'processed' }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Insurance webhook for claim ${req.body.claimId} processed in ${responseTimeMs.toFixed(2)}ms. Request ID: ${requestId}`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Insurance webhook response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms. Request ID: ${requestId}`);
        }

        res.status(200).json({ status: 'received', claimLinked: claimResult.estimateLinked, data: claimResult });
    } catch (error) {
        logger.error(`Error processing insurance webhook (Request ID: ${requestId}):`, error);
        res.status(500).json({ status: 'error', message: 'Failed to process webhook.' });
    }
});


// Wow++ Tier: POST /bodyshop/estimates/ai-assess - AI preliminary damage assessment
router.post('/estimates/ai-assess', authenticate, tierCheck('wowplus'), validate(aiAssessRequestSchema), async (req: AuthenticatedRequest, res: Response) => {
    auditLog(req, 'AI Preliminary Damage Assessment', { userId: req.user?.userId, estimateId: req.body.estimateId });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call AI assessment service
        // const assessmentResult = await aiDamageAssessmentService.assessDamage(req.body.estimateId, req.body.damagePhotos);
        const assessmentResult = {
            estimateId: req.body.estimateId,
            summary: "AI detected moderate front-end damage, likely requiring bumper replacement and paint.",
            estimatedCost: Math.floor(Math.random() * (5000 - 2000 + 1) + 2000),
            confidence: 0.85
        }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`AI assessment for estimate ${req.body.estimateId} completed in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`AI assessment response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', message: 'AI assessment complete.', data: assessmentResult });
    } catch (error) {
        logger.error(`Error performing AI assessment for estimate ${req.body.estimateId}:`, error);
        // CQS: Rollback on failed assessments (this would be handled by the service layer)
        res.status(500).json({ status: 'error', message: 'Failed to perform AI assessment.' });
    }
});

// Wow++ Tier: PATCH /bodyshop/estimates/:estimateId/set-expiry - Set automated expiry
router.patch('/estimates/:estimateId/set-expiry', authenticate, tierCheck('wowplus'), validate(setExpirySchema), async (req: AuthenticatedRequest, res: Response) => {
    const { estimateId } = req.params;
    auditLog(req, 'Set Estimate Expiry', { userId: req.user?.userId, estimateId, expiresAt: req.body.expiresAt });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call estimateService to set expiry and link to reminderService
        // await estimateService.setExpiry(estimateId, req.user?.userId, req.body.expiresAt);
        // await reminderService.scheduleEstimateReminder(estimateId, req.body.expiresAt);
        
        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Estimate expiry for ${estimateId} set by user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Estimate expiry set response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'updated', message: 'Estimate expiry set successfully.', estimateId, expiresAt: req.body.expiresAt });
    } catch (error) {
        logger.error(`Error setting expiry for estimate ${estimateId} by user ${req.user?.userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to set estimate expiry.' });
    }
});

// Wow++ Tier: GET /bodyshop/estimates/reminders/pending - Get pending expiry reminders
router.get('/estimates/reminders/pending', authenticate, tierCheck('wowplus'), redisCacheMiddleware(5 * 60), async (req: AuthenticatedRequest, res: Response) => {
    auditLog(req, 'Get Pending Estimate Reminders', { userId: req.user?.userId });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call reminderService to get pending reminders for the user/shop
        // const reminders = await reminderService.getPendingEstimateReminders(req.user?.userId);
        const reminders = [ // Mock data
            { estimateId: uuidv4(), expiresAt: new Date(Date.now() + 86400000).toISOString(), reminderType: 'initial_warning', shopId: 'shopX' },
            { estimateId: uuidv4(), expiresAt: new Date(Date.now() + 3600000).toISOString(), reminderType: 'final_notice', shopId: 'shopY' },
        ];

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Pending estimate reminders for user ${req.user?.userId} served in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Pending reminders response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', data: reminders });
    } catch (error) {
        logger.error(`Error fetching pending estimate reminders for user ${req.user?.userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve pending reminders.' });
    }
});

// Wow++ Tier: GET /bodyshop/estimates/:estimateId/resolve-conflict-suggestions - Get AI suggestions for resolving conflicts
router.get('/estimates/:estimateId/resolve-conflict-suggestions', authenticate, tierCheck('wowplus'), async (req: AuthenticatedRequest, res: Response) => {
    const { estimateId } = req.params;
    auditLog(req, 'Get AI Conflict Resolution Suggestions', { userId: req.user?.userId, estimateId });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call AI conflict resolution service
        // const suggestions = await aiConflictResolutionService.getResolutionSuggestions(estimateId, req.user?.userId);
        const suggestions = [ // Mock data
            { suggestion: 'Suggest renegotiating quote with shop, target a 5% reduction.', confidence: 0.85, type: 'renegotiation' },
            { suggestion: 'Recommend escalating to an independent insurance mediator.', confidence: 0.72, type: 'mediation' },
        ];

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`AI conflict resolution suggestions for ${estimateId} served in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`AI conflict suggestions response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', data: suggestions });
    } catch (error) {
        logger.error(`Error fetching AI conflict resolution suggestions for ${estimateId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve AI conflict resolution suggestions.' });
    }
});

// Wow++ Tier: POST /bodyshop/estimates/:estimateId/resolve-with-ai - Apply AI-recommended resolution
router.post('/estimates/:estimateId/resolve-with-ai', authenticate, tierCheck('wowplus'), validate(resolveWithAISchema), async (req: AuthenticatedRequest, res: Response) => {
    const { estimateId } = req.params;
    auditLog(req, 'Apply AI-Recommended Resolution', { userId: req.user?.userId, estimateId, resolution: req.body });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call estimateService or AI conflict resolution service to apply the resolution
        // const result = await aiConflictResolutionService.applyResolution(estimateId, req.user?.userId, req.body.resolutionId, req.body.notes, req.body.optionSelected);
        const result = { estimateId, status: 'Resolved', appliedResolutionType: req.body.optionSelected }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`AI-recommended resolution for ${estimateId} applied by user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`AI resolution application response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', message: 'AI-recommended resolution applied.', estimateId, appliedResolutionType: result.appliedResolutionType });
    } catch (error) {
        logger.error(`Error applying AI resolution for estimate ${estimateId} by user ${req.user?.userId}:`, error);
        // CQS: Rollback on payment failure/transactional failure (if applicable)
        res.status(500).json({ status: 'error', message: 'Failed to apply AI-recommended resolution.' });
    }
});


// --- General Error Handling Middleware ---
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if ((err as any).name === 'AccessDeniedError' || (err as any).name === 'NotAuthenticatedError') {
        logger.warn(`Access denied for user ${req.user?.userId || 'N/A'} on route ${req.originalUrl}: ${err.message}.`);
        return res.status(403).json({ status: 'error', message: err.message });
    }
    if (err instanceof z.ZodError) { // Catch Zod errors from validate middleware
        logger.warn(`Validation error in estimateRoutes for route ${req.originalUrl}: ${err.errors.map(e => e.message).join(', ')}`);
        return res.status(400).json({ status: 'error', message: 'Invalid request data', errors: err.errors });
    }
    // CQS: Handle 409 (conflicts) - this would be handled by the service layer
    if ((err as any).name === 'EstimateConflictError') {
        logger.warn(`Estimate conflict detected on route ${req.originalUrl}: ${err.message}.`);
        return res.status(409).json({ status: 'error', message: err.message });
    }
    // CQS: Handle 429 (rate limits) - handled by rateLimiter middleware, but catch if it propagates
    if ((err as any).statusCode === 429) {
        logger.warn(`Rate limit exceeded for IP: ${req.ip} on route ${req.originalUrl}.`);
        return res.status(429).json({ status: 'error', message: 'Too many requests. Please try again later.' });
    }

    // For any other unhandled errors, log and send 500
    logger.error(`Unhandled error in estimateRoutes for route ${req.originalUrl}:`, err);
    res.status(500).json({ status: 'error', message: 'An internal server error occurred.' });
});

export default router;