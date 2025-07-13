/*
File: analytics.validation.ts
Path: C:\CFH\backend\validation\analytics\analytics.validation.ts
Created: 2025-07-03 08:35 PDT
Author: Mini (AI Assistant)
Version: 1.1
Description: Validation schemas for analytics quality check and general analytics routes.
Artifact ID: z7a8b9c0-d1e2-f3g4-h5i6-j7k8l9m0n1o2
Version ID: b0c1d2e3-f4g5-6h7i-8j9k-0l1m2n3o4p5q
Purpose: Ensure data integrity for analytics API requests, including quality checks and dashboard data.
User Impact: Prevents invalid data from affecting analytics processing, improving reliability and security for all users.
*/

import logger from '@/utils/logger';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express'; // Import for validateRequest middleware

// Define common validation patterns or types if needed globally
const isoDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, "Invalid ISO 8601 date string");

// Custom Error Class for Validation Failures
export class ValidationError extends Error {
    public errors: z.ZodIssue[];
    constructor(message: string, errors: z.ZodIssue[]) {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

// --- Zod Schemas for Analytics Quality Check Endpoints ---

// Schema for basic quality check (Free Tier)
export const freeQualityCheckSchema = z.object({});

// Schema for detailed quality metrics (Premium Tier)
export const premiumQualityCheckSchema = z.object({
    dateRange: z.enum(['7d', '30d', '90d', 'mtd', 'qtd', 'ytd', 'custom']).optional().default('30d'),
    metrics: z.array(z.string()).optional(), // e.g., ['freshness', 'completeness', 'accuracy']
    startDate: isoDateString.optional(), // Required if dateRange is 'custom'
    endDate: isoDateString.optional(),   // Required if dateRange is 'custom'
}).refine(data => {
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
    searchTerm: z.string().optional(),
});

// --- Zod Schemas for General Analytics Dashboard Routes ---

// Schema for basic analytics data requests (GET /analytics/dashboard) - Free Tier
export const getBasicDashboardSchema = z.object({}); // No query parameters for basic dashboard

// Schema for detailed metrics requests (GET /analytics/data or /analytics/data/standard) - Standard/Premium Tier
export const getDetailedMetricsSchema = z.object({
    timeRange: z.enum(['7d', '30d', '90d', 'mtd', 'qtd', 'ytd', 'custom']).optional().default('30d'),
    module: z.enum(['Auctions', 'Services', 'Users', 'Disputes', 'All']).optional().default('All'),
    startDate: isoDateString.optional(),
    endDate: isoDateString.optional(),
    // Premium tier specific filters like segmentation options
    segmentation: z.object({
        ageGroup: z.string().optional(),
        gender: z.string().optional(),
        // Add more demographic/behavioral segments as needed
    }).optional(),
}).refine(data => {
    if (data.timeRange === 'custom') {
        return data.startDate !== undefined && data.endDate !== undefined;
    }
    return true;
}, {
    message: "startDate and endDate are required for 'custom' timeRange.",
    path: ["startDate", "endDate"]
});

// Schema for custom report generation (POST /analytics/custom) - Premium Tier
export const customReportGenerationSchema = z.object({
    reportType: z.string().min(3, "Report type must be at least 3 characters").max(50, "Report type cannot exceed 50 characters"),
    dimensions: z.array(z.string().min(1, "Dimension cannot be empty")).min(1, "At least one dimension is required"),
    metrics: z.array(z.string().min(1, "Metric cannot be empty")).min(1, "At least one metric is required"),
    timeRange: z.enum(['30d', '90d', 'mtd', 'qtd', 'ytd', 'custom']).default('30d'),
    startDate: isoDateString.optional(),
    endDate: isoDateString.optional(),
    segmentation: z.object({
        ageGroup: z.string().optional(),
        gender: z.string().optional(),
    }).optional(),
}).refine(data => {
    if (data.timeRange === 'custom') {
        return data.startDate !== undefined && data.endDate !== undefined;
    }
    return true;
}, {
    message: "startDate and endDate are required for 'custom' timeRange.",
    path: ["startDate", "endDate"]
});

// Schema for AI insights/forecasts (GET /analytics/forecast) - Wow++ Tier
export const getAIInsightsSchema = z.object({
    forecastType: z.enum(['sales', 'price', 'user_engagement']).optional().default('sales'),
    period: z.enum(['7d', '30d', '90d', '180d', '365d']).optional().default('90d'),
    scenario: z.enum(['optimistic', 'pessimistic', 'neutral']).optional().default('neutral'),
    nlpQuery: z.string().min(3).optional(), // For natural language queries
    exportFormat: z.enum(['csv', 'excel', 'pdf', 'json']).optional(), // For BI integration exports
});

// Schema for PDF export (POST /analytics/export) - Wow++ Tier
export const pdfExportSchema = z.object({
    reportId: z.string().uuid("Invalid report ID format").optional(), // If exporting a pre-generated report
    reportType: z.string().min(3).max(50).optional(), // If generating on-the-fly
    filters: z.record(z.string(), z.any()).optional(), // Filters to apply to the export
    emailRecipient: z.string().email("Invalid email format").optional(), // For scheduled reports
    schedule: z.enum(['daily', 'weekly', 'monthly']).optional(), // For scheduled reports
}).refine(data => data.reportId || data.reportType, {
    message: "Either reportId or reportType must be provided for export.",
});


/**
 * Validates query parameters for analytics quality check routes based on user tier.
 * @param tier The user's access tier ('free' | 'standard' | 'premium' | 'wowplus').
 * @param query The request query object to validate.
 * @returns The parsed and validated query object.
 * @throws {z.ZodError} If validation fails.
 * @deprecated Use `validateRequest` middleware directly in routes for better integration.
 */
export const validateQualityCheckQueryParams = (tier: 'free' | 'standard' | 'premium' | 'wowplus', query: any): any => {
    let schema: z.ZodObject<any, any>;

    switch (tier) {
        case 'free':
            schema = freeQualityCheckSchema;
            break;
        case 'standard':
            schema = freeQualityCheckSchema; // Currently same as free, but can be updated with standard-specific schema
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
        return schema.parse(query);
    } catch (error) {
        if (error instanceof z.ZodError) {
            logger.warn(`Validation error for quality check query (tier: ${tier}): ${error.errors.map(e => e.message).join(', ')}`);
            throw error;
        }
        throw new Error(`Unexpected validation error: ${error}`);
    }
};

/**
 * Generic validation middleware factory.
 * @param schema The Zod schema to validate the request body or query against.
 * @param type 'body' or 'query' to specify where to find the data to validate.
 */
export const validateRequest = (schema: z.ZodObject<any, any>, type: 'body' | 'query') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const startTime = performance.now(); // CQS: Performance monitoring for validation
        try {
            const dataToValidate = type === 'body' ? req.body : req.query;
            // CQS: Input sanitization is implicitly handled by Zod's parsing
            // For example, if a string is expected, Zod will not allow an object.
            // Further explicit sanitization (e.g., HTML escaping) would be done before saving to DB.
            const validatedData = schema.parse(dataToValidate);

            if (type === 'body') {
                req.body = validatedData;
            } else {
                req.query = validatedData;
            }
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.warn(`Validation error in ${type} for route ${req.path}: ${error.errors.map(e => e.message).join(', ')}`);
                next(new ValidationError(`Invalid ${type} parameters`, error.errors));
            } else {
                logger.error(`Unexpected validation error for route ${req.path}:`, error);
                next(new Error('An unexpected validation error occurred.'));
            }
        } finally {
            const endTime = performance.now();
            const validationTimeMs = endTime - startTime;
            if (validationTimeMs > 500) { // CQS: <500ms validation performance
                logger.warn(`Validation for ${req.path} (${type}) exceeded 500ms: ${validationTimeMs.toFixed(2)}ms`);
            }
        }
    };
};