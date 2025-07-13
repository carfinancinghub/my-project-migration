/**
 * © 2025 CFH, All Rights Reserved
 * File: dispute.validation.ts
 * Path: C:\CFH\backend\validation\dispute.validation.ts
 * Purpose: Defines Joi validation schemas for the dispute controller.
 * Author: Mini Team
 * Date: 2025-07-07 [00:46]
 * Version: 1.0.0
 * Version ID: j0k9l8m7-n6o5-p4q3-r2s1-t0u9v8w7x6y5
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: j0k9l8m7-n6o5-p4q3-r2s1-t0u9v8w7x6y5
 * Save Location: C:\CFH\backend\validation\dispute.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const createDisputeValidation = {
    body: Joi.object({
        contractId: objectIdSchema,
        title: Joi.string().min(5).max(100).required(),
        description: Joi.string().min(20).max(2000).required(),
        defendantId: objectIdSchema,
    }),
};

export const assignJudgesValidation = {
    params: Joi.object({
        disputeId: objectIdSchema,
    }),
    body: Joi.object({
        judges: Joi.array().items(objectIdSchema).min(1).required(),
    }),
};

export const submitVoteValidation = {
    params: Joi.object({
        disputeId: objectIdSchema,
    }),
    body: Joi.object({
        vote: Joi.string().valid('for_plaintiff', 'for_defendant').required(),
    }),
};
