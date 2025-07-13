/**
 * @file escrow.repository.ts
 * @path C:\CFH\backend\repositories\escrow.repository.ts
 * @author Mini Team
 * @created 2025-06-10 [0823]
 * @purpose Abstracts all database interactions for the escrow module.
 * @user_impact Decouples business logic from the database, improving maintainability.
 * @version 1.0.0
 */
import { EscrowTransaction } from '../models/escrow.model';
export class EscrowRepository {
    async findById(id) {
        return EscrowTransaction.findById(id).exec();
    }
    async create(data) {
        const newTransaction = new EscrowTransaction(data);
        return newTransaction.save();
    }
    async update(id, updateData) {
        return EscrowTransaction.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
}
