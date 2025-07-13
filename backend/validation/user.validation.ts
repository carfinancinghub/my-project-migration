/**
 * © 2025 CFH, All Rights Reserved
 * File: user.validation.ts
 * Path: C:\CFH\backend\validation\user.validation.ts
 * Purpose: Defines Joi validation schemas for the user controller.
 * Author: Mini Team, Grok
 * Date: 2025-07-07 [1539]
 * Version: 1.0.0
 * Version ID: q7r6s5t4-u3v2-w1x0-y9z8-a7b6c5d4e3f2
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: q7r6s5t4-u3v2-w1x0-y9z8-a7b6c5d4e3f2
 * Save Location: C:\CFH\backend\validation\user.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getMyProfileValidation = {
  params: Joi.object({}),
};

export const userIdValidation = {
  params: Joi.object({
    userId: objectIdSchema,
  }),
};

export const updateUserValidation = {
  params: Joi.object({
    userId: objectIdSchema,
  }),
  body: Joi.object({
    role: Joi.string().valid('admin', 'seller', 'buyer', 'judge', 'mechanic'),
    reputation: Joi.number(),
  }).min(1),
};