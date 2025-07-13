/**
 * @file InsuranceClaimsProcessor.test.jsx
 * @path frontend/src/tests/insurance/InsuranceClaimsProcessor.test.jsx
 * @description UI and logic tests for InsuranceClaimsProcessor component including real-time polling, form validation, and premium AI risk display for CFH platform. Crown Certified for Rivers Auction Live Test Prep - May 07, 2025, 13:00 PST.
 * @wow Tests real-time claim updates, premium risk score rendering, and gamified confetti feedback.
 * @author Cod2 - May 07, 2025, 13:00 PST
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InsuranceClaimsProcessor from '@components/insurance/InsuranceClaimsProcessor';
import ToastManager from '@components/common/ToastManager';
import PremiumFeature from '@components/common/PremiumFeature';
import ConfettiHelper from '@utils/ConfettiHelper';

jest.mock('@components/common/ToastManager');
jest.mock('@components/common/PremiumFeature', () => ({ children }) => <div>{children}</div>);
jest.mock('@utils/ConfettiHelper');

global.fetch = jest.fn();

describe('InsuranceClaimsProcessor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** @description Renders claims and form UI */
  it('renders claims and form UI correctly', async () => {
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve([]), ok: true });
    render(<InsuranceClaimsProcessor />);
    expect(await screen.findByRole('form')).toBeInTheDocument();
    expect(screen.getByLabelText(/policy id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  /** @description Handles valid form submission */
  it('submits a valid claim', async () => {
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve([]), ok: true });
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ _id: '123', policyId: 'P1', amount: 5000, description: 'Test', status: 'pending' }), ok: true });
    render(<InsuranceClaimsProcessor />);
    fireEvent.change(screen.getByLabelText(/policy id/i), { target: { value: 'P1' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test claim valid input' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(ToastManager.success).toHaveBeenCalled());
  });

  /** @description Rejects invalid input */
  it('rejects empty form fields', async () => {
    render(<InsuranceClaimsProcessor />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(ToastManager.error).toHaveBeenCalled();
  });

  /** @description Updates claim status and triggers confetti */
  it('approves a claim and triggers confetti', async () => {
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve([{ _id: '123', policyId: 'P1', status: 'pending', amount: 5000, description: 'Test' }]), ok: true });
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ _id: '123', status: 'approved' }), ok: true });
    render(<InsuranceClaimsProcessor />);
    await waitFor(() => screen.getByTestId('claim-item'));
    fireEvent.click(screen.getByRole('button', { name: /approve/i }));
    await waitFor(() => expect(ConfettiHelper.trigger).toHaveBeenCalled());
  });

  /** @description Displays AI risk score for premium users */
  it('displays AI risk score for premium users', async () => {
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve([{ _id: '123', policyId: 'P1', status: 'pending', amount: 5000, description: 'Test', risk: 0.85 }]), ok: true });
    render(<InsuranceClaimsProcessor />);
    expect(await screen.findByText(/risk: 85%/i)).toBeInTheDocument();
  });

  /** @description Tests real-time polling behavior */
  it('sets polling interval for real-time updates when visible', async () => {
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    jest.useFakeTimers();
    fetch.mockResolvedValue({ json: () => Promise.resolve([]), ok: true });
    render(<InsuranceClaimsProcessor />);
    jest.advanceTimersByTime(6000);
    expect(fetch).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
