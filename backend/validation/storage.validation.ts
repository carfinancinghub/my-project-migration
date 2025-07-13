/**
 * © 2025 CFH, All Rights Reserved
 * File: storage.validation.ts
 * Path: C:\CFH\backend\validation\storage.validation.ts
 * Purpose: Defines Joi validation schemas for the StorageHostController.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [1737]
 * Version: 1.0.1
 * Version ID: u2v1w0x9-y8z7-a6b5-c4d3-e2f1g0h9i8j7
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: u2v1w0x9-y8z7-a6b5-c4d3-e2f1g0h9i8j7
 * Save Location: C:\CFH\backend\validation\storage.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getStorageListingsValidation = {
  params: Joi.object({
    hostId: objectIdSchema,
  }),
  query: Joi.object({
    isAvailable: Joi.boolean().optional(),
    minPrice: Joi.number().positive().optional(),
    maxPrice: Joi.number().positive().optional(),
  }).optional(),
};

export const createStorageListingValidation = {
  params: Joi.object({
    hostId: objectIdSchema,
  }),
  body: Joi.object({
    location: Joi.string().required(),
    pricePerDay: Joi.number().positive().required(),
    capacity: Joi.string().required(),
    amenities: Joi.array().items(Joi.string()).optional(),
    description: Joi.string().optional(),
  }),
};

export const updateStorageListingValidation = {
  params: Joi.object({
    hostId: objectIdSchema,
    listingId: objectIdSchema,
  }),
  body: Joi.object({
    pricePerDay: Joi.number().positive(),
    capacity: Joi.string(),
    amenities: Joi.array().items(Joi.string()),
    description: Joi.string(),
    isAvailable: Joi.boolean(),
  }).min(1),
};

export const deleteStorageListingValidation = {
  params: Joi.object({
    hostId: objectIdSchema,
    listingId: objectIdSchema,
  }),
};