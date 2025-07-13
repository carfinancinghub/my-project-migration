/*
File: jobRoutes.ts
Path: C:\CFH\backend\routes\bodyshop\jobRoutes.ts
Created: 2025-07-04 10:10 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Express.js routes for managing repair jobs with tiered features.
Artifact ID: l1m2n3o4-p5q6-r7s8-t9u0-v1w2x3y4z5a6
Version ID: m2n3o4p5-q6r7-s8t9-u0v1-w2x3y4z5a6b7
*/

import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod'; // For input validation
import { v4 as uuidv4 } from 'uuid'; // For request IDs
import logger from '@/utils/logger'; // Centralized logging utility
import { authenticate } from '@/middleware/auth'; // JWT authentication middleware
import { tierCheck } from '@/middleware/tierCheck'; // Centralized tier checking middleware
import { rateLimiter } from '@/middleware/rateLimiter'; // Rate limiting middleware

// Cod1+ TODO: Import the actual job service
// import { jobService } from '@/backend/services/bodyshop/jobService';
// Cod1+ TODO: Import AI prediction service for job duration
// import { aiJobPredictorService } from '@/backend/services/ai/aiJobPredictorService';
// Cod1+ TODO: Import parts ordering service
// import { partsOrderingService } from '@/backend/services/bodyshop/partsOrderingService';

const router = express.Router();

// --- Zod Schemas for Input Validation ---

// Schema for basic job creation (POST /bodyshop/jobs) - Free Tier
const createJobSchema = z.object({
    estimateId: z.string().uuid("Invalid estimate ID format").optional(), // Can be created from an estimate
    userId: z.string().uuid("Invalid user ID format"), // Customer ID
    shopId: z.string().uuid("Invalid shop ID format"), // Assigning shop
    vehicleVin: z.string().min(17).max(17).regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Invalid VIN format"),
    jobDescription: z.string().min(10).max(1000),
    // Basic fields for a free job
});

// Schema for updating job status (PUT /bodyshop/jobs/:jobId/status) - Standard Tier
const updateJobStatusSchema = z.object({
    status: z.enum(['Scheduled', 'In Progress', 'On Hold', 'Completed', 'Cancelled']),
    notes: z.string().optional(),
});

// Schema for job progress update (POST /bodyshop/jobs/:jobId/progress-update) - Premium Tier
const jobProgressUpdateSchema = z.object({
    progressPercentage: z.number().int().min(0).max(100),
    milestone: z.string().min(3).max(100).optional(),
    photos: z.array(z.string().url("Invalid photo URL")).optional(),
    videos: z.array(z.string().url("Invalid video URL")).optional(),
});

// Schema for parts order (POST /bodyshop/jobs/:jobId/order-parts) - Wow++ Tier
const orderPartsSchema = z.object({
    jobId: z.string().uuid("Invalid job ID format"),
    parts: z.array(z.object({
        partName: z.string().min(2),
        partNumber: z.string().optional(),
        quantity: z.number().int().positive(),
        supplierId: z.string().uuid("Invalid supplier ID format").optional(),
        price: z.number().positive().optional(),
    })).min(1),
    // Add payment method details if payment is handled here
});


// --- Middleware for Zod Validation (reusable) ---
const validate = (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            logger.warn(`Validation error for request to ${req.path}: ${error.errors.map(e => e.message).join(', ')}`);
            res.status(400).json({ status: 'error', message: 'Invalid input', errors: error.errors });
        } else {
            next(error);
        }
    }
};

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

