/**
 * © 2025 CFH, All Rights Reserved
 * File: analytics.validation.ts
 * Path: C:\CFH\backend\validation\analytics.validation.ts
 * Purpose: Defines the Zod schema for validating analytics event payloads, supporting premium features like UUID tracing and Wow++ AI introspection.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-14 [1409]
 * Version: 1.1.0
 * Version ID: a7f8b3d2-9147-4a8f-923e-fb8e2cd9c1ea
 * Crown Certified: Yes (pending final test)
 * Batch ID: Compliance-071425
 * Artifact ID: a7f8b3d2-9147-4a8f-923e-fb8e2cd9c1ea
 * Save Location: C:\CFH\backend\validation\analytics.validation.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14T12:00:00Z
 */

import { z } from 'zod';
import logger from '@utils/logger'; // Alias import - assume tsconfig.paths set

// Allowable values for validation
const eventEnum = z.enum(['click', 'view', 'submit', 'purchase']);
const sourceEnum = z.enum(['web', 'mobile', 'api']);

const analyticsSchema = z.object({
  event: eventEnum,
  source: sourceEnum,
  timestamp: z
    .string()
    .datetime()
    .refine((ts) => {
      const now = new Date();
      const date = new Date(ts);
      return Math.abs(date.getTime() - now.getTime()) < 10 * 60 * 1000; // 10 min window
    }, {
      message: 'Timestamp is out of acceptable range.'
    }),
  userId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  payload: z.record(z.any()).optional(),

  // Premium fields
  sessionId: z.string().uuid().optional(),
  requestCorrelationId: z.string().uuid().optional(),

  // Wow++ feature: confidence score placeholder (future AI usage)
  confidenceScore: z.number().min(0).max(1).optional()
}).superRefine((data, ctx) => {
  try {
    // Wow++ anomaly flag (mock AI logic - expand with AIPricingEngine for real AI)
    if (data.payload && typeof data.payload === 'object' && 'anomaly' in data.payload) {
      logger.warn(`Anomaly flag detected in payload: ${JSON.stringify(data.payload)}`);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Payload contains anomaly flag.'
      });
    }
  } catch (error) {
    logger.error(`Validation error in superRefine: ${error.message}`);
  }
});

// Silent in tests if env set
if (process.env.NODE_ENV === 'test') {
  // Optional: Suppress logger in tests
  logger.transports.forEach((transport) => (transport.silent = true));
}

export type AnalyticsSchemaType = z.infer<typeof analyticsSchema>;
export default analyticsSchema;
