// File: EscrowStatusTracker.test.jsx
// Path: frontend/src/tests/EscrowStatusTracker.test.jsx
// Author: Cod5 (05051016, May 5, 2025, 10:16 PDT)
// Purpose: Unit tests and snapshot tests for EscrowStatusTracker.jsx to ensure reliable transaction tracking and visual consistency

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EscrowStatusTracker from '@components/escrow/EscrowStatusTracker';
import { fetchEscrowTransactions, updateEscrowStatus, triggerAutomatedRelease } from '@utils/escrowUtils';
import { subscribeToWebSocket } from '@lib/websocket';
import { toast } from 'react-toastify';

// Mock utilities
jest.mock('@utils/escrowUtils', () => ({
  fetchEscrowTransactions: jest.fn(),
  updateEscrowStatus: jest.fn(),
  triggerAutomatedRelease: jest.fn(),
}));
jest.mock('@lib/websocket', () => ({
  subscribeToWebSocket: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('EscrowStatusTracker', () => {
  const mockTransactions = [
    { id: '1', buyerId: 'B123', sellerId: 'S456', status: 'Pending', amount: 15000 },
    { id: '2', buyerId: 'B789', sellerId: 'S012', status: 'In Progress', amount: 20000 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchEscrowTransactions as jest.Mock).mockResolvedValue(mockTransactions);
    (updateEscrowStatus as jest.Mock).mockResolvedValue(undefined);
    (triggerAutomatedRelease as jest.Mock).mockResolvedValue(undefined);
    (subscribeToWebSocket as jest.Mock).mockReturnValue(jest.fn());
  });

  it('renders escrow transactions and updates status', async () => {
    render(<EscrowStatusTracker isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText(/Escrow Status Tracker/i)).toBeInTheDocument();
      expect(screen.getByText(/Transaction ID: 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Status: Pending/i)).toBeInTheDocument();
    });

    const updateButton = screen.getByRole('button', { name: /Set In Progress/i });
    await userEvent.click(updateButton);

    await waitFor(() => {
      expect(updateEscrowStatus).toHaveBeenCalledWith('1', 'In Progress');
      expect(toast.success).toHaveBeenCalledWith('Transaction 1 updated to In Progress!');
    });
  });

  it('triggers automated release and WebSocket alerts for premium users', async () => {
    render(<EscrowStatusTracker isPremium={true} />);

    await waitFor(() => {
      expect(subscribeToWebSocket).toHaveBeenCalledWith('escrow-updates', expect.any(Function));
      expect(screen.getByRole('button', { name: /Auto Release/i })).toBeInTheDocument();
    });

    const releaseButton = screen.getByRole('button', { name: /Auto Release/i });
    await userEvent.click(releaseButton);

    await waitFor(() => {
      expect(triggerAutomatedRelease).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Transaction 1 released automatically!');
    });
  });

  it('shows premium gating message when not premium', async () => {
    render(<EscrowStatusTracker isPremium={false} />);

    await waitFor(() => {
      expect(subscribeToWebSocket).not.toHaveBeenCalled();
      expect(screen.queryByRole('button', { name: /Auto Release/i })).not.toBeInTheDocument();
      expect(screen.getByText(/Upgrade to Enterprise to access analytics/i)).toBeInTheDocument();
    });
  });

  it('handles transaction fetch error', async () => {
    (fetchEscrowTransactions as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
    render(<EscrowStatusTracker isPremium={false} />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load transactions.');
    });
  });

  it('disables buttons during loading', async () => {
    render(<EscrowStatusTracker isPremium={true} />);

    const updateButton = await screen.findByRole('button', { name: /Set In Progress/i });
    await userEvent.click(updateButton);

    expect(updateButton).toBeDisabled();
    await waitFor(() => {
      expect(updateButton).not.toBeDisabled();
    });
  });

  // Snapshot Tests
  it('matches snapshot for free transaction list', async () => {
    const { container } = render(<EscrowStatusTracker isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText(/Transaction ID: 1/i)).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot for premium transaction list with automated release', async () => {
    const { container } = render(<EscrowStatusTracker isPremium={true} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Auto Release/i })).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });
});