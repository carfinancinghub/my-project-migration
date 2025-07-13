// File: SellerAnalyticsChart.test.jsx
// Path: C:\CFH\frontend\src\tests\seller\SellerAnalyticsChart.test.jsx
// Purpose: Unit tests for SellerAnalyticsChart component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SellerAnalyticsChart from '@components/seller/SellerAnalyticsChart';
import { getSellerAnalytics } from '@services/api/auction';
import logger from '@utils/logger';

jest.mock('@services/api/auction');
jest.mock('@utils/logger');
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div>Mock Bar Chart</div>
}));

const mockAnalytics = {
  totalAuctions: 10,
  activeAuctions: 3,
  totalRevenue: 50000,
  avgBid: 5000
};

describe('SellerAnalyticsChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SellerAnalyticsChart sellerId="123" />);
    expect(screen.getByText(/loading chart/i)).toBeInTheDocument();
  });

  it('renders chart when data is available', async () => {
    getSellerAnalytics.mockResolvedValueOnce(mockAnalytics);
    render(<SellerAnalyticsChart sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Mock Bar Chart/i)).toBeInTheDocument();
    });
  });

  it('renders no data message when analytics are unavailable', async () => {
    getSellerAnalytics.mockResolvedValueOnce(null);
    render(<SellerAnalyticsChart sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No analytics data available/i)).toBeInTheDocument();
    });
  });

  it('logs errors and shows error message on fetch failure', async () => {
    getSellerAnalytics.mockRejectedValueOnce(new Error('API failed'));
    render(<SellerAnalyticsChart sellerId="123" />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch analytics'));
      expect(screen.getByText(/Failed to load analytics chart/i)).toBeInTheDocument();
    });
  });

  it('handles empty data gracefully', async () => {
    getSellerAnalytics.mockResolvedValueOnce({});
    render(<SellerAnalyticsChart sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Mock Bar Chart/i)).toBeInTheDocument();
    });
  });
});

SellerAnalyticsChart.test.propTypes = {};