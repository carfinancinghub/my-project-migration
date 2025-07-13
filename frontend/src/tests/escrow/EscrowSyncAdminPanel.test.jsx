```
// 👑 Crown Certified Test — EscrowSyncAdminPanel.test.jsx
// Path: frontend/src/tests/escrow/EscrowSyncAdminPanel.test.jsx
// Purpose: Unit tests for EscrowSyncAdminPanel component, covering rendering, premium gating, API calls, and error states.
// Author: Rivers Auction Team — May 16, 2025

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EscrowSyncAdminPanel from '@components/escrow/EscrowSyncAdminPanel';
import { api } from '@services/api';
import logger from '@utils/logger';

jest.mock('@services/api');
jest.mock('@utils/logger', () => ({
  error: jest.fn(),
}));

describe('EscrowSyncAdminPanel', () => {
  const mockUserId = 'admin1';
  const mockTransactions = [
    { transactionId: 'tx1', actionType: 'create', userId: 'u1', status: 'pending', createdAt: '2025-05-16T12:00:00Z' },
    { transactionId: 'tx2', actionType: 'update', userId: 'u2', status: 'completed', createdAt: '2025-05-16T13:00:00Z' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders transaction list and sync form', async () => {
    api.get.mockResolvedValue({ data: { data: mockTransactions } });

    render(<EscrowSyncAdminPanel userId={mockUserId} isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText('Escrow Sync Admin Panel')).toBeInTheDocument();
      expect(screen.getByText('Transaction ID')).toBeInTheDocument();
      expect(screen.getByText('tx1')).toBeInTheDocument();
      expect(screen.getByLabelText('Transaction ID')).toBeInTheDocument();
      expect(screen.getByText('Sync Escrow Action')).toBeInTheDocument();
    });
  });

  it('displays urgency indicator for pending transactions', async () => {
    api.get.mockResolvedValue({ data: { data: mockTransactions } });

    render(<EscrowSyncAdminPanel userId={mockUserId} isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByTitle('Time-sensitive')).toBeInTheDocument();
    });
  });

  it('submits sync form and updates transactions', async () => {
    api.get.mockResolvedValue({ data: { data: mockTransactions } });
    api.post.mockResolvedValue({ data: { data: { record: { transactionId: 'tx3', status: 'pending' } } } });

    render(<EscrowSyncAdminPanel userId={mockUserId} isPremium={false} />);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Transaction ID'), { target: { value: 'tx3' } });
      fireEvent.change(screen.getByLabelText('Action Type'), { target: { value: 'create' } });
      fireEvent.change(screen.getByLabelText('User ID'), { target: { value: 'u3' } });
      fireEvent.click(screen.getByText('Sync Escrow Action'));
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/api/escrow/sync',
        expect.objectContaining({ transactionId: 'tx3', actionType: 'create', userId: 'u3' }),
        expect.any(Object)
      );
      expect(screen.getByText('tx3')).toBeInTheDocument();
    });
  });

  it('displays audit trail for premium users', async () => {
    api.get.mockResolvedValueOnce({ data: { data: mockTransactions } });
    api.get.mockResolvedValueOnce({ data: { data: [{ event: 'created', timestamp: '2025-05-16' }] } });

    render(<EscrowSyncAdminPanel userId={mockUserId} isPremium={true} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('tx1'));
    });

    await waitFor(() => {
      expect(screen.getByText('Audit Trail')).toBeInTheDocument();
      expect(screen.getByText('created at 2025-05-16')).toBeInTheDocument();
    });
  });

  it('shows premium gate for non-premium users', async () => {
    api.get.mockResolvedValue({ data: { data: mockTransactions } });

    render(<EscrowSyncAdminPanel userId={mockUserId} isPremium={false} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('tx1'));
    });

    expect(screen.getByText('Audit trail requires premium access')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    api.get.mockRejectedValue(new Error('Fetch failed'));

    render(<EscrowSyncAdminPanel userId={mockUserId} isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load transactions')).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch escrow transactions', expect.any(Error));
    });
  });
});

/*
Functions Summary:
- describe('EscrowSyncAdminPanel')
  - Purpose: Test suite for EscrowSyncAdminPanel component
  - Tests:
    - Renders transaction list and sync form
    - Displays urgency indicators
    - Submits sync form and updates transactions
    - Displays audit trail for premium users
    - Shows premium gate for non-premium users
    - Handles API errors
  - Dependencies: react, @testing-library/react, @components/escrow/EscrowSyncAdminPanel, @services/api, @utils/logger
*/
```