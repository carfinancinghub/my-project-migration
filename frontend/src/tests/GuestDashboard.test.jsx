// File: GuestDashboard.test.jsx
// Path: frontend/src/tests/GuestDashboard.test.jsx
// Author: Cod5 (05051016, May 5, 2025, 10:16 PDT)
// Purpose: Unit tests and snapshot tests for GuestDashboard.jsx to ensure reliable rendering and visual consistency

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import GuestDashboard from '@components/guest/GuestDashboard';
import { fetchRecentAuctions, fetchTrendingVehicles } from '@utils/auctionUtils';
import { startGuidedTour } from '@utils/tourUtils';
import { toast } from 'react-toastify';

// Mock utilities
jest.mock('@utils/auctionUtils', () => ({
  fetchRecentAuctions: jest.fn(),
  fetchTrendingVehicles: jest.fn(),
}));
jest.mock('@utils/tourUtils', () => ({
  startGuidedTour: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock data
const mockAuctions = [
  { id: '1', title: 'Toyota Camry 2020', currentBid: 15000, timeRemaining: '2h 30m' },
  { id: '2', title: 'Honda Civic 2019', currentBid: 12000, timeRemaining: '1h 15m' },
];
const mockTrendingVehicles = [
  { make: 'Toyota', model: 'Camry', count: 10 },
  { make: 'Honda', model: 'Civic', count: 8 },
];

describe('GuestDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchRecentAuctions as jest.Mock).mockResolvedValue(mockAuctions);
    (fetchTrendingVehicles as jest.Mock).mockResolvedValue(mockTrendingVehicles);
    (startGuidedTour as jest.Mock).mockReturnValue(undefined);
  });

  it('renders recent auctions and onboarding link for free users', async () => {
    render(
      <MemoryRouter>
        <GuestDashboard isPremium={false} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to Rivers Auction/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Toyota Camry 2020/i)).toBeInTheDocument();
      expect(screen.getByText(/Current Bid: \$15000.00/i)).toBeInTheDocument();
      expect(screen.getByText(/Honda Civic 2019/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: /View Onboarding Guide/i })).toBeInTheDocument();
  });

  it('displays trending vehicles and guided tour for premium users', async () => {
    render(
      <MemoryRouter>
        <GuestDashboard isPremium={true} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchTrendingVehicles).toHaveBeenCalled();
      expect(screen.getByText(/Trending Vehicles/i)).toBeInTheDocument();
      expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
      expect(screen.getByText(/Auction Count: 10/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start Guided Tour/i })).toBeInTheDocument();
    });
  });

  it('shows premium gating message when not premium', async () => {
    render(
      <MemoryRouter>
        <GuestDashboard isPremium={false} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchTrendingVehicles).not.toHaveBeenCalled();
      expect(screen.queryByText(/Trending Vehicles/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Upgrade to Pro\/Enterprise to access analytics/i)).toBeInTheDocument();
    });
  });

  it('starts guided tour when button is clicked', async () => {
    render(
      <MemoryRouter>
        <GuestDashboard isPremium={true} />
      </MemoryRouter>
    );

    const tourButton = await screen.findByRole('button', { name: /Start Guided Tour/i });
    await userEvent.click(tourButton);

    expect(startGuidedTour).toHaveBeenCalledWith('guestDashboard');
    expect(toast.success).toHaveBeenCalledWith('Guided tour started!');
  });

  it('handles auction fetch error', async () => {
    (fetchRecentAuctions as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
    render(
      <MemoryRouter>
        <GuestDashboard isPremium={false} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load auctions.');
    });
  });

  // Snapshot Tests
  it('matches snapshot for free users', async () => {
    const { container } = render(
      <MemoryRouter>
        <GuestDashboard isPremium={false} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Toyota Camry 2020/i)).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot for premium users', async () => {
    const { container } = render(
      <MemoryRouter>
        <GuestDashboard isPremium={true} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Trending Vehicles/i)).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });
});