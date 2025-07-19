/**
 * © 2025 CFH, All Rights Reserved
 * File: StartAuctionForm.test.tsx
 * Path: frontend/tests/components/seller/StartAuctionForm.test.tsx
 * Purpose: Unit tests for StartAuctionForm component, validating auction creation, input handling, error feedback, and accessibility.
 * Author: Cod1 Team
 * Date: 2025-07-18 [0837]
 * Version: 1.0.1
 * Version ID: a1s2d3f4-g5h6-j7k8-l9m0-n1o2p3q4r5s6
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: a1s2d3f4-g5h6-j7k8-l9m0-n1o2p3q4r5s6
 * Save Location: frontend/tests/components/seller/StartAuctionForm.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StartAuctionForm from './StartAuctionForm';
import { startAuction } from '@services/auction';
import { toast } from 'react-toastify';

jest.mock('@services/auction');
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() }
}));

describe('StartAuctionForm', () => {
  const carId = 'testCarId';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields and button', () => {
    render(<StartAuctionForm carId={carId} />);
    expect(screen.getByPlaceholderText(/Starting Price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Auction Duration/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Launch Auction/i })).toBeInTheDocument();
  });

  it('submits the form with valid input and calls startAuction', async () => {
    (startAuction as jest.Mock).mockResolvedValue({});
    render(<StartAuctionForm carId={carId} />);
    fireEvent.change(screen.getByPlaceholderText(/Starting Price/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByPlaceholderText(/Auction Duration/i), { target: { value: '24' } });
    fireEvent.click(screen.getByRole('button', { name: /Launch Auction/i }));

    await waitFor(() => expect(startAuction).toHaveBeenCalledWith(carId, '5000', '24', expect.anything()));
    expect(toast.success).toHaveBeenCalledWith('Auction started successfully!');
  });

  it('shows error toast on API error', async () => {
    (startAuction as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<StartAuctionForm carId={carId} />);
    fireEvent.change(screen.getByPlaceholderText(/Starting Price/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByPlaceholderText(/Auction Duration/i), { target: { value: '24' } });
    fireEvent.click(screen.getByRole('button', { name: /Launch Auction/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('API Error')));
  });

  it('disables the button and shows loading when submitting', async () => {
    (startAuction as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<StartAuctionForm carId={carId} />);
    fireEvent.change(screen.getByPlaceholderText(/Starting Price/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByPlaceholderText(/Auction Duration/i), { target: { value: '24' } });
    fireEvent.click(screen.getByRole('button', { name: /Launch Auction/i }));

    expect(screen.getByRole('button', { name: /Launching/i })).toBeDisabled();
  });

  it('meets accessibility (aria) standards', () => {
    render(<StartAuctionForm carId={carId} />);
    expect(screen.getByPlaceholderText(/Starting Price/i)).toHaveAttribute('aria-label', 'Starting Price');
    expect(screen.getByPlaceholderText(/Auction Duration/i)).toHaveAttribute('aria-label', 'Auction Duration');
    // Additional jest-axe or ARIA checks can be added here if needed
  });
});
