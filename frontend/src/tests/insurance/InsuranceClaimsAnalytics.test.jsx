/**
 * @file InsuranceClaimsAnalytics.test.jsx
 * @path frontend/src/tests/insurance/InsuranceClaimsAnalytics.test.jsx
 * @description Tests analytics dashboard UI, filters, charts, and premium risk logic for the CFH Insurance role.
 * @wow Tests interactive visualizations, AI trends, region/timeframe filters, real-time polling behavior.
 * @author Cod2 - May 08, 2025, 00:29 PST
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InsuranceClaimsAnalytics from '@components/insurance/InsuranceClaimsAnalytics';
import PremiumFeature from '@components/common/PremiumFeature';
import ToastManager from '@components/common/ToastManager';

jest.mock('@components/common/ToastManager', () => ({ error: jest.fn() }));
jest.mock('@components/common/PremiumFeature', () => ({ children }) => <>{children}</>);
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data }) => <div data-testid="bar-chart" data-chart={JSON.stringify(data)} />,
  Pie: ({ data }) => <div data-testid="pie-chart" data-chart={JSON.stringify(data)} />,
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
});

describe('InsuranceClaimsAnalytics', () => {
  /** @description Renders dashboard with filters, stats, and charts */
  it('renders dashboard UI elements', async () => {
    render(<InsuranceClaimsAnalytics />);
    expect(screen.getByTestId('claims-analytics')).toBeInTheDocument();
    expect(screen.getByText('Claims Analytics')).toBeInTheDocument();
    expect(screen.getByText('Total Claims:')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  /** @description Triggers region/timeframe change and expects fetch with filters */
  it('applies region and timeframe filters', async () => {
    render(<InsuranceClaimsAnalytics />);
    const regionSelect = screen.getByLabelText('Region:');
    const timeframeSelect = screen.getByLabelText('Timeframe:');
    fireEvent.change(regionSelect, { target: { value: 'TX' } });
    fireEvent.change(timeframeSelect, { target: { value: 'next_year' } });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('region=TX'));
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('timeframe=next_year'));
    });
  });

  /** @description Verifies risk trends render for premium users */
  it('displays AI risk trends under PremiumFeature', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ([{ _id: 'abc123', amount: 500, policyId: 'P1', status: 'pending' }]) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ risk: 0.6 }) });
    render(<InsuranceClaimsAnalytics />);
    await screen.findByText(/Risk Score = 60.0%/);
  });

  /** @description Triggers polling logic on interval if tab is visible */
  it('polls claims data if tab is visible', async () => {
    jest.useFakeTimers();
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    render(<InsuranceClaimsAnalytics />);
    jest.advanceTimersByTime(10000);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2)); // one for initial, one for polling
    jest.useRealTimers();
  });

  /** @description Displays error toast on failed fetch */
  it('handles fetch error with ToastManager', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
    render(<InsuranceClaimsAnalytics />);
    await waitFor(() => {
      expect(ToastManager.error).toHaveBeenCalledWith('Unable to load claims analytics.');
    });
  });

  /** @description Verifies chart data integrity */
  it('renders accurate chart datasets from claims', async () => {
    const mockClaims = [
      { _id: '1', amount: 100, policyId: 'POL1', status: 'pending' },
      { _id: '2', amount: 300, policyId: 'POL2', status: 'approved' },
    ];
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockClaims })
      .mockResolvedValue(() => Promise.resolve({ ok: true, json: async () => ({ risk: 0.5 }) }));

    render(<InsuranceClaimsAnalytics />);
    const bar = await screen.findByTestId('bar-chart');
    const pie = await screen.findByTestId('pie-chart');
    const barData = JSON.parse(bar.getAttribute('data-chart'));
    const pieData = JSON.parse(pie.getAttribute('data-chart'));

    expect(barData.datasets[0].data).toEqual([1, 1]);
    expect(pieData.datasets[0].data).toEqual([100, 300]);
  });

  /** @description Checks filter select elements are accessible */
  it('has accessible filter dropdowns', () => {
    render(<InsuranceClaimsAnalytics />);
    expect(screen.getByLabelText('Region:')).toBeInTheDocument();
    expect(screen.getByLabelText('Timeframe:')).toBeInTheDocument();
  });
});
