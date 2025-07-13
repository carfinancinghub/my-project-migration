// (c) 2025 CFH, All Rights Reserved
// Purpose: Unit tests for LenderTermsExporter service
// Author: CFH Dev Team
// Date: 2025-06-25T00:00:00.000Z
// Version: 1.0.1
// Crown Certified: Yes
// Batch ID: Tests-062525
// Save Location: C:\CFH\backend\tests\services\lender\LenderTermsExporter.test.ts
import * as LenderTermsExporter from '@services/lender/LenderTermsExporter';

jest.mock('@services/lender/LenderTermsExporter');

describe('LenderTermsExporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exportTerms should return formatted terms', async () => {
    const terms = {
      loanAmount: 10000,
      interestRate: 5,
      durationMonths: 12,
    };
    const expectedOutput = {
      loanAmount: 10000,
      interestRate: 5,
      durationMonths: 12,
      formatted: 'Loan: $10000 at 5% for 12 months',
    };

    (LenderTermsExporter.exportTerms as jest.Mock).mockResolvedValue(expectedOutput);
    const result = await LenderTermsExporter.exportTerms(terms);

    expect(result).toEqual(expectedOutput);
    expect(LenderTermsExporter.exportTerms).toHaveBeenCalledWith(terms);
  });

  it('validateTerms should return true for valid terms', async () => {
    const validTerms = {
      loanAmount: 10000,
      interestRate: 5,
      durationMonths: 12,
    };

    (LenderTermsExporter.validateTerms as jest.Mock).mockResolvedValue(true);
    const result = await LenderTermsExporter.validateTerms(validTerms);

    expect(result).toBe(true);
    expect(LenderTermsExporter.validateTerms).toHaveBeenCalledWith(validTerms);
  });

  it('validateTerms should throw error for invalid terms', async () => {
    const invalidTerms = {
      loanAmount: -1000,
      interestRate: 5,
      durationMonths: 12,
    };

    (LenderTermsExporter.validateTerms as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid loan amount: must be positive');
    });

    await expect(LenderTermsExporter.validateTerms(invalidTerms)).rejects.toThrow('Invalid loan amount: must be positive');
  });
});

