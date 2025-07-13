// File: BuyerFinancingModal.test.jsx
// Path: frontend/src/tests/buyer/BuyerFinancingModal.test.jsx
// Purpose: Unit tests for BuyerFinancingModal.jsx to verify AI financing logic and blockchain rendering
// Author: Cod1 (05101342 - PDT)
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BuyerFinancingModal from '@components/buyer/BuyerFinancingModal';

// Default mocks for success case
jest.mock('@services/ai/FinancingOptimizer', () => ({
  runEquityOptimizedFinancingMatch: jest.fn(() => Promise.resolve([
    { lender: 'Bank One', rate: 3.5, blockchainId: 'abc123' },
  ])),
}));

jest.mock('@components/blockchain/BlockchainTrailViewer', () => () => (
  <div>Mocked Blockchain Trail</div>
));

describe('BuyerFinancingModal', () => {
  it('displays invalid auction ID if none provided', () => {
    render(<BuyerFinancingModal />);
    expect(screen.getByText(/Invalid auction ID/i)).toBeInTheDocument();
  });

  it('renders financing options and blockchain trail', async () => {
    render(<BuyerFinancingModal auctionId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Bank One - 3.5% APR/i)).toBeInTheDocument();
      expect(screen.getByText(/Mocked Blockchain Trail/i)).toBeInTheDocument();
    });
  });

  it('displays error message when financing API call fails', async () => {
    jest.resetModules();
    jest.doMock('@services/ai/FinancingOptimizer', () => ({
      runEquityOptimizedFinancingMatch: jest.fn(() => Promise.reject(new Error('API failure')))
    }));
    const FaultyModal = require('@components/buyer/BuyerFinancingModal').default;
    render(<FaultyModal auctionId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load financing options/i)).toBeInTheDocument();
    });
  });

  it('renders fallback when blockchain trail fails', async () => {
    jest.resetModules();
    jest.doMock('@components/blockchain/BlockchainTrailViewer', () => {
      throw new Error('Blockchain failure');
    });
    const FaultyModal = require('@components/buyer/BuyerFinancingModal').default;
    render(<FaultyModal auctionId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Blockchain trail unavailable/i)).toBeInTheDocument();
    });
  });
});

/**
 * Functions Summary:
 * - displays invalid auction ID if none provided: Tests error message when no auctionId is passed.
 * - renders financing options and blockchain trail: Tests success path for AI + blockchain rendering.
 * - displays error message when financing API call fails: Tests financing API failure fallback.
 * - renders fallback when blockchain trail fails: Tests blockchain viewer error recovery.
 * Dependencies: React Testing Library, Mocked AI service, Mocked blockchain viewer
 */