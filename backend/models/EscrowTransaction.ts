import mongoose from 'mongoose';

export interface IEscrowTransaction extends mongoose.Document {
  _id: string;
  user: string;
  status: string;
  vehicle: { vin: string; price: number };
}

const escrowTransactionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user: { type: String, required: true },
  status: { type: String, required: true },
  vehicle: {
    vin: { type: String, required: true },
    price: { type: Number, required: true }
  }
});

export const EscrowTransactionModel = mongoose.model<IEscrowTransaction>('EscrowTransaction', escrowTransactionSchema);
