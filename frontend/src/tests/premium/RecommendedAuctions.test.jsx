// File: RecommendedAuctions.test.jsx
// Path: C:\CFH\frontend\src\tests\premium\RecommendedAuctions.test.jsx
// Purpose: Unit tests for RecommendedAuctions component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import RecommendedAuctions from '@components/premium/RecommendedAuctions';
import { getRecommendations } from '@services/api/premium';
import logger from '@utils/logger';

jest.mock('@services/api/premium');
jest.mock('@utils/logger');

describe('RecommendedAuctions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<RecommendedAuctions userId="123" />);
    expect(screen.getByText(/loading recommendations/i)).toBeInTheDocument();
  });

  it('renders recommended auctions when data is available', async () => {
    const mockAuctions = [
      { id: '789', title: 'Toyota Camry', currentBid: 10000, images: ['camry.jpg'] },
      { id: '790', title: 'Honda Civic', currentBid: 8000, images: ['civic.jpg'] }
    ];
    getRecommendations.mockResolvedValueOnce(mockAuctions);

    render(<RecommendedAuctions userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Recommended Auctions/i)).toBeInTheDocument();
      expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
      expect(screen.getByText(/Honda Civic/i)).toBeInTheDocument();
      expect(screen.getAllByText(/View Auction/i)).toHaveLength(2);
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Fetched recommendations'));
  });

  it('renders no recommendations message when none are available', async () => {
    getRecommendations.mockResolvedValueOnce([]);
    render(<RecommendedAuctions userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No recommendations available/i)).toBeInTheDocument();
    });
  });

  it('renders error message on fetch failure', async () => {
    getRecommendations.mockRejectedValueOnce(new Error('API error'));
    render(<RecommendedAuctions userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load recommendations/i)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch recommendations'));
    });
  });

  it('requires userId prop', () => {
    expect(RecommendedAuctions.propTypes.userId).toBe(PropTypes.string.isRequired);
  });
});