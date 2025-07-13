import { PaymentService } from '@services/payments/PaymentService';
import { expect } from '@jest/globals';

describe('PaymentService', () => {
  it('should process payment', async () => {
    const result = await PaymentService.processPayment('user1', 1000);
    expect(result).toEqual({ success: true });
  });
});
