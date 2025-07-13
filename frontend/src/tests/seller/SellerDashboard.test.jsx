// File: SellerDashboard.test.jsx
// Path: C:\CFH\frontend\src\tests\seller\SellerDashboard.test.jsx
// Purpose: Unit tests for SellerDashboard component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SellerDashboard from '@components/seller/SellerDashboard';
import { getSellerAnalytics } from '@services/api/auction';
import { getInventory } from '@services/api/inventory';
import logger from '@utils/logger';

jest.mock('@services/api/auction');
jest.mock('@services/api/inventory');
jest.mock('@utils/logger');

const mockAnalytics = {
  totalAuctions: 10,
  activeAuctions: 3,
  totalRevenue: 50000,
  avgBid: 5000
};

const mockInventory = [
  { id: '1', vehicleName: 'Toyota Camry', isListed: true },
  { id: '2', vehicleName: 'Honda Civic', isListed: false }
];

describe('SellerDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SellerDashboard sellerId="123" />);
    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  it('renders analytics and inventory when data is available', async () => {
    getSellerAnalytics.mockResolvedValueOnce(mockAnalytics);
    getInventory.mockResolvedValueOnce(mockInventory);
    render(<SellerDashboard sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Total Auctions: 10/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Auctions: 3/i)).toBeInTheDocument();
      expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
      expect(screen.getByText(/Listed: Yes/i)).toBeInTheDocument();
    });
  });

  it('renders no data messages when analytics and inventory are empty', async () => {
    getSellerAnalytics.mockResolvedValueOnce(null);
    getInventory.mockResolvedValueOnce([]);
    render(<SellerDashboard sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No analytics available/i)).toBeInTheDocument();
      expect(screen.getByText(/No inventory available/i)).toBeInTheDocument();
    });
  });

  it('logs errors and shows error message on fetch failure', async () => {
    getSellerAnalytics.mockRejectedValueOnce(new Error('API failed'));
    getInventory.mockResolvedValueOnce([]);
    render(<SellerDashboard sellerId="123" />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch data'));
      expect(screen.getByText(/Failed to load dashboard data/i)).toBeInTheDocument();
    });
  });

  it('handles partial data gracefully', async () => {
    getSellerAnalytics.mockResolvedValueOnce(null);
    getInventory.mockResolvedValueOnce(mockInventory);
    render(<SellerDashboard sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No analytics available/i)).toBeInTheDocument();
      expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
    });
  });
});

SellerDashboard.test.propTypes = {};