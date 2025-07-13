// File: BuyerAuctionHistory.test.jsx
// Path: C:\CFH\frontend\src\tests\buyer\BuyerAuctionHistory.test.jsx
// Purpose: Unit tests for BuyerAuctionHistory component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BuyerAuctionHistory from '@components/buyer/BuyerAuctionHistory';
import { getAuctionHistory } from '@services/api/auction';
import logger from '@utils/logger';

jest.mock('@services/api/auction');
jest.mock('@utils/logger');

const mockAuctions = [
  { id: '1', title: 'Car Auction 1', date: '2025-05-20', finalBid: 10000, status: 'Won' },
  { id: '2', title: 'Car Auction 2', date: '2025-05-21', finalBid: 15000, status: 'Lost' }
];

describe('BuyerAuctionHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<BuyerAuctionHistory userId="123" />);
    expect(screen.getByText(/loading auction history/i)).toBeInTheDocument();
  });

  it('renders auction history when data is available', async () => {
    getAuctionHistory.mockResolvedValueOnce(mockAuctions);
    render(<BuyerAuctionHistory userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Car Auction 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Car Auction 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Final Bid: \$10000/i)).toBeInTheDocument();
      expect(screen.getByText(/Status: Won/i)).toBeInTheDocument();
    });
  });

  it('renders no history message when auctions are empty', async () => {
    getAuctionHistory.mockResolvedValueOnce([]);
    render(<BuyerAuctionHistory userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No auction history available/i)).toBeInTheDocument();
    });
  });

  it('logs errors and shows error message on fetch failure', async () => {
    getAuctionHistory.mockRejectedValueOnce(new Error('API failed'));
    render(<BuyerAuctionHistory userId="123" />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch auction history'));
      expect(screen.getByText(/Failed to load auction history/i)).toBeInTheDocument();
    });
  });

  it('handles API failure with null response', async () => {
    getAuctionHistory.mockResolvedValueOnce(null);
    render(<BuyerAuctionHistory userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No auction history available/i)).toBeInTheDocument();
    });
  });
});

BuyerAuctionHistory.test.propTypes = {};