// Free Tier: POST /bodyshop/jobs - Create a new repair job
router.post('/jobs', authenticate, tierCheck('free'), validate(createJobSchema), async (req: AuthenticatedRequest, res: Response) => {
    auditLog(req, 'Create Free Tier Job', { userId: req.user?.userId, jobData: req.body });
    const startTime = process.hrtime.bigint();

    try {
        // TODO: Call jobService to create a new job
        // const newJob = await jobService.createJob(req.user?.userId, req.body);
        const newJobId = uuidv4();
        const newJob = { id: newJobId, status: 'Created', ...req.body }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Free tier job ${newJobId} created for user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response (95% requests)
            logger.warn(`Job creation response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(201).json({ status: 'success', message: 'Job created successfully.', job: newJob });
    } catch (error) {
        logger.error(`Error creating job for user ${req.user?.userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to create job.' });
    }
});

// Free Tier: GET /bodyshop/jobs/user/:userId - Get basic job history for a user (customer view)
router.get('/jobs/user/:userId', authenticate, tierCheck('free'), async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.params;
    auditLog(req, 'Get User Job History (Basic)', { userId });
    const startTime = process.hrtime.bigint();

    try {
        if (req.user?.userId !== userId && req.user?.role !== 'admin') { // Basic authorization
            return res.status(403).json({ status: 'error', message: 'Access denied to view other user\'s jobs.' });
        }
        // TODO: Call jobService to get basic user job history
        // const jobs = await jobService.getUserJobs(userId, { basic: true });
        const jobs = [ // Mock data
            { id: 'job_user_1', shopName: 'Elite Auto', vehicle: 'BMW X3', status: 'In Progress', created: '2025-07-01' },
            { id: 'job_user_2', shopName: 'Quick Fix', vehicle: 'Audi A4', status: 'Completed', created: '2025-06-20' },
        ];

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Basic job history for user ${userId} served in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Basic job history response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', data: jobs });
    } catch (error) {
        logger.error(`Error fetching basic job history for user ${userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve job history.' });
    }
});

// Standard Tier: GET /bodyshop/jobs/shop/:shopId - Get jobs for a shop (shop owner view)
router.get('/jobs/shop/:shopId', authenticate, tierCheck('standard'), async (req: AuthenticatedRequest, res: Response) => {
    const { shopId } = req.params;
    auditLog(req, 'Get Shop Jobs', { shopId, userId: req.user?.userId });
    const startTime = process.hrtime.bigint();

    try {
        // TODO: Call jobService to get jobs for a shop
        // Ensure user is authorized as the owner of the shop or admin
        // if (req.user?.shopId !== shopId && req.user?.role !== 'admin') { ... }
        // const jobs = await jobService.getShopJobs(shopId, req.user?.userId);
        const jobs = [ // Mock data
            { id: 'job_shop_1', customer: 'Alice', vehicle: 'Honda CRV', status: 'In Progress', created: '2025-07-02' },
            { id: 'job_shop_2', customer: 'Bob', vehicle: 'Nissan Rogue', status: 'Scheduled', created: '2025-07-03' },
        ];

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Shop jobs for ${shopId} served in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Shop jobs response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', data: jobs });
    } catch (error) {
        logger.error(`Error fetching shop jobs for ${shopId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve shop jobs.' });
    }
});

// Standard Tier: PUT /bodyshop/jobs/:jobId/status - Update job status
router.put('/jobs/:jobId/status', authenticate, tierCheck('standard'), validate(updateJobStatusSchema), async (req: AuthenticatedRequest, res: Response) => {
    const { jobId } = req.params;
    auditLog(req, 'Update Job Status', { jobId, status: req.body.status, userId: req.user?.userId });
    const startTime = process.hrtime.bigint();

    try {
        // TODO: Call jobService to update job status
        // Ensure user is authorized to update this job (e.g., shop owner, assigned mechanic)
        // const updatedJob = await jobService.updateJobStatus(jobId, req.user?.userId, req.body.status, req.body.notes);
        const updatedJob = { id: jobId, status: req.body.status, notes: req.body.notes }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Job ${jobId} status updated to ${req.body.status} by user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Job status update response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', message: 'Job status updated successfully.', job: updatedJob });
    } catch (error) {
        logger.error(`Error updating job ${jobId} status by user ${req.user?.userId}:`, error);
        // CQS: Handle 409 (overbooking) - if jobService throws a specific error for this
        if ((error as any).name === 'JobOverbookingError') {
            return res.status(409).json({ status: 'error', message: 'Job overbooking conflict. Please check schedule.' });
        }
        res.status(500).json({ status: 'error', message: 'Failed to update job status.' });
    }
});

// Standard Tier: POST /bodyshop/jobs/:jobId/complete - Mark job as complete
router.post('/jobs/:jobId/complete', authenticate, tierCheck('standard'), async (req: AuthenticatedRequest, res: Response) => {
    const { jobId } = req.params;
    auditLog(req, 'Mark Job Complete', { jobId, userId: req.user?.userId });
    const startTime = process.hrtime.bigint();

    try {
        // TODO: Call jobService to mark job as complete
        // const completionResult = await jobService.completeJob(jobId, req.user?.userId);
        const completionResult = { id: jobId, status: 'Completed', completedAt: new Date().toISOString() }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Job ${jobId} marked complete by user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Job completion response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', message: 'Job marked as complete.', job: completionResult });
    } catch (error) {
        logger.error(`Error marking job ${jobId} complete by user ${req.user?.userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to mark job as complete.' });
    }
});

// Premium Tier: POST /bodyshop/jobs/:jobId/progress-update - Add job progress update
router.post('/jobs/:jobId/progress-update', authenticate, tierCheck('premium'), validate(jobProgressUpdateSchema), async (req: AuthenticatedRequest, res: Response) => {
    const { jobId } = req.params;
    auditLog(req, 'Add Job Progress Update', { jobId, progress: req.body.progressPercentage, userId: req.user?.userId });
    const startTime = process.hrtime.bigint();

    try {
        // TODO: Call jobService to add progress update
        // const progressUpdate = await jobService.addJobProgress(jobId, req.user?.userId, req.body);
        const progressUpdate = { id: uuidv4(), jobId, ...req.body, timestamp: new Date().toISOString() }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Progress update for job ${jobId} added by user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Job progress update response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(201).json({ status: 'success', message: 'Progress update added.', update: progressUpdate });
    } catch (error) {
        logger.error(`Error adding progress update for job ${jobId} by user ${req.user?.userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to add progress update.' });
    }
});

// Premium Tier: POST /bodyshop/jobs/:jobId/documents - Upload job documents
router.post('/jobs/:jobId/documents', authenticate, tierCheck('premium'), async (req: AuthenticatedRequest, res: Response) => {
    const { jobId } = req.params;
    // Assuming file upload middleware (e.g., multer) has processed files into req.files or req.file
    auditLog(req, 'Upload Job Documents', { jobId, userId: req.user?.userId, filesCount: (req as any).files?.length || (req as any).file ? 1 : 0 });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Integrate with file upload middleware and jobService to save document references
        // if (!req.files || req.files.length === 0) {
        //     return res.status(400).json({ status: 'error', message: 'No files uploaded.' });
        // }
        // const documentUrls = (req.files as any[]).map(file => file.location); // Assuming S3 URL after upload
        // await jobService.addJobDocuments(jobId, req.user?.userId, documentUrls);

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Documents uploaded for job ${jobId} by user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 500) { // CQS: <500ms response
            logger.warn(`Job document upload response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', message: 'Documents uploaded successfully.' });
    } catch (error) {
        logger.error(`Error uploading documents for job ${jobId} by user ${req.user?.userId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to upload documents.' });
    }
});

// Wow++ Tier: GET /bodyshop/jobs/predict-duration - Predict job duration
router.get('/jobs/:jobId/predict-duration', authenticate, tierCheck('wowplus'), async (req: AuthenticatedRequest, res: Response) => {
    const { jobId } = req.params;
    auditLog(req, 'Predict Job Duration', { jobId, userId: req.user?.userId });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call AI prediction service for job duration
        // const predictedDuration = await aiJobPredictorService.predictDuration(jobId, req.user?.userId);
        const predictedDuration = { jobId, durationDays: 7, confidence: 0.9, factors: ['damage complexity', 'parts availability'] }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Job duration prediction for ${jobId} served in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 1000) { // CQS: <1s API response (Wow++)
            logger.warn(`Job duration prediction response time exceeded 1s: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(200).json({ status: 'success', data: predictedDuration });
    } catch (error) {
        logger.error(`Error predicting job duration for ${jobId}:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to predict job duration.' });
    }
});

// Wow++ Tier: POST /bodyshop/jobs/:jobId/order-parts - Order parts for a job
router.post('/jobs/:jobId/order-parts', authenticate, tierCheck('wowplus'), validate(orderPartsSchema), async (req: AuthenticatedRequest, res: Response) => {
    const { jobId } = req.params;
    auditLog(req, 'Order Parts for Job', { jobId, userId: req.user?.userId, parts: req.body.parts });
    const startTime = process.hrtime.bigint();

    try {
        // Cod1+ TODO: Call partsOrderingService to order parts
        // const orderResult = await partsOrderingService.orderParts(jobId, req.user?.userId, req.body.parts);
        const orderResult = { orderId: uuidv4(), status: 'Initiated', totalCost: 500 }; // Mock

        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        logger.info(`Parts order for job ${jobId} initiated by user ${req.user?.userId} in ${responseTimeMs.toFixed(2)}ms.`);

        if (responseTimeMs > 1000) { // CQS: <1s API response (Wow++)
            logger.warn(`Parts order response time exceeded 1s: ${responseTimeMs.toFixed(2)}ms`);
        }

        res.status(201).json({ status: 'success', message: 'Parts order initiated.', order: orderResult });
    } catch (error) {
        logger.error(`Error ordering parts for job ${jobId} by user ${req.user?.userId}:`, error);
        // CQS: Rollback on payment failure (Wow++) - this would be handled by partsOrderingService
        res.status(500).json({ status: 'error', message: 'Failed to order parts.' });
    }
});

// --- General Error Handling Middleware ---
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if ((err as any).name === 'AccessDeniedError' || (err as any).name === 'NotAuthenticatedError') {
        logger.warn(`Access denied for user ${req.user?.userId || 'N/A'} on route ${req.originalUrl}: ${err.message}.`);
        return res.status(403).json({ status: 'error', message: err.message });
    }
    if (err instanceof z.ZodError) { // Catch Zod errors from validate middleware
        logger.warn(`Validation error in jobRoutes for route ${req.originalUrl}: ${err.errors.map(e => e.message).join(', ')}`);
        return res.status(400).json({ status: 'error', message: 'Invalid request data', errors: err.errors });
    }
    // CQS: Handle 409 (overbooking) - if service throws a specific error for this
    if ((err as any).name === 'JobOverbookingError') { // Example custom error from service
        logger.warn(`Job overbooking conflict on route ${req.originalUrl}: ${err.message}.`);
        return res.status(409).json({ status: 'error', message: err.message });
    }
    // CQS: Handle 429 (rate limits) - handled by rateLimiter middleware, but catch if it propagates
    if ((err as any).statusCode === 429) {
        logger.warn(`Rate limit exceeded for IP: ${req.ip} on route ${req.originalUrl}.`);
        return res.status(429).json({ status: 'error', message: 'Too many requests. Please try again later.' });
    }

    // For any other unhandled errors, log and send 500
    logger.error(`Unhandled error in jobRoutes for route ${req.originalUrl}:`, err);
    res.status(500).json({ status: 'error', message: 'An internal server error occurred.' });
});

export default router;