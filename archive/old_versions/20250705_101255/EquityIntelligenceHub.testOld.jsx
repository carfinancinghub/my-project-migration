/**
 * File: EquityIntelligenceHub.test.jsx
 * Path: frontend/src/tests/equity-hub/EquityIntelligenceHub.test.jsx
 * Purpose: Unit tests for EquityIntelligenceHub UI rendering and logic
 * Author: Cod3 (05052330)
 * Date: May 05, 2025
 * Cod2 Crown Certified
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EquityIntelligenceHub from '@components/equity-hub/EquityIntelligenceHub';
import axios from 'axios';

// Mock Chart.js to avoid rendering issues in test environment
jest.mock('react-chartjs-2', () => ({
  Line: () => <div>Mock Line Chart</div>,
  Pie: () => <div>Mock Pie Chart</div>,
}));

jest.mock('axios');

describe('EquityIntelligenceHub', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      switch (url) {
        case '/api/equity-hub/risk-feed':
          return Promise.resolve({ data: { averageRisk: 0.73 } });
        case '/api/equity-hub/dispute-trends':
          return Promise.resolve({ data: { labels: ['Week 1'], values: [4] } });
        case '/api/equity-hub/yield-heatmap':
          return Promise.resolve({ data: { labels: ['SUV'], values: [0.15] } });
        default:
          return Promise.reject(new Error('Unknown endpoint'));
      }
    });
  });

  test('renders EquityIntelligenceHub and displays average risk', async () => {
    render(<EquityIntelligenceHub />);
    await waitFor(() => expect(screen.getByText(/Average Risk Score/i)).toBeInTheDocument());
    expect(screen.getByText(/0.73/)).toBeInTheDocument();
  });

  test('renders mock charts', async () => {
    render(<EquityIntelligenceHub />);
    expect(await screen.findByText(/Mock Line Chart/)).toBeInTheDocument();
    expect(await screen.findByText(/Mock Pie Chart/)).toBeInTheDocument();
  });
});
