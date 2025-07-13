import mongoose from 'mongoose';

export interface Dispute extends mongoose.Document {
  id: string;
}

const disputeSchema = new mongoose.Schema({
  id: { type: String, required: true }
});

export const Dispute = mongoose.model<Dispute>('Dispute', disputeSchema);
