// File: AuctionIntelligenceDashboard.test.jsx
// Path: frontend/src/tests/auction/AuctionIntelligenceDashboard.test.jsx
// @file AuctionIntelligenceDashboard.test.jsx
// @path frontend/src/tests/auction/AuctionIntelligenceDashboard.test.jsx
// @description Tests interactive auction analytics and AI insights for premium users and non-premium fallback
// @wow Covers real-time polling, visualizations, premium gating, error handling, and filtering logic.
// @author Cod2 - May 08, 2025, 17:47 PDT

import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionIntelligenceDashboard from '@components/auction/AuctionIntelligenceDashboard';
import ToastManager from '@components/common/ToastManager';
import * as chartjs from 'react-chartjs-2';

// Mocks
jest.mock('@components/common/ToastManager', () => ({
  error: jest.fn(),
}));

jest.mock('react-chartjs-2', () => ({
  Line: jest.fn(() => <div data-testid="line-chart" />),
  Bar: jest.fn(() => <div data-testid="bar-chart" />),
}));

describe('AuctionIntelligenceDashboard - Premium User', () => {
  let originalFetch;

  beforeEach(() => {
    jest.useFakeTimers();
    originalFetch = global.fetch;
    global.fetch = jest.fn((url) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            bidTrends: [100, 120, 140],
            winRates: [50, 60, 65],
            predictedBid: 180,
          }),
      })
    );

    jest.mock('@components/common/PremiumFeature', () => ({ children }) => (
      <div data-testid="premium-section">{children}</div>
    ));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('renders charts and premium section', async () => {
    render(<AuctionIntelligenceDashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('premium-section')).toBeInTheDocument();
    });
  });

  test('polls every 15 seconds when document is visible', async () => {
    render(<AuctionIntelligenceDashboard />);
    expect(fetch).toHaveBeenCalledTimes(1);
    act(() => {
      jest.advanceTimersByTime(15000);
    });
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test('filters analytics by timeframe/category', async () => {
    render(<AuctionIntelligenceDashboard />);
    const select = screen.getByLabelText(/Timeframe/i);
    fireEvent.change(select, { target: { value: 'last_90_days' } });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('timeframe=last_90_days'), expect.any(Object));
    });
  });

  test('handles API failure', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
    render(<AuctionIntelligenceDashboard />);
    await waitFor(() => {
      expect(ToastManager.error).toHaveBeenCalledWith('Failed to load auction analytics');
    });
  });
});

describe('AuctionIntelligenceDashboard - Non-Premium User', () => {
  beforeEach(() => {
    jest.mock('@components/common/PremiumFeature', () => () => null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('hides premium insights for non-premium users', async () => {
    render(<AuctionIntelligenceDashboard />);
    expect(screen.queryByTestId('premium-section')).not.toBeInTheDocument();
  });
});