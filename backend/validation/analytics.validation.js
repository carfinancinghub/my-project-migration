/**

� 2025 CFH, All Rights Reserved
Purpose: Analytics validation schemas for the CFH Automotive Ecosystem
Author: CFH Dev Team
Date: 2025-06-23T12:57:00.000Z
Version: 1.0.0
Crown Certified: Yes
Batch ID: Validation-062325
Save Location: C:\CFH\backend\validation\analytics.validation.ts */ import Joi from 'joi';
export const customReportSchema = Joi.object({
    reportType: Joi.string().valid('sales', 'traffic', 'user').required(),
    dateRange: Joi.object({
        start: Joi.date().iso().required(),
        end: Joi.date().iso().required()
    }).required()
});
export const exportReportSchema = Joi.object({
    format: Joi.string().valid('csv', 'pdf', 'json').required(),
    reportId: Joi.string().uuid().required()
});
