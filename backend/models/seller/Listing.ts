import mongoose from 'mongoose';

export interface Listing extends mongoose.Document {
  id: string;
}

const listingSchema = new mongoose.Schema({
  id: { type: String, required: true }
});

export const Listing = mongoose.model<Listing>('Listing', listingSchema);
