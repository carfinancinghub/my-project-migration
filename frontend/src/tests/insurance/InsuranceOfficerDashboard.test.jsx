/**
 * @file InsuranceOfficerDashboard.test.jsx
 * @path frontend/src/tests/insurance/InsuranceOfficerDashboard.test.jsx
 * @description Unit tests for InsuranceOfficerDashboard, covering SEO, analytics, policy management, and WOW features.
 * @author Cod2
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import InsuranceOfficerDashboard from '@components/insurance/InsuranceOfficerDashboard';
import * as userContext from '@utils/UserContext';
import * as confetti from '@utils/ConfettiHelper';

jest.mock('axios');
jest.mock('@utils/ConfettiHelper', () => ({
  useConfetti: jest.fn(() => ({ triggerConfetti: jest.fn() })),
}));

const mockPolicies = [
  {
    id: 'policy1',
    vehicleId: 'VIN123',
    status: 'pending',
    premium: true,
  },
];

describe('InsuranceOfficerDashboard', () => {
  beforeEach(() => {
    jest.spyOn(userContext, 'useUserContext').mockReturnValue({ user: { role: 'insuranceOfficer' } });
    axios.get.mockResolvedValue({ data: mockPolicies });
    axios.post.mockResolvedValue({ data: { ...mockPolicies[0], status: 'approved' } });
  });

  it('renders the dashboard and loads policies', async () => {
    render(<InsuranceOfficerDashboard />);
    expect(screen.getByRole('heading', { name: /Insurance Officer Dashboard/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Policy #policy1/i)).toBeInTheDocument();
    });
  });

  it('approves a policy and triggers confetti for premium', async () => {
    const triggerConfetti = jest.fn();
    confetti.useConfetti.mockReturnValue({ triggerConfetti });
    render(<InsuranceOfficerDashboard />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('approve-policy1'));
    });
    expect(axios.post).toHaveBeenCalledWith('/api/insurance/approve/policy1');
    expect(triggerConfetti).toHaveBeenCalled();
  });

  it('displays SEO metadata', () => {
    render(<InsuranceOfficerDashboard />);
    expect(screen.getByTestId('seo-head')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders analytics panel for enterprise users', async () => {
    jest.spyOn(userContext, 'useUserContext').mockReturnValue({
      user: { role: 'insuranceOfficer', subscription: ['insuranceEnterprise'] },
    });
    render(<InsuranceOfficerDashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('analytics-panel')).toBeInTheDocument();
    });
  });

  it('handles voice command integration', async () => {
    render(<InsuranceOfficerDashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('voice-command')).toBeInTheDocument();
    });
  });

  it('displays underwriting checklist for selected policy', async () => {
    render(<InsuranceOfficerDashboard />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('details-policy1'));
      expect(screen.getByTestId('underwriting-checklist')).toBeInTheDocument();
    });
  });
});