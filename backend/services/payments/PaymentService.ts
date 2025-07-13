export class PaymentService {
  static async processPayment(userId: string, amount: number): Promise<any> {
    return { success: true };
  }
}
