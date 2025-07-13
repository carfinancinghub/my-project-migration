/**
 * © 2025 CFH, All Rights Reserved
 * File: listing.validation.ts
 * Path: C:\CFH\backend\validation\listing.validation.ts
 * Purpose: Defines Joi validation schemas for the listing controller.
 * Author: Mini Team
 * Date: 2025-07-06 [21:27]
 * Version: 1.0.0
 * Version ID: c4d3e2f1-g0h9-i8j7-k6l5-m4n3o2p1q0r9
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: c4d3e2f1-g0h9-i8j7-k6l5-m4n3o2p1q0r9
 * Save Location: C:\CFH\backend\validation\listing.validation.ts
 */

/*
 * --- Side Note: Implementation Details ---
 *
 * 1.  Schema Design:
 * - Created three distinct validation objects (`getListingByIdValidation`, `createListingValidation`, `updateListingValidation`) to handle different controller actions.
 * - A reusable `objectIdSchema` ensures that all ID parameters (`id`, `carId`, `auctionId`) are validated as 24-character hexadecimal strings, which is the standard format for MongoDB ObjectIDs.
 *
 * 2.  Field Validation:
 * - `createListingValidation`: Enforces that `carId` is required. `auctionId` is optional, as a listing might not always be part of an auction. `isFeatured` is a boolean, and `expiresAt` is validated as a date.
 * - `updateListingValidation`: Requires at least one field to be present in the request body to prevent empty updates.
 */

import Joi from 'joi';

// Reusable schema for MongoDB ObjectId validation
const objectIdSchema = Joi.string().hex().length(24).required();

export const getListingByIdValidation = {
    params: Joi.object({
        id: objectIdSchema.messages({
            'string.hex': 'Listing ID must be a valid ID.',
            'string.length': 'Listing ID must be 24 characters long.',
        }),
    }),
};

export const createListingValidation = {
    body: Joi.object({
        carId: objectIdSchema.messages({
            'string.hex': 'Car ID must be a valid ID.',
            'string.length': 'Car ID must be 24 characters long.',
        }),
        auctionId: Joi.string().hex().length(24).optional(),
        isFeatured: Joi.boolean().default(false),
        expiresAt: Joi.date().iso().greater('now').optional(),
    }),
};

export const updateListingValidation = {
    params: Joi.object({
        id: objectIdSchema,
    }),
    body: Joi.object({
        isFeatured: Joi.boolean(),
        expiresAt: Joi.date().iso().greater('now'),
        status: Joi.string().valid('Active', 'Inactive', 'Sold'),
    }).min(1), // Require at least one field to be present for an update
};
