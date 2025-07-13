import mongoose from 'mongoose';
import { Escrow } from '@models/Escrow';
import { AnalyticsExportUtils } from '@utils/analyticsExportUtils';
import logger from '@config/logger';

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export interface EscrowDocument extends mongoose.Document {
  _id: string;
  user: string;
  status: string;
  vehicle: { vin: string; price: number };
  condition?: string;
  disputeId?: string;
}

export class EscrowService {
  static async createEscrow(data: {
    user: string;
    vehicle: { vin: string; price: number };
  }): Promise<EscrowDocument> {
    if (!data.user || !data.vehicle) {
      throw new BadRequestError('Missing required fields');
    }
    const escrow = new Escrow({
      user: data.user,
      status: 'PENDING',
      vehicle: data.vehicle,
    });
    await escrow.save();
    AnalyticsExportUtils.exportData({}, {}, {}, escrow._id);
    return escrow;
  }

  static async proposeCondition(escrowId: string, condition: string): Promise<EscrowDocument> {
    const escrow = await Escrow.findById(escrowId);
    if (!escrow) {
      throw new BadRequestError('Escrow not found');
    }
    escrow.condition = condition;
    await escrow.save();
    AnalyticsExportUtils.exportData({}, {}, {}, escrowId);
    return escrow;
  }

  static async initiateDispute(escrowId: string, userId: string): Promise<void> {
    const escrow = await Escrow.findById(escrowId);
    if (!escrow) {
      throw new BadRequestError('Escrow not found');
    }
    if (escrow.user !== userId) {
      throw new AuthorizationError('Unauthorized');
    }
    escrow.status = 'DISPUTED';
    escrow.disputeId = new mongoose.Types.ObjectId().toString();
    await escrow.save();
    AnalyticsExportUtils.exportData({}, {}, {}, escrowId);
  }
}

export default EscrowService;
