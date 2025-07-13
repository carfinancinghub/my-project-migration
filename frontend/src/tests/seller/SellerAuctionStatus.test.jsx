// File: SellerAuctionStatus.test.jsx
// Path: C:\CFH\frontend\src\tests\seller\SellerAuctionStatus.test.jsx
// Purpose: Unit tests for SellerAuctionStatus component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SellerAuctionStatus from '@components/seller/SellerAuctionStatus';
import { getAuctionStatus } from '@services/api/auction';
import logger from '@utils/logger';

jest.mock('@services/api/auction');
jest.mock('@utils/logger');

const mockStatus = {
  isActive: true,
  currentBid: 20000,
  bidderCount: 5,
  endTime: '2025-05-25 12:00'
};

describe('SellerAuctionStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SellerAuctionStatus auctionId="789" />);
    expect(screen.getByText(/loading auction status/i)).toBeInTheDocument();
  });

  it('renders auction status when data is available', async () => {
    getAuctionStatus.mockResolvedValueOnce(mockStatus);
    render(<SellerAuctionStatus auctionId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/Auction ID: 789/i)).toBeInTheDocument();
      expect(screen.getByText(/Status: Active/i)).toHaveClass('text-green-600');
      expect(screen.getByText(/Current Bid: \$20000/i)).toBeInTheDocument();
      expect(screen.getByText(/Bidders: 5/i)).toBeInTheDocument();
      expect(screen.getByText(/End Time: 2025-05-25 12:00/i)).toBeInTheDocument();
    });
  });

  it('renders closed status correctly', async () => {
    getAuctionStatus.mockResolvedValueOnce({ ...mockStatus, isActive: false });
    render(<SellerAuctionStatus auctionId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/Status: Closed/i)).toHaveClass('text-red-600');
    });
  });

  it('logs errors and shows error message on fetch failure', async () => {
    getAuctionStatus.mockRejectedValueOnce(new Error('API failed'));
    render(<SellerAuctionStatus auctionId="789" />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch status'));
      expect(screen.getByText(/Failed to load auction status/i)).toBeInTheDocument();
    });
  });

  it('handles null response gracefully', async () => {
    getAuctionStatus.mockResolvedValueOnce(null);
    render(<SellerAuctionStatus auctionId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/No auction status available/i)).toBeInTheDocument();
    });
  });
});

SellerAuctionStatus.test.propTypes = {};