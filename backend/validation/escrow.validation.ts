/**
 * © 2025 CFH, All Rights Reserved
 * File: escrow.validation.ts
 * Path: C:\CFH\backend\validation\escrow.validation.ts
 * Purpose: Defines Joi validation schemas for the escrow controller.
 * Author: Mini Team
 * Date: 2025-07-07 [00:36]
 * Version: 1.0.0
 * Version ID: h8i7j6k5-l4m3-n2o1-p0q9-r8s7t6u5v4w3
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: h8i7j6k5-l4m3-n2o1-p0q9-r8s7t6u5v4w3
 * Save Location: C:\CFH\backend\validation\escrow.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const contractIdValidation = {
    params: Joi.object({
        contractId: objectIdSchema,
    }),
};

export const createContractValidation = {
    body: Joi.object({
        buyerId: objectIdSchema,
        sellerId: objectIdSchema,
        lenderId: objectIdSchema.optional(),
        // Add other required fields from the EscrowContract model
    }),
};

export const logTransactionValidation = {
    body: Joi.object({
        contractId: objectIdSchema,
        step: Joi.string().required(),
        amount: Joi.number().positive().required(),
        currency: Joi.string().length(3).uppercase().required(),
        notes: Joi.string().optional(),
    }),
};
