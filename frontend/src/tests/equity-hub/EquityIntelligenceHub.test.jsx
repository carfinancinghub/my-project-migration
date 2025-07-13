// File: EquityIntelligenceHub.test.jsx
// Path: frontend/src/tests/equity-hub/EquityIntelligenceHub.test.jsx
// Purpose: Tests EquityIntelligenceHub component rendering, filters, and chart data
// Author: Cod3 (05082358)
// Date: May 08, 2025
// Cod2 Crown Certified

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EquityIntelligenceHub from '@components/equity-hub/EquityIntelligenceHub';
import axios from 'axios';

// Mock Chart.js elements and axios
jest.mock('axios');

jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart" />,
  Pie: () => <div data-testid="pie-chart" />
}));

describe('EquityIntelligenceHub', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('risk-feed')) {
        return Promise.resolve({ data: { averageRisk: 0.67 } });
      }
      if (url.includes('dispute-trends')) {
        return Promise.resolve({
          data: {
            labels: ['Week 1', 'Week 2'],
            values: [3, 6],
            fairnessMetrics: { buyerSellerDisputes: 3 }
          }
        });
      }
      if (url.includes('yield-heatmap')) {
        return Promise.resolve({
          data: {
            labels: ['SUV', 'Sedan'],
            values: [0.12, 0.08]
          }
        });
      }
    });
  });

  it('renders component and title', async () => {
    render(<EquityIntelligenceHub />);
    expect(screen.getByText('Equity Intelligence Hub')).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
  });

  it('renders filters and applies changes', async () => {
    render(<EquityIntelligenceHub />);
    const regionFilter = screen.getByRole('combobox', { name: '' }); // first select
    fireEvent.change(regionFilter, { target: { value: 'texas' } });
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  it('renders chart visualizations', async () => {
    render(<EquityIntelligenceHub />);
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  it('displays average risk score', async () => {
    render(<EquityIntelligenceHub />);
    await waitFor(() => {
      expect(screen.getByText(/Average Risk Score/i)).toBeInTheDocument();
      expect(screen.getByText(/0.67/)).toBeInTheDocument();
    });
  });
});
