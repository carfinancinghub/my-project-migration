/**
 * © 2025 CFH, All Rights Reserved
 * File: mock.validation.ts
 * Path: C:\CFH\backend\validation\mock.validation.ts
 * Purpose: Defines Joi validation schemas for the mock controller.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-08 [1607]
 * Version: 1.0.0
 * Version ID: v2w1x0y9-z8a7-b6c5-d4e3-f2g1h0i9j8k7
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: v2w1x0y9-z8a7-b6c5-d4e3-f2g1h0i9j8k7
 * Save Location: C:\CFH\backend\validation\mock.validation.ts
 */

import Joi from 'joi';

export const mockActionValidation = {
  params: Joi.object({}),
};