/*
File: validation.ts
Path: C:\CFH\backend\validation\analytics\validation.ts
Created: 2025-07-02 13:05 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Validation schemas for analytics quality check routes.
Artifact ID: z7a8b9c0-d1e2-f3g4-h5i6-j7k8l9m0n1o2
Version ID: a8b9c0d1-e2f3-g4h5-i6j7-k8l9m0n1o2p3
*/

import { z } from 'zod';
import logger from '@/utils/logger'; // Centralized logging utility

// Define common validation patterns or types if needed globally
// For example, a common date string format
const isoDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, "Invalid ISO 8601 date string");

// --- Zod Schemas for Analytics Quality Check Endpoints ---

// Schema for basic quality check (Free Tier)
// No query parameters expected for this endpoint, but defining an empty object for consistency.
export const freeQualityCheckSchema = z.object({});

// Schema for detailed quality metrics (Premium Tier)
export const premiumQualityCheckSchema = z.object({
    dateRange: z.enum(['7d', '30d', '90d', 'mtd', 'qtd', 'ytd', 'custom']).optional().default('30d'),
    metrics: z.array(z.string()).optional(), // e.g., ['freshness', 'completeness', 'accuracy']
    startDate: isoDateString.optional(), // Required if dateRange is 'custom'
    endDate: isoDateString.optional(),   // Required if dateRange is 'custom'
}).refine(data => {
    // Custom refinement for 'custom' dateRange
    if (data.dateRange === 'custom') {
        return data.startDate !== undefined && data.endDate !== undefined;
    }
    return true;
}, {
    message: "startDate and endDate are required for 'custom' dateRange.",
    path: ["startDate", "endDate"]
});

// Schema for AI-driven quality insights (Wow++ Tier)
export const wowPlusQualityCheckSchema = z.object({
    anomalyType: z.enum(['all', 'bid_discrepancy', 'user_inconsistency', 'data_freshness_alert']).optional().default('all'),
    confidenceThreshold: z.number().min(0).max(1).optional().default(0.7), // AI model confidence
    impactLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    // Allow for a general search term within insights
    searchTerm: z.string().optional(),
});

/**
 * Validates query parameters for analytics quality check routes based on user tier.
 * @param tier The user's access tier ('free' | 'standard' | 'premium' | 'wowplus').
 * @param query The request query object to validate.
 * @returns The parsed and validated query object.
 * @throws {z.ZodError} If validation fails.
 */
export const validateQualityCheckQueryParams = (tier: 'free' | 'standard' | 'premium' | 'wowplus', query: any): any => {
    let schema: z.ZodObject<any, any>;

    switch (tier) {
        case 'free':
            schema = freeQualityCheckSchema;
            break;
        case 'standard': // Standard tier might use basic parameters, or be restricted to default
            // For now, standard tier uses the same schema as free, but could be extended
            schema = freeQualityCheckSchema; // Or define a specific standardQualityCheckSchema
            break;
        case 'premium':
            schema = premiumQualityCheckSchema;
            break;
        case 'wowplus':
            schema = wowPlusQualityCheckSchema;
            break;
        default:
            logger.error(`validateQualityCheckQueryParams: Unknown tier '${tier}' provided. Falling back to free schema.`);
            schema = freeQualityCheckSchema;
    }

    try {
        // CQS: Ensure secure input handling by parsing through Zod
        return schema.parse(query);
    } catch (error) {
        if (error instanceof z.ZodError) {
            logger.warn(`Validation error for quality check query (tier: ${tier}): ${error.errors.map(e => e.message).join(', ')}`);
            // Re-throw the ZodError so the route handler can catch it and return 400
            throw error;
        }
        // For unexpected errors during validation, re-throw
        throw new Error(`Unexpected validation error: ${error}`);
    }
};

// Example of how to use in a route (for documentation purposes, not part of this file)
/*
import { validateQualityCheckQueryParams } from '@/backend/validation/analytics/validation';
router.get('/quality-check/detailed', authenticate, tierCheck('premium'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const validatedQueryParams = validateQualityCheckQueryParams(req.user?.tier || 'free', req.query);
        req.validatedQuery = validatedQueryParams; // Attach validated params to request for route handler
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ status: 'error', message: 'Invalid query parameters', errors: error.errors });
        } else {
            next(error); // Pass other errors
        }
    }
}, async (req: AuthenticatedRequest, res: Response) => {
    // Route logic using req.validatedQuery
});
*/