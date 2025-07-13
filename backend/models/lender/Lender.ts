import mongoose from 'mongoose';

export interface Lender extends mongoose.Document {
  id: string;
}

const lenderSchema = new mongoose.Schema({
  id: { type: String, required: true }
});

export const Lender = mongoose.model<Lender>('Lender', lenderSchema);
