/**
 * © 2025 CFH, All Rights Reserved
 * File: verification.validation.ts
 * Path: C:\CFH\backend\validation\verification.validation.ts
 * Purpose: Defines Joi validation schemas for the verification controller.
 * Author: Mini Team, Grok
 * Date: 2025-07-07 [0135]
 * Version: 1.0.0
 * Version ID: o5p4q3r2-s1t0-u9v8-w7x6-y5z4a3b2c1d0
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: o5p4q3r2-s1t0-u9v8-w7x6-y5z4a3b2c1d0
 * Save Location: C:\CFH\backend\validation\verification.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getMyVerificationValidation = {
  params: Joi.object({}),
};

export const updateVerificationValidation = {
  params: Joi.object({
    userId: objectIdSchema,
  }),
  body: Joi.object({
    status: Joi.string().valid('Pending', 'Verified', 'Rejected').required(),
    idVerified: Joi.boolean(),
    addressVerified: Joi.boolean(),
    notes: Joi.string().optional().allow(''),
  }).min(1),
};