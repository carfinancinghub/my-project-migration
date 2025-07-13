// File: InsuranceAIModelPerformance.test.jsx
// Path: frontend/src/tests/insurance/InsuranceAIModelPerformance.test.jsx
// @file InsuranceAIModelPerformance.test.jsx
// @path frontend/src/tests/insurance/InsuranceAIModelPerformance.test.jsx
// @description Unit and integration tests for AI model performance metrics UI component in Insurance role
// @author Cod2 - May 08, 2025, 20:00 PDT

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsuranceAIModelPerformance from '@components/insurance/InsuranceAIModelPerformance';

jest.mock('@components/common/ToastManager', () => ({
  error: jest.fn()
}));

jest.mock('@components/common/PremiumFeature', () => ({
  __esModule: true,
  default: ({ children, feature }) =>
    feature === 'aiModelInsights' ? <div data-testid="premium-wrapper">{children}</div> : null
}));

jest.mock('react-chartjs-2', () => ({
  Chart: ({ data }) => <div data-testid="mock-chart" data-chart={JSON.stringify(data)} />
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        metrics: { accuracy: 92.5, precision: 88.3, recall: 90.1, f1Score: 89.2 },
        confusionMatrix: { tp: 50, fp: 5, tn: 40, fn: 10 }
      })
  })
);

describe('InsuranceAIModelPerformance', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    fetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  /** @wow Tests AI model performance visualizations and premium metrics */
  it('renders all basic metrics and premium confusion matrix', async () => {
    render(<InsuranceAIModelPerformance modelId="mock-id" />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId('basic-metrics')).toBeInTheDocument());
    expect(screen.getByText('Accuracy')).toBeInTheDocument();
    expect(screen.getByText('Precision')).toBeInTheDocument();
    expect(screen.getByTestId('confusion-matrix')).toBeInTheDocument();
  });

  it('validates chart data accuracy', async () => {
    render(<InsuranceAIModelPerformance modelId="mock-id" />);
    const chart = await screen.findByTestId('mock-chart');
    const chartData = JSON.parse(chart.getAttribute('data-chart'));
    expect(chartData.datasets[0].data).toEqual([50, 5, 40, 10]);
  });

  it('hides premium confusion matrix if PremiumFeature is restricted', async () => {
    jest.doMock('@components/common/PremiumFeature', () => ({
      __esModule: true,
      default: () => null
    }));
    const { container } = render(<InsuranceAIModelPerformance modelId="mock-id" />);
    await waitFor(() => {
      expect(container.querySelector('[data-testid="confusion-matrix"]')).toBeNull();
    });
  });

  it('allows switching timeframe filter and triggers fetch', async () => {
    render(<InsuranceAIModelPerformance modelId="mock-id" />);
    const select = await screen.findByTestId('timeframe-select');
    fireEvent.change(select, { target: { value: 'last_90_days' } });
    expect(select.value).toBe('last_90_days');
  });

  it('verifies timeframe select has accessibility label', async () => {
    render(<InsuranceAIModelPerformance modelId="mock-id" />);
    const select = await screen.findByTestId('timeframe-select');
    expect(select).toHaveAttribute('aria-label', 'Timeframe filter');
  });

  it('starts real-time polling and respects document visibility', async () => {
    render(<InsuranceAIModelPerformance modelId="mock-id" />);
    jest.advanceTimersByTime(15000);
    expect(fetch).toHaveBeenCalledTimes(2); // initial + 1 poll
  });

  it('displays error toast if fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('API failure')));
    const ToastManager = require('@components/common/ToastManager');
    render(<InsuranceAIModelPerformance modelId="mock-id" />);
    await waitFor(() => expect(ToastManager.error).toHaveBeenCalledWith('Failed to load AI metrics'));
  });
});
