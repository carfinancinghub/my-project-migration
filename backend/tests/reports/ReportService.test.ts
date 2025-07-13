import { ReportService } from '@services/reports/ReportService';
import { expect } from '@jest/globals';

describe('ReportService', () => {
  it('should generate report', async () => {
    const result = await ReportService.generateReport('user1');
    expect(result).toEqual({ report: 'mock' });
  });
});
