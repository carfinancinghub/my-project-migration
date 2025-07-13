// File: OnboardingWizard.test.jsx
// Path: C:\CFH\frontend\src\tests\onboarding\OnboardingWizard.test.jsx
// Purpose: Unit tests for OnboardingWizard component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnboardingWizard from '@components/onboarding/OnboardingWizard';
import { completeProfile } from '@services/api/onboarding';
import logger from '@utils/logger';

jest.mock('@services/api/onboarding');
jest.mock('@utils/logger');

describe('OnboardingWizard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial step correctly', () => {
    render(<OnboardingWizard userId="123" />);
    expect(screen.getByText(/Welcome to Rivers Auction/i)).toBeInTheDocument();
    expect(screen.getByText(/Begin Setup/i)).toBeInTheDocument();
  });

  it('navigates to profile input step', () => {
    render(<OnboardingWizard userId="123" />);
    fireEvent.click(screen.getByText(/Begin Setup/i));
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
  });

  it('submits profile successfully', async () => {
    completeProfile.mockResolvedValueOnce({});
    render(<OnboardingWizard userId="123" />);
    fireEvent.click(screen.getByText(/Begin Setup/i));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByText(/Submit Profile/i));
    await waitFor(() => {
      expect(screen.getByText(/Profile setup complete/i)).toBeInTheDocument();
      expect(screen.getByText(/Explore Auctions/i)).toBeInTheDocument();
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Completed onboarding'));
  });

  it('shows error on profile submission failure', async () => {
    completeProfile.mockRejectedValueOnce(new Error('API error'));
    render(<OnboardingWizard userId="123" />);
    fireEvent.click(screen.getByText(/Begin Setup/i));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByText(/Submit Profile/i));
    await waitFor(() => {
      expect(screen.getByText(/Failed to save profile/i)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to complete onboarding'));
    });
  });

  it('requires userId prop', () => {
    expect(OnboardingWizard.propTypes.userId).toBe(PropTypes.string.isRequired);
  });
});