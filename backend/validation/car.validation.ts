/**
 * © 2025 CFH, All Rights Reserved
 * File: car.validation.ts
 * Path: C:\CFH\backend\validation\car.validation.ts
 * Purpose: Defines Joi validation schemas for the car controller.
 * Author: Mini Team, Grok
 * Date: 2025-07-07 [0126]
 * Version: 1.0.2
 * Version ID: l2m1n0o9-p8q7-r6s5-t4u3-v2w1x0y9z8a7
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: l2m1n0o9-p8q7-r6s5-t4u3-v2w1x0y9z8a7
 * Save Location: C:\CFH\backend\validation\car.validation.ts
 */

/*
 * --- Side Note: Implementation Details ---
 *
 * 1. Schema Design [Mini]:
 * - Created validation schemas for `getCarById`, `createCar`, and `updateCar`.
 * - Used `objectIdSchema` for MongoDB ObjectId validation.
 *
 * 2. Field Validation [Mini]:
 * - `createCarValidation`: Enforces required fields (`make`, `model`, `year`, `price`).
 * - `updateCarValidation`: Allows partial updates with at least one field.
 *
 * 3. Enhancements [Grok]:
 * - Updated Author and Timestamp to distinguish from Mini’s version.
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getCarByIdValidation = {
  params: Joi.object({
    carId: objectIdSchema,
  }),
};

export const createCarValidation = {
  body: Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
    price: Joi.number().positive().required(),
    customMake: Joi.string().optional().allow(''),
    customModel: Joi.string().optional().allow(''),
  }),
};

export const updateCarValidation = {
  params: Joi.object({
    carId: objectIdSchema,
  }),
  body: Joi.object({
    make: Joi.string(),
    model: Joi.string(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
    price: Joi.number().positive(),
    customMake: Joi.string().optional().allow(''),
    customModel: Joi.string().optional().allow(''),
    status: Joi.string().valid('Available', 'Sold', 'Pending'),
  }).min(1),
};