/**
 * © 2025 CFH, All Rights Reserved
 * File: escrow.model.ts
 * Path: backend/models/escrow.model.ts
 * Purpose: Export EscrowTransaction model and TypeScript types for type-safe imports elsewhere
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1421]
 * Version: 1.0.1
 * Version ID: f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1
 * Save Location: backend/models/escrow.model.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Re-exports EscrowTransaction model with strong types
 * - Suggest test file at __tests__/models/escrow.model.test.ts
 * - Improved: All model fields/types included via EscrowTransaction import
 */

import { Model, Schema } from 'mongoose';
import EscrowTransactionModel from './EscrowTransaction';

export interface EscrowTransaction {
  contractId: Schema.Types.ObjectId;
  step: string;
  amount: number;
  currency: string;
  // etc: see EscrowTransaction.ts for full interface
}

export const EscrowTransaction: Model<EscrowTransaction> = EscrowTransactionModel;
