// 👑 Crown Certified Test — ValuationAssistant.test.jsx
// Path: frontend/src/tests/ai/ValuationAssistant.test.jsx
// Purpose: Validate AI valuation assistant rendering, premium gating, and error handling
// Author: Rivers Auction Team — May 17, 2025
// Cod2 Crown Certified

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ValuationAssistant from '@/components/ai/ValuationAssistant';
import PredictionEngine from '@/services/ai/PredictionEngine';
import logger from '@/utils/logger';

jest.mock('@/services/ai/PredictionEngine');
jest.mock('@/components/common/ValuationDisplay', () => () => <div>MockValuationDisplay</div>);
jest.mock('@/components/common/PredictiveGraph', () => () => <div>MockPredictiveGraph</div>);

describe('ValuationAssistant', () => {
  const auctionId = 'auction123';
  const basicMock = { estimatedValue: 10000 };
  const premiumMock = {
    trends: [1, 2, 3],
    advice: 'Bid +3% to increase win probability',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', async () => {
    render(<ValuationAssistant auctionId={auctionId} isPremium={false} />);
    expect(screen.getByText(/loading valuation insights/i)).toBeInTheDocument();
  });

  it('renders basic valuation for free users', async () => {
    PredictionEngine.getBasicPrediction.mockResolvedValueOnce(basicMock);

    render(<ValuationAssistant auctionId={auctionId} isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText('MockValuationDisplay')).toBeInTheDocument();
    });

    expect(PredictionEngine.getBasicPrediction).toHaveBeenCalledWith({ auctionId });
    expect(PredictionEngine.getRecommendation).not.toHaveBeenCalled();
  });

  it('renders full premium recommendations', async () => {
    PredictionEngine.getBasicPrediction.mockResolvedValueOnce(basicMock);
    PredictionEngine.getRecommendation.mockResolvedValueOnce(premiumMock);

    render(<ValuationAssistant auctionId={auctionId} isPremium={true} />);

    await waitFor(() => {
      expect(screen.getByText('MockValuationDisplay')).toBeInTheDocument();
      expect(screen.getByText('MockPredictiveGraph')).toBeInTheDocument();
      expect(screen.getByText(/AI Suggests/i)).toBeInTheDocument();
    });

    expect(PredictionEngine.getRecommendation).toHaveBeenCalledWith({
      auctionId,
      bidAmount: 10000,
    });
  });

  it('handles fetch errors gracefully', async () => {
    PredictionEngine.getBasicPrediction.mockRejectedValueOnce(new Error('fetch failed'));
    const loggerSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});

    render(<ValuationAssistant auctionId={auctionId} isPremium={true} />);

    await waitFor(() => {
      expect(screen.getByText(/unable to load valuation insights/i)).toBeInTheDocument();
    });

    expect(loggerSpy).toHaveBeenCalled();
  });
});
