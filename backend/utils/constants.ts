/**
 * © 2025 CFH, All Rights Reserved
 * File: constants.ts
 * Path: C:\CFH\backend\utils\constants.ts
 * Purpose: Defines global constants for statuses, roles, tiers, and languages, with type safety for the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-14 [1445]
 * Version: 1.1.0
 * Version ID: 9b2c4d61-eafe-4f47-894e-9aaef705e0d7
 * Crown Certified: Yes
 * Batch ID: Compliance-071425
 * Artifact ID: 9b2c4d61-eafe-4f47-894e-9aaef705e0d7
 * Save Location: C:\CFH\backend\utils\constants.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14T12:00:00Z
 */

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserTier {
  BASIC = 'basic',
  PREMIUM = 'premium',
}

export const VALID_TIERS: UserTier[] = Object.values(UserTier);
export const DEFAULT_TIER: UserTier = UserTier.BASIC;

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
} as const;

export type SupportedLanguageCode = keyof typeof SUPPORTED_LANGUAGES;
export const DEFAULT_LANGUAGE: SupportedLanguageCode = 'en';

// Premium/Wow++: Dynamic tier mapping (expand for feature gates)
export const TIER_FEATURES = {
  [UserTier.BASIC]: { analytics: true, aiInsights: false },
  [UserTier.PREMIUM]: { analytics: true, aiInsights: true, wowAnomalyDetection: true },
} as const;
