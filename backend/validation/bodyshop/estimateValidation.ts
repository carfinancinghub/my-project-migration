/*
File: estimateValidation.ts
Path: C:\CFH\backend\validation\bodyshop\estimateValidation.ts
Created: 2025-07-04 13:20 PDT
Author: Mini (AI Assistant)
Version: 1.1
Description: Zod schemas for validating estimate-related API requests with refined validation rules.
Artifact ID: q8r9s0t1-u2v3-w4x5-y6z7-a8b9c0d1e2f3
Version ID: r9s0t1u2-v3w4-x5y6-z7a8-b9c0d1e2f3g4h5 // New unique ID for version 1.1
*/

import { z } from 'zod';
// Removed unused logger import as per instruction

// Reusing common patterns (assuming isoDateString is defined elsewhere or inline)
// This regex ensures ISO 8601 format including milliseconds and 'Z' for UTC
const isoDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, "Invalid ISO 8601 date string");

// --- Zod Schemas for Estimate Routes Endpoints ---

/**
 * Schema for `POST /bodyshop/estimates/webhook/insurance`
 * Validates the incoming payload from an insurance provider webhook.
 */
export const insuranceWebhookSchema = z.object({
    claimId: z.string().min(1, 'Claim ID is required'),
    userId: z.string().uuid('Invalid user ID format').optional(), // User associated with the estimate
    adjusterName: z.string().min(2, 'Adjuster name is required').optional(),
    insuredVehicle: z.object({
        make: z.string().min(1, 'Vehicle make is required'),
        model: z.string().min(1, 'Vehicle model is required'),
        // CQS: VIN sanitization with .transform() to trim whitespace and uppercase
        vin: z.string().min(17, 'VIN must be 17 characters').max(17, 'VIN must be 17 characters').regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Invalid VIN format").transform(val => val.trim().toUpperCase()),
    }, { required_error: "Insured vehicle details are required" }),
    damageCode: z.string().min(1).optional(),
    claimStatus: z.string().min(1).optional(), // e.g., 'Approved', 'Denied', 'Pending'
    preferredShops: z.array(z.string().uuid("Invalid shop ID in preferredShops")).optional(),
    // CQS: Add more fields as per actual insurance provider webhook specifications.
});

/**
 * Schema for `PATCH /bodyshop/estimates/:estimateId/set-expiry`
 * Validates the request body for setting an estimate's expiry date.
 */
export const setExpirySchema = z.object({
    // CQS: Use .superRefine() for robust date validation (future date, valid format)
    expiresAt: z.string().superRefine((val, ctx) => {
        const expiry = new Date(val);
        
        if (isNaN(expiry.getTime())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid date format for expiresAt. Must be a valid ISO 8601 string.',
                path: ['expiresAt'],
            });
        } else if (expiry <= new Date()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom, // Using custom for more specific message
                message: 'Expiry date must be in the future.',
                path: ['expiresAt'],
            });
        }
        // Ensure it also matches the ISO 8601 format regex if not already validated by a prior schema
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(val)) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Expiry date must be in ISO 8601 format (e.g., YYYY-MM-DDTHH:mm:ss.sssZ).',
                path: ['expiresAt'],
            });
        }
    }),
});

/**
 * Schema for `GET /bodyshop/estimates/reminders/pending`
 * Validates query parameters for fetching pending estimate reminders.
 */
export const pendingRemindersQuerySchema = z.object({
    userId: z.string().uuid('Invalid user ID format').optional(), // Filter by specific user's reminders
    shopId: z.string().uuid('Invalid shop ID format').optional(), // Filter by specific shop's reminders
    status: z.enum(['pending', 'sent']).optional().default('pending'), // Filter by reminder status
    type: z.enum(['estimate_expiry_warning', 'estimate_expiry_final', 'all']).optional().default('all'), // Filter by reminder type
    // CQS: All query parameters are optional, but validate format if present.
});

/**
 * Schema for `GET /bodyshop/estimates/:estimateId/resolve-conflict-suggestions`
 * Validates query parameters for fetching AI conflict resolution suggestions.
 */
export const resolveConflictSuggestionsQuerySchema = z.object({
    // No specific query parameters are strictly required for this endpoint based on documentation,
    // as estimateId is from path params. Add optional filters if needed.
    conflictType: z.string().optional(), // e.g., 'price_discrepancy', 'damage_disagreement'
    severity: z.enum(['low', 'medium', 'high']).optional(),
});

/**
 * Schema for `POST /bodyshop/estimates/:estimateId/resolve-with-ai`
 * Validates the request body for applying an AI-recommended resolution.
 */
export const resolveWithAISchema = z.object({
    resolutionId: z.string().uuid("Invalid resolution ID format"), // ID of the specific AI suggestion chosen
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
    optionSelected: z.string().min(1, "Selected option is required").max(100).optional(), // e.g., 'renegotiate_5_percent', 'escalate_to_mediator'
    // CQS: Ensure required fields are present and data types are correct.
    // CQS: Secure data handling: Ensure sensitive details are not passed directly or are encrypted.
});

/**
 * Schema for the request body when a shop responds to an estimate.
 * This is used for `PUT /bodyshop/estimates/:estimateId/respond`.
 */
export const respondEstimateSchema = z.object({
    quotedCost: z.number().positive("Quoted cost must be positive"),
    timelineDays: z.number().int().positive("Timeline must be a positive integer").optional(),
    details: z.string().min(10, "Details must be at least 10 characters").max(1000, "Details cannot exceed 1000 characters").optional(),
    // Add fields for parts, labor breakdown etc. if needed
});

/**
 * Schema for validating path parameter `estimateId` for routes.
 * This can be used in a middleware or directly in the route handler.
 */
export const estimateIdParamSchema = z.object({
    estimateId: z.string().uuid("Invalid estimate ID format in path parameter."),
});

// Example of how to integrate these schemas into routes (for documentation purposes, not part of this file):
/*
import { validateRequest } from '@/backend/utils/validation'; // Assuming a generic validation middleware
import { insuranceWebhookSchema, setExpirySchema, pendingRemindersQuerySchema, resolveWithAISchema, estimateIdParamSchema, respondEstimateSchema } from './estimateValidation';

router.post('/estimates/webhook/insurance', validateRequest(insuranceWebhookSchema, 'body'), async (req, res) => {
    // req.body is now validated
});

router.patch('/estimates/:estimateId/set-expiry', 
    (req, res, next) => { try { estimateIdParamSchema.parse(req.params); next(); } catch (e) { next(e); } },
    validateRequest(setExpirySchema, 'body'), async (req, res) => {
    // req.body and req.params are now validated
});

router.get('/estimates/reminders/pending', validateRequest(pendingRemindersQuerySchema, 'query'), async (req, res) => {
    // req.query is now validated
});

router.post('/estimates/:estimateId/resolve-with-ai', 
    (req, res, next) => { try { estimateIdParamSchema.parse(req.params); next(); } catch (e) { next(e); } },
    validateRequest(resolveWithAISchema, 'body'), async (req, res) => {
    // req.body and req.params are now validated
});

// For PUT /bodyshop/estimates/:estimateId/respond
router.put('/estimates/:estimateId/respond', 
    (req, res, next) => { try { estimateIdParamSchema.parse(req.params); next(); } catch (e) { next(e); } },
    validateRequest(respondEstimateSchema, 'body'), async (req, res) => {
    // req.body and req.params are now validated
});
*/