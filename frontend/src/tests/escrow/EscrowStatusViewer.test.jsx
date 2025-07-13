```
// 👑 Crown Certified Test — EscrowStatusViewer.test.jsx
// Path: frontend/src/tests/escrow/EscrowStatusViewer.test.jsx
// Purpose: Unit tests for EscrowStatusViewer component, covering rendering, premium gating, API calls, and error states.
// Author: Rivers Auction Team — May 16, 2025

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EscrowStatusViewer from '@components/escrow/EscrowStatusViewer';
import { api } from '@services/api';
import logger from '@utils/logger';

jest.mock('@services/api');
jest.mock('@utils/logger', () => ({
  error: jest.fn(),
}));

describe('EscrowStatusViewer', () => {
  const mockTransactionId = 'tx1';
  const mockStatus = {
    transactionId: 'tx1',
    actionType: 'create',
    userId: 'u1',
    status: 'pending',
    createdAt: '2025-05-16T12:00:00Z',
  };
  const mockAuditTrail = [{ event: 'created', timestamp: '2025-05-16' }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders transaction status', async () => {
    api.get.mockResolvedValue({ data: { data: mockStatus } });

    render(<EscrowStatusViewer transactionId={mockTransactionId} isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText('Escrow Status')).toBeInTheDocument();
      expect(screen.getByText('tx1')).toBeInTheDocument();
      expect(screen.getByText('create')).toBeInTheDocument();
      expect(screen.getByText('u1')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(screen.getByTitle('Time-sensitive')).toBeInTheDocument();
    });
  });

  it('displays audit trail for premium users', async () => {
    api.get.mockResolvedValueOnce({ data: { data: mockStatus } });
    api.get.mockResolvedValueOnce({ data: { data: mockAuditTrail } });

    render(<EscrowStatusViewer transactionId={mockTransactionId} isPremium={true} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Load Audit Trail'));
    });

    await waitFor(() => {
      expect(screen.getByText('Blockchain Audit Trail')).toBeInTheDocument();
      expect(screen.getByText('created at 2025-05-16')).toBeInTheDocument();
    });
  });

  it('shows premium gate for non-premium users', async () => {
    api.get.mockResolvedValue({ data: { data: mockStatus } });

    render(<EscrowStatusViewer transactionId={mockTransactionId} isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText('Audit trail requires premium access')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    api.get.mockRejectedValue(new Error('Fetch failed'));

    render(<EscrowStatusViewer transactionId={mockTransactionId} isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load status')).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(`Failed to fetch status for ${mockTransactionId}`, expect.any(Error));
    });
  });

  it('handles audit trail fetch error for premium users', async () => {
    api.get.mockResolvedValueOnce({ data: { data: mockStatus } });
    api.get.mockRejectedValueOnce(new Error('Audit fetch failed'));

    render(<EscrowStatusViewer transactionId={mockTransactionId} isPremium={true} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Load Audit Trail'));
    });

    await waitFor(() => {
      expect(screen.getByText('Audit trail fetch failed')).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(`Failed to fetch audit trail for ${mockTransactionId}`, expect.any(Error));
    });
  });
});

/*
Functions Summary:
- describe('EscrowStatusViewer')
  - Purpose: Test suite for EscrowStatusViewer component
  - Tests:
    - Renders transaction status
    - Displays audit trail for premium users
    - Shows premium gate for non-premium users
    - Handles API errors
    - Handles audit trail fetch errors
  - Dependencies: react, @testing-library/react, @components/escrow/EscrowStatusViewer, @services/api, @utils/logger
*/
```