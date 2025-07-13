// File: BuyerContractView.test.jsx
// Path: frontend/src/tests/buyer/BuyerContractView.test.jsx
// Purpose: Test contract rendering and premium gating
// Author: Cod1 - Rivers Auction QA
// Date: May 14, 2025
// 👑 Cod1 Crown Certified

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import BuyerContractView from '@components/buyer/BuyerContractView';

jest.mock('axios');

describe('BuyerContractView Component', () => {
  const mockContract = {
    vehicle: 'Tesla Model Y',
    buyerName: 'John Doe',
    amount: 42000,
    status: 'Signed',
    signatureData: { signer: 'John Doe', signedAt: '2025-05-01' },
  };

  it('displays contract details (free user)', async () => {
    axios.get.mockResolvedValueOnce({ data: { contract: mockContract } });

    render(<BuyerContractView contractId="abc123" isPremium={false} />);
    await waitFor(() => expect(screen.getByText(/Tesla Model Y/)).toBeInTheDocument());
    expect(screen.getByText(/E-signature status and contract analytics/)).toBeInTheDocument();
  });

  it('shows signature viewer for premium', async () => {
    axios.get.mockResolvedValueOnce({ data: { contract: mockContract } });

    render(<BuyerContractView contractId="abc123" isPremium={true} />);
    await waitFor(() => expect(screen.getByText(/Signed/)).toBeInTheDocument());
  });

  it('shows error on fetch failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Server crash'));
    render(<BuyerContractView contractId="fail" isPremium />);
    await waitFor(() =>
      expect(screen.getByText(/Unable to load contract details/)).toBeInTheDocument()
    );
  });
});
