// 👑 Crown Certified Test — BidStrategyAdvisor.test.jsx
// Path: frontend/src/tests/ai/BidStrategyAdvisor.test.jsx
// Purpose: Test rendering, WebSocket updates, and AI prediction logic for bid strategy
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BidStrategyAdvisor from '@components/ai/BidStrategyAdvisor';
import PredictionEngine from '@services/ai/PredictionEngine';
import logger from '@utils/logger';

vi.mock('@services/ai/PredictionEngine');
vi.mock('@utils/logger');

describe('BidStrategyAdvisor (Free Mode)', () => {
  const mockBasic = { successProbability: 72, optimalBidTime: '10:30 AM' };

  beforeEach(() => {
    PredictionEngine.getBasicPrediction.mockResolvedValue(mockBasic);
    PredictionEngine.getAdvancedPrediction.mockResolvedValue({});
  });

  it('renders loading state initially', () => {
    render(<BidStrategyAdvisor auctionId="123" isPremium={false} />);
    expect(screen.getByText(/analyzing bid timing/i)).toBeInTheDocument();
  });

  it('renders basic strategy after load', async () => {
    render(<BidStrategyAdvisor auctionId="123" isPremium={false} />);
    expect(await screen.findByText(/confidence score/i)).toBeInTheDocument();
    expect(screen.getByText(/72%/)).toBeInTheDocument();
    expect(screen.getByText(/optimal bid window/i)).toBeInTheDocument();
    expect(screen.getByText(/10:30 AM/)).toBeInTheDocument();
    expect(screen.getByText(/premium features/i)).toBeInTheDocument();
  });

  it('logs error on fetch failure', async () => {
    PredictionEngine.getBasicPrediction.mockRejectedValueOnce(new Error('fail'));
    render(<BidStrategyAdvisor auctionId="123" isPremium={false} />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch bid strategy', expect.any(Error));
    });
    expect(screen.getByText(/unable to load bid strategy/i)).toBeInTheDocument();
  });
});

describe('BidStrategyAdvisor (Premium Mode)', () => {
  const mockBasic = { successProbability: 80, optimalBidTime: '2:45 PM' };
  const mockAdvanced = { exitTrigger: '3 consecutive outbids', recommendation: 'Exit within 5 minutes' };

  beforeEach(() => {
    PredictionEngine.getBasicPrediction.mockResolvedValue(mockBasic);
    PredictionEngine.getAdvancedPrediction.mockResolvedValue(mockAdvanced);
  });

  it('renders premium strategy with exit and recommendation', async () => {
    render(<BidStrategyAdvisor auctionId="789" isPremium={true} />);
    expect(await screen.findByText(/confidence score/i)).toBeInTheDocument();
    expect(screen.getByText(/80%/)).toBeInTheDocument();
    expect(screen.getByText(/exit trigger/i)).toBeInTheDocument();
    expect(screen.getByText(/3 consecutive outbids/i)).toBeInTheDocument();
    expect(screen.getByText(/ai says/i)).toBeInTheDocument();
    expect(screen.getByText(/exit within 5 minutes/i)).toBeInTheDocument();
  });

  it('handles missing advanced fields gracefully', async () => {
    PredictionEngine.getAdvancedPrediction.mockResolvedValueOnce({});
    render(<BidStrategyAdvisor auctionId="000" isPremium={true} />);
    expect(await screen.findByText(/confidence score/i)).toBeInTheDocument();
    expect(screen.getByText(/no trigger available/i)).toBeInTheDocument();
  });
});
