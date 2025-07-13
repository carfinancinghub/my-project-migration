// Crown Certified Test — ContractSummary.test.jsx
// Path: frontend/src/tests/contracts/ContractSummary.test.jsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ContractSummary from '@/components/contracts/ContractSummary';
import ContractService from '@/services/contracts/ContractService';

jest.mock('@/services/contracts/ContractService');

describe('ContractSummary', () => {
  const mockContract = {
    contractId: 'c001',
    status: 'Active',
    buyer: { name: 'Buyer X' },
    seller: { name: 'Seller Y' },
    selectedBids: [{ provider: 'Lender A', amount: 12500 }],
    versionHistory: [{ version: 1, modifiedAt: '2025-05-01' }],
  };

  const mockAI = [
    'Clause 3.2 has above-average risk based on buyer profile.',
    'Bid competitiveness: selected lender was ranked 2nd lowest APR.',
  ];

  it('renders contract overview (free)', async () => {
    ContractService.getContractById.mockResolvedValue({
      contract: mockContract,
    });

    render(<ContractSummary contractId="c001" isPremium={false} />);
    await waitFor(() => expect(screen.getByText(/Active/i)).toBeInTheDocument());
    expect(screen.queryByText(/Clause/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Version History/)).not.toBeInTheDocument();
  });

  it('renders premium insights when isPremium is true', async () => {
    ContractService.getContractById.mockResolvedValue({
      contract: mockContract,
      aiInsights: mockAI,
    });

    render(<ContractSummary contractId="c001" isPremium={true} />);
    await waitFor(() => expect(screen.getByText(/Clause 3.2/i)).toBeInTheDocument());
    expect(screen.getByText(/Version History/)).toBeInTheDocument();
  });

  it('renders error on fetch failure', async () => {
    ContractService.getContractById.mockRejectedValue(new Error('500'));
    render(<ContractSummary contractId="fail" isPremium={false} />);
    await waitFor(() => expect(screen.getByText(/could not load/i)).toBeInTheDocument());
  });

  it('shows loading state initially', () => {
    render(<ContractSummary contractId="loading" isPremium={false} />);
    expect(screen.getByText(/loading contract summary/i)).toBeInTheDocument();
  });
});