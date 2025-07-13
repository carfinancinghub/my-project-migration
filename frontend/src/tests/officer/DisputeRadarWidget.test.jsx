import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DisputeRadarWidget from '../DisputeRadarWidget';
import DisputeService from '@services/dispute/DisputeService';
import LiveUpdates from '@services/websocket/LiveUpdates';
import logger from '@utils/logger';

// 👑 Crown Certified Test Suite
// Path: frontend/src/tests/officer/DisputeRadarWidget.test.jsx
// Purpose: Validate rendering, WebSocket updates, premium alerts, filter functionality, error handling
// Author: Rivers Auction Team
// Date: May 18, 2025
// Cod2 Crown Certified
// @aliases: @components/officer/DisputeRadarWidget, @services/dispute/DisputeService, @services/websocket/LiveUpdates, @utils/logger

vi.mock('@services/dispute/DisputeService');
vi.mock('@services/websocket/LiveUpdates');
vi.mock('@utils/logger');
vi.mock('@components/common/DisputeDisplay', () => ({
  default: ({ disputes, filters, onFilterChange }) => (
    <div data-testid="dispute-display">
      {disputes.map((d) => (
        <div key={d.id} data-testid={`dispute-${d.id}`}>{d.description}</div>
      ))}
      <select
        data-testid="timeframe-filter"
        value={filters.timeframe}
        onChange={(e) => onFilterChange({ ...filters, timeframe: e.target.value })}
      >
        <option value="all">All</option>
        <option value="last7d">Last 7 Days</option>
      </select>
      <select
        data-testid="type-filter"
        value={filters.type}
        onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
      >
        <option value="all">All</option>
        <option value="shipping">Shipping</option>
      </select>
      <select
        data-testid="severity-filter"
        value={filters.severity}
        onChange={(e) => onFilterChange({ ...filters, severity: e.target.value })}
      >
        <option value="all">All</option>
        <option value="high">High</option>
      </select>
    </div>
  ),
}));

