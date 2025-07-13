import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ValuationLiveFeed from '../ValuationLiveFeed';
import LiveUpdates from '@services/websocket/LiveUpdates';
import PredictionEngine from '@services/ai/PredictionEngine';
import logger from '@utils/logger';

// 👑 Crown Certified Test Suite
// Path: frontend/src/tests/ai/ValuationLiveFeed.test.jsx
// Purpose: Validate rendering, WebSocket updates, anomaly detection, and premium features
// Author: Rivers Auction Team
// Date: May 17, 2025
// Cod2 Crown Certified

vi.mock('@services/websocket/LiveUpdates');
vi.mock('@services/ai/PredictionEngine');
vi.mock('@utils/logger');

describe('ValuationLiveFeed', () => {
  const mockProps = {
    auctionId: '123',
    userRole: 'buyer',
    isPremium: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    LiveUpdates.connect.mockReturnValue({
      on: vi.fn(),
      disconnect: vi.fn(),
    });
    PredictionEngine.getValuationHistory.mockResolvedValue({
      data: [
        { price: 20000, timestamp: Date.now() },
        { price: 21000, timestamp: Date.now() },
      ],
    });
  });

  it('renders basic valuation metrics for free users', async () => {
    render(<ValuationLiveFeed {...mockProps} />);
    await waitFor(() => {
      expect(screen.getByText(/valuation display/i)).toBeInTheDocument();
    });
  });

  it('connects to WebSocket and updates valuations', async () => {
    const socket = LiveUpdates.connect();
    render(<ValuationLiveFeed {...mockProps} />);
    socket.on.mock.calls[0][1]({ auctionId: '123', valuation: { price: 22000 } });
    await waitFor(() => {
      expect(screen.getByText(/22000/i)).toBeInTheDocument();
    });
  });

  it('displays anomaly alerts for premium users', async () => {
    render(<ValuationLiveFeed {...mockProps} isPremium={true} />);
    const socket = LiveUpdates.connect();
    socket.on.mock.calls[0][1]({ auctionId: '123', valuation: { price: 30000 } }); // >30% deviation
    await waitFor(() => {
      expect(screen.getByText(/anomaly/i)).toBeInTheDocument();
    });
  });

  it('renders premium heatmap for premium users', async () => {
    render(<ValuationLiveFeed {...mockProps} isPremium={true} />);
    await waitFor(() => {
      expect(screen.getByRole('canvas', { name: /heatmap/i })).toBeInTheDocument();
    });
  });

  it('handles WebSocket errors gracefully', async () => {
    const socket = LiveUpdates.connect();
    render(<ValuationLiveFeed {...mockProps} />);
    socket.on.mock.calls[1][1]({ message: 'Connection failed' });
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('WebSocket error'));
      expect(screen.getByText(/failed to fetch live updates/i)).toBeInTheDocument();
    });
  });

  it('handles initial valuation fetch errors', async () => {
    PredictionEngine.getValuationHistory.mockRejectedValue(new Error('Fetch failed'));
    render(<ValuationLiveFeed {...mockProps} />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch initial valuations'));
      expect(screen.getByText(/unable to load valuation history/i)).toBeInTheDocument();
    });
  });
});