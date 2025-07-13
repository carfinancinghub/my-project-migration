/**
 * © 2025 CFH, All Rights Reserved
 * File: inspection.validation.ts
 * Path: C:\CFH\backend\validation\inspection.validation.ts
 * Purpose: Defines Joi validation schemas for the inspection controller.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-08 [1822]
 * Version: 1.0.0
 * Version ID: z7a6b5c4-d3e2-f1g0-h9i8-j7k6l5m4n3o2
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: z7a6b5c4-d3e2-f1g0-h9i8-j7k6l5m4n3o2
 * Save Location: C:\CFH\backend\validation\inspection.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getInspectionReportByIdValidation = {
  params: Joi.object({
    reportId: objectIdSchema,
  }),
};

export const getMyInspectionJobsValidation = {
  params: Joi.object({}),
};

export const createInspectionJobValidation = {
  body: Joi.object({
    vehicle: objectIdSchema,
    scheduledDate: Joi.date().iso().required(),
    assignedTo: objectIdSchema.optional(),
  }),
};

export const submitInspectionReportValidation = {
  params: Joi.object({
    jobId: objectIdSchema,
  }),
  body: Joi.object({
    condition: Joi.string().min(1).max(1000).required(),
    notes: Joi.string().max(5000).optional(),
    issuesFound: Joi.array().items(Joi.string()).optional(),
    photoUrls: Joi.array().items(Joi.string().uri()).optional(),
    voiceNotes: Joi.array().items(Joi.string().uri()).optional(),
  }),
};

export const getAllInspectionReportsValidation = {
  params: Joi.object({}),
};