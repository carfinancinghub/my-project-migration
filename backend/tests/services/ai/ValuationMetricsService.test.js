// Date: 062625 [1000], © 2025 CFH
import { ValuationMetricsService } from '@services/ai/ValuationMetricsService';
describe('ValuationMetricsService', () => {
  const service = new ValuationMetricsService();
  it('calculates valuation metrics', async () => {
    const result = await service.calculateMetrics('vehicle1');
    expect(result).toHaveProperty('value');
  });
});
