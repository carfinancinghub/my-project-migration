/**
 * © 2025 CFH, All Rights Reserved
 * File: evidence.validation.ts
 * Path: C:\CFH\backend\validation\evidence.validation.ts
 * Purpose: Defines Joi validation schemas for the evidence viewer controller.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-08 [1822]
 * Version: 1.0.0
 * Version ID: a6b5c4d3-e2f1-g0h9-i8j7-k6l5m4n3o2p1
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: a6b5c4d3-e2f1-g0h9-i8j7-k6l5m4n3o2p1
 * Save Location: C:\CFH\backend\validation\evidence.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getEvidenceByIdValidation = {
  params: Joi.object({
    evidenceId: objectIdSchema,
  }),
};