const mockDisputes = [
  { id: 'd1', description: 'Late shipment', type: 'shipping', severity: 'medium', createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
  { id: 'd2', description: 'Item issue', type: 'item_condition', severity: 'high', createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
];

const mockHotspots = [
  { severity: 'High', auctionId: 'a1', role: 'buyer', message: 'Hotspot detected' },
];

describe('DisputeRadarWidget', () => {
  let socket;

  beforeEach(() => {
    vi.clearAllMocks();
    DisputeService.getDisputeClusters.mockResolvedValue({ data: mockDisputes });
    DisputeService.getHotspots.mockResolvedValue(mockHotspots);
    socket = { on: vi.fn(), connect: vi.fn(), disconnect: vi.fn() };
    LiveUpdates.connect.mockReturnValue(socket);
  });

  it('renders disputes for free users', async () => {
    render(<DisputeRadarWidget officerId="officer123" isPremium={false} filters={{ timeframe: 'all', type: 'all', severity: 'all' }} />);
    await waitFor(() => {
      expect(screen.getByText('Dispute Radar')).toBeInTheDocument();
      expect(screen.getByTestId('dispute-d1')).toHaveTextContent('Late shipment');
      expect(screen.getByTestId('dispute-d2')).toHaveTextContent('Item issue');
      expect(screen.queryByText('Hotspot Alerts')).not.toBeInTheDocument();
    });
  });

  it('renders premium hotspot alerts and heatmap toggle', async () => {
    render(<DisputeRadarWidget officerId="officer123" isPremium={true} filters={{ timeframe: 'all', type: 'all', severity: 'all' }} />);
    await waitFor(() => {
      expect(screen.getByText('Hotspot Alerts')).toBeInTheDocument();
      expect(screen.getByText('High Dispute Cluster: a1 (buyer)')).toBeInTheDocument();
      expect(screen.getByText('Show Heatmap')).toBeInTheDocument();
    });
  });

  it('toggles heatmap visibility for premium users', async () => {
    render(<DisputeRadarWidget officerId="officer123" isPremium={true} filters={{ timeframe: 'all', type: 'all', severity: 'all' }} />);
    await waitFor(() => {
      expect(screen.getByText('Show Heatmap')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Show Heatmap'));
    await waitFor(() => {
      expect(screen.getByRole('canvas', { name: 'Dispute Heatmap' })).toBeInTheDocument();
      expect(screen.getByText('Hide Heatmap')).toBeInTheDocument();
    });
  });

  it('filters disputes by type', async () => {
    render(<DisputeRadarWidget officerId="officer123" isPremium={false} filters={{ timeframe: 'all', type: 'all', severity: 'all' }} />);
    await waitFor(() => {
      expect(screen.getByTestId('dispute-d1')).toBeInTheDocument();
      expect(screen.getByTestId('dispute-d2')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('type-filter'), { target: { value: 'shipping' } });
    await waitFor(() => {
      expect(screen.getByTestId('dispute-d1')).toBeInTheDocument();
      expect(screen.queryByTestId('dispute-d2')).not.toBeInTheDocument();
    });
  });

  it('handles WebSocket dispute updates', async () => {
    render(<DisputeRadarWidget officerId="officer123" isPremium={true} filters={{ timeframe: 'all', type: 'all', severity: 'all' }} />);
    await waitFor(() => {
      expect(screen.getByTestId('dispute-d1')).toBeInTheDocument();
    });
    socket.on.mock.calls[0][1]({
      officerId: 'officer123',
      dispute: { id: 'd3', description: 'New dispute', type: 'payment', severity: 'low' },
    });
    await waitFor(() => {
      expect(screen.getByTestId('dispute-d3')).toHaveTextContent('New dispute');
    });
  });

  it('handles WebSocket errors with retries', async () => {
    render(<DisputeRadarWidget officerId="officer123" isPremium={true} filters={{ timeframe: 'all', type: 'all', severity: 'all' }} />);
    socket.on.mock.calls[1][1]({ message: 'Connection failed' });
    await waitFor(() => {
      expect(screen.getByText(/Retrying \(1\/3\)/)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('WebSocket error'));
    });
  });

  it('triggers manual WebSocket retry', async () => {
    render(<DisputeRadarWidget officerId="officer123" isPremium={true} filters={{ timeframe: 'all', type: 'all', severity: 'all' }} />);
    socket.on.mock.calls[1][1]({ message: 'Connection failed' });
    await waitFor(() => {
      expect(screen.getByText(/Retrying \(1\/3\)/)).toBeInTheDocument();
    });
    socket.on.mock.calls[1][1]({ message: 'Connection failed' });
    socket.on.mock.calls[1][1]({ message: 'Connection failed' });
    await waitFor(() => {
      expect(screen.getByText('Real-time updates unavailable. Retry manually?')).toBeInTheDocument();
      expect(screen.getByText('Retry Connection')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Retry Connection'));
    await waitFor(() => {
      expect(DisputeService.getDisputeClusters).toHaveBeenCalled();
    });
  });

  it('displays error on fetch failure', async () => {
    DisputeService.getDisputeClusters.mockRejectedValue(new Error('Fetch failed'));
    render(<DisputeRadarWidget officerId="officer123" isPremium={false} filters={{ timeframe: 'all', type: 'all', severity: 'all' }} />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load disputes. Please try again.')).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error fetching disputes'));
    });
  });

  it('handles empty disputes gracefully', async () => {
    DisputeService.getDisputeClusters.mockResolvedValue({ data: [] });
    render(<DisputeRadarWidget officerId="officer123" isPremium={false} filters={{ timeframe: 'all', type: 'all', severity: 'all' }} />);
    await waitFor(() => {
      expect(screen.getByText('No disputes match the current filters, or no disputes found.')).toBeInTheDocument();
    });
  });
});