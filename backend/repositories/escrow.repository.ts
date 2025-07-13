import { EscrowTransactionModel, IEscrowTransaction } from '@models/EscrowTransaction';

export class EscrowRepository {
  static async findById(id: string): Promise<IEscrowTransaction | null> {
    return EscrowTransactionModel.findById(id);
  }

  static async create(data: IEscrowTransaction): Promise<IEscrowTransaction> {
    const transaction = new EscrowTransactionModel(data);
    return transaction.save();
  }

  static async update(id: string, data: Partial<IEscrowTransaction>): Promise<IEscrowTransaction | null> {
    return EscrowTransactionModel.findByIdAndUpdate(id, data, { new: true });
  }
}
