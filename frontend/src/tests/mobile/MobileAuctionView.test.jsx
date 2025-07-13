// File: MobileAuctionView.test.jsx
// Path: C:\CFH\frontend\src\tests\mobile\MobileAuctionView.test.jsx
// Purpose: Unit tests for MobileAuctionView component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MobileAuctionView from '@components/mobile/MobileAuctionView';
import { getAuctionDetails } from '@services/api/auction';
import logger from '@utils/logger';

jest.mock('@services/api/auction');
jest.mock('@utils/logger');

describe('MobileAuctionView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<MobileAuctionView auctionId="789" />);
    expect(screen.getByText(/loading auction/i)).toBeInTheDocument();
  });

  it('renders auction details when data is available', async () => {
    const mockAuction = {
      title: 'Test Auction',
      images: ['image1.jpg'],
      currentBid: 10000,
      timeRemaining: '2h 30m',
      bidderCount: 5
    };
    getAuctionDetails.mockResolvedValueOnce(mockAuction);

    render(<MobileAuctionView auctionId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/Test Auction/i)).toBeInTheDocument();
      expect(screen.getByText(/Current Bid: \$10000/i)).toBeInTheDocument();
      expect(screen.getByText(/Time Remaining: 2h 30m/i)).toBeInTheDocument();
      expect(screen.getByText(/Bidders: 5/i)).toBeInTheDocument();
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Fetched auction details'));
  });

  it('renders error message on fetch failure', async () => {
    getAuctionDetails.mockRejectedValueOnce(new Error('API error'));
    render(<MobileAuctionView auctionId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load auction details/i)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch auction details'));
    });
  });

  it('renders not found message when auction is unavailable', async () => {
    getAuctionDetails.mockResolvedValueOnce(null);
    render(<MobileAuctionView auctionId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/Auction not found/i)).toBeInTheDocument();
    });
  });

  it('logs navigation to bid on button click', async () => {
    const mockAuction = {
      title: 'Test Auction',
      images: ['image1.jpg'],
      currentBid: 10000,
      timeRemaining: '2h 30m',
      bidderCount: 5
    };
    getAuctionDetails.mockResolvedValueOnce(mockAuction);

    render(<MobileAuctionView auctionId="789" />);
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Place Bid/i));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('User navigated to bid on auctionId: 789'));
    });
  });
});