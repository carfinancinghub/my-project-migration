import mongoose from 'mongoose';

export interface InsurancePolicy extends mongoose.Document {
  region: string;
  policyId: string;
}

const insurancePolicySchema = new mongoose.Schema({
  region: { type: String, required: true },
  policyId: { type: String, required: true }
});

export const InsurancePolicy = mongoose.model<InsurancePolicy>('InsurancePolicy', insurancePolicySchema);
