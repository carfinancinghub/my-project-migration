/**
 * © 2025 CFH, All Rights Reserved
 * File: errors.ts
 * Path: C:\CFH\backend\utils\errors.ts
 * Purpose: Centralized error message constants with codes and structured mapping for the CFH Automotive Ecosystem, supporting premium localization and Wow++ AI rewrites.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-14 [1512]
 * Version: 1.1.0
 * Version ID: 8c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f
 * Crown Certified: Yes (pending final test)
 * Batch ID: Compliance-071425
 * Artifact ID: 8c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f
 * Save Location: C:\CFH\backend\utils\errors.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14T12:00:00Z
 */

export const ERROR_MESSAGES = {
  INVALID_TIER: {
    code: 'E101',
    message: 'Invalid user tier provided.',
  },
  MISSING_PARAMETERS: {
    code: 'E102',
    message: 'Required parameters are missing.',
  },
  UNAUTHORIZED: {
    code: 'E401',
    message: 'Unauthorized access attempt detected.',
  },
  UNKNOWN_ERROR: {
    code: 'E500',
    message: 'An unknown error occurred. Please try again later.',
  },
} as const;

export type ErrorKey = keyof typeof ERROR_MESSAGES;

/**
 * Retrieves the error details for a given key, with env-based verbosity.
 * @param key The error key to lookup.
 * @returns The error code and message.
 */
export function getErrorMessage(key: ErrorKey): { code: string; message: string } {
  const err = ERROR_MESSAGES[key];
  // Premium: Env override for dev verbosity
  if (process.env.NODE_ENV === 'development') {
    err.message += ' (Dev mode: Check console for stack trace)';
  }
  return err;
}

// Wow++: Placeholder for AI-rewritten messages (e.g., user-friendly versions)
export function getAIErrorMessage(key: ErrorKey): string {
  // Future: Integrate AIPricingEngine or similar for dynamic rewrites
  return getErrorMessage(key).message; // Mock for now
}
