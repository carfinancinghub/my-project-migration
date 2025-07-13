import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import UserProfilePage from '@/components/user/UserProfilePage';
import { useAuth } from '@utils/UserAuth';
import { analyticsApi } from '@services/analyticsApi';
import { v4 as uuidv4 } from 'uuid';

expect.extend(toHaveNoViolations);

jest.mock('@utils/UserAuth');
jest.mock('@services/analyticsApi');
jest.mock('uuid', () => ({ v4: jest.fn(() => 'mock-correlation-id') }));

const mockUserData = {
  username: 'testuser',
  email: 'test@example.com',
  subscription: { plan: 'premium', payments: [{ date: '2025-06-01', amount: '$100', status: 'paid' }] },
};

describe('UserProfilePage', () => {
  let mockJwt = 'mock-jwt-token';
  let mockCorrelationId = 'mock-correlation-id';

  beforeEach(() => {
    useAuth.mockReturnValue({ authToken: mockJwt });
    analyticsApi.getUserProfile.mockResolvedValue({ data: mockUserData });
    analyticsApi.updateUserProfile.mockClear();
  });

  it('renders loading initially then loads profile data', async () => {
    render(<UserProfilePage userId="123" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/testuser/)).toBeInTheDocument());
    expect(analyticsApi.getUserProfile).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      headers: { Authorization: `Bearer ${mockJwt}`, 'X-Correlation-ID': mockCorrelationId }
    }));
  });

  it('allows editing and saving user profile with JWT and X-Correlation-ID', async () => {
    analyticsApi.updateUserProfile.mockResolvedValue({});
    render(<UserProfilePage userId="123" />);
    await waitFor(() => screen.getByText(/edit/i));

    fireEvent.click(screen.getByText(/edit/i));
    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'newname' } });
    fireEvent.click(screen.getByLabelText(/save/i));

    await waitFor(() => expect(analyticsApi.updateUserProfile).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      headers: { Authorization: `Bearer ${mockJwt}`, 'X-Correlation-ID': mockCorrelationId }
    }));
  });

  it('retries updateUserProfile on failure and succeeds', async () => {
    let callCount = 0;
    analyticsApi.updateUserProfile.mockImplementation(() => {
      callCount++;
      return callCount <= 2 ? Promise.reject(new Error('API failure')) : Promise.resolve({});
    });

    jest.useFakeTimers();
    render(<UserProfilePage userId="123" />);
    await waitFor(() => screen.getByText(/edit/i));

    fireEvent.click(screen.getByText(/edit/i));
    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'newname' } });
    fireEvent.click(screen.getByLabelText(/save/i));

    jest.advanceTimersByTime(500); // Retry logic
    jest.advanceTimersByTime(500);
    await waitFor(() => expect(analyticsApi.updateUserProfile).toHaveBeenCalledTimes(3));

    jest.useRealTimers();
  });

  it('renders subscription table and PointsHistory', async () => {
    render(<UserProfilePage userId="123" />);
    await waitFor(() => screen.getByText(/premium/));
    expect(screen.getByTestId('points-history')).toBeInTheDocument();
    expect(screen.getByText(/paid/)).toBeInTheDocument();
  });

  it('includes ARIA attributes', async () => {
    render(<UserProfilePage userId="123" />);
    await waitFor(() => screen.getByRole('region'));
    expect(screen.getByRole('region')).toHaveAttribute('aria-label');
  });

  it('is accessible according to jest-axe', async () => {
    const { container } = render(<UserProfilePage userId="123" />);
    await waitFor(() => screen.getByText(/premium/));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});