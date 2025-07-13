import mongoose from 'mongoose';

export interface Auction extends mongoose.Document {
  id: string;
  vehicleId: string;
}

const auctionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  vehicleId: { type: String, required: true }
});

export const Auction = mongoose.model<Auction>('Auction', auctionSchema);
