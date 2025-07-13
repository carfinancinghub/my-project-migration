import mongoose from 'mongoose';

export interface EscrowDocument extends mongoose.Document {
  _id: string;
  user: string;
  status: string;
  vehicle: { vin: string; price: number };
  condition?: string;
  disputeId?: string;
}

const escrowSchema = new mongoose.Schema({
  user: { type: String, required: true },
  status: { type: String, required: true },
  vehicle: {
    vin: { type: String, required: true },
    price: { type: Number, required: true }
  },
  condition: { type: String },
  disputeId: { type: String }
});

export const Escrow = mongoose.model<EscrowDocument>('Escrow', escrowSchema);
