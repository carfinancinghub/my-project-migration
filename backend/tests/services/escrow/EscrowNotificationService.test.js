// Date: 062625 [1000], © 2025 CFH
import { EscrowNotificationService } from '@services/escrow/EscrowNotificationService';
describe('EscrowNotificationService', () => {
  const service = new EscrowNotificationService();
  it('sends notification', async () => {
    const result = await service.sendNotification('tx1', 'user1', 'test');
    expect(result).toEqual({ status: 'sent' });
  });
});
