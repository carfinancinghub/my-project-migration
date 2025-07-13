// 👑 Crown Certified Test — BuyerBidModal.test.jsx
// Path: frontend/src/tests/buyer/BuyerBidModal.test.jsx
// Purpose: Validate BuyerBidModal rendering, AI suggestion logic, premium gating, and error handling
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import BuyerBidModal from '@components/buyer/BuyerBidModal';
import PredictionEngine from '@services/ai/PredictionEngine';
import logger from '@utils/logger';

// Mock dependencies
vi.mock('@services/ai/PredictionEngine');
vi.mock('@utils/logger');

const baseProps = {
  auctionId: 'auction123',
  isOpen: true,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  isPremium: false,
};

describe('BuyerBidModal (Free Tier)', () => {
  it('renders modal with basic input and submits a bid', async () => {
    render(<BuyerBidModal {...baseProps} />);

    const input = screen.getByPlaceholderText(/enter your bid amount/i);
    fireEvent.change(input, { target: { value: '2500' } });

    const submitButton = screen.getByText(/submit bid/i);
    fireEvent.click(submitButton);

    expect(baseProps.onSubmit).toHaveBeenCalledWith(2500);
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('shows error if bid is empty', () => {
    render(<BuyerBidModal {...baseProps} />);

    const submitButton = screen.getByText(/submit bid/i);
    fireEvent.click(submitButton);

    expect(screen.getByText(/please enter a valid bid/i)).toBeInTheDocument();
  });
});

describe('BuyerBidModal (Premium Tier)', () => {
  const premiumProps = {
    ...baseProps,
    isPremium: true,
  };

  beforeEach(() => {
    PredictionEngine.getRecommendation.mockResolvedValue({
      suggestedBid: 3200,
      history: [3100, 3150, 3180],
    });
  });

  it('fetches and displays AI suggestion and history', async () => {
    render(<BuyerBidModal {...premiumProps} />);

    await waitFor(() => {
      expect(screen.getByText(/ai suggests/i)).toBeInTheDocument();
      expect(screen.getByText('$3200')).toBeInTheDocument();
      expect(screen.getByText(/bid history/i)).toBeInTheDocument();
    });
  });

  it('logs error if AI fetch fails', async () => {
    PredictionEngine.getRecommendation.mockRejectedValue(new Error('AI down'));

    render(<BuyerBidModal {...premiumProps} />);

    await waitFor(() => {
      expect(screen.getByText(/unable to retrieve ai suggestion/i)).toBeInTheDocument();
    });

    expect(logger.error).toHaveBeenCalledWith(
      'Failed to fetch bid suggestion',
      expect.any(Error)
    );
  });
});
