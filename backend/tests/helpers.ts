import mongoose from 'mongoose';
import { EscrowDocument } from '@models/Escrow';

export const mockEscrowSave = jest.fn().mockImplementation((options?: mongoose.SaveOptions): Promise<EscrowDocument> => {
  return Promise.resolve({ _id: '1', user: 'user1', status: 'PENDING', vehicle: { vin: '123', price: 1000 } } as EscrowDocument);
});
