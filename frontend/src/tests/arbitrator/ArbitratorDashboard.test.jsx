// Crown Certified Test — ArbitratorDashboard.test.jsx
// Path: frontend/src/tests/arbitrator/ArbitratorDashboard.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArbitratorDashboard from '@/components/arbitrator/ArbitratorDashboard';
import * as DisputeService from '@/services/disputes/DisputeService';

jest.mock('@/services/disputes/DisputeService');

const mockDisputes = [
  {
    _id: 'd123',
    reason: 'Payment dispute',
    status: 'Pending',
    votingEndsAt: new Date(Date.now() + 60000).toISOString(),
    votes: [],
    aiRecommendation: 'Vote Yes',
  },
];

describe('ArbitratorDashboard', () => {
  const arbitratorId = 'arb007';

  beforeEach(() => {
    DisputeService.getAssignedDisputes.mockResolvedValue(mockDisputes);
    DisputeService.castVote.mockResolvedValue({});
  });

  it('renders disputes correctly', async () => {
    render(<ArbitratorDashboard arbitratorId={arbitratorId} isPremium={false} />);
    expect(await screen.findByText(/Dispute: d123/)).toBeInTheDocument();
    expect(screen.getByText(/Payment dispute/)).toBeInTheDocument();
  });

  it('allows casting a vote', async () => {
    render(<ArbitratorDashboard arbitratorId={arbitratorId} isPremium={false} />);
    const voteButton = await screen.findByText('Vote Yes ✅');
    fireEvent.click(voteButton);
    await waitFor(() => expect(DisputeService.castVote).toHaveBeenCalledWith('d123', 'arb007', 'Yes'));
  });

  it('displays AI suggestion for premium users', async () => {
    render(<ArbitratorDashboard arbitratorId={arbitratorId} isPremium={true} />);
    expect(await screen.findByText(/AI Suggests:/)).toBeInTheDocument();
    expect(screen.getByText(/Vote Yes/)).toBeInTheDocument();
  });

  it('shows resolution analytics if premium', async () => {
    render(<ArbitratorDashboard arbitratorId={arbitratorId} isPremium={true} />);
    expect(await screen.findByText(/Resolution Analytics/)).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    DisputeService.getAssignedDisputes.mockRejectedValueOnce(new Error('Network error'));
    render(<ArbitratorDashboard arbitratorId={arbitratorId} isPremium={false} />);
    expect(await screen.findByText(/❌ Unable to load disputes/)).toBeInTheDocument();
  });
});