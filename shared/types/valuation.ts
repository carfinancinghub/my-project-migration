/*
 * File: valuation.ts
 * Path: C:\CFH\shared\types\valuation.ts
 * Created: 2025-06-30 19:30 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Shared TypeScript types for the Vehicle Valuation feature.
 * Artifact ID: types-valuation-shared
 * Version ID: types-valuation-shared-v1.0.0
 */

export type UserTier = 'Free' | 'Standard' | 'Premium' | 'Wow++';

export interface ValuationResult {
  tradeIn: number;
  privateParty: number;
  marketComparison?: object;
  valueForecast?: object;
}

export interface ValuatedVehicle {
  id: string;
  vin: string;
  name: string;
  value: number;
  lastUpdated: string;
}
