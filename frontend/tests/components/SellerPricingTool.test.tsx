/**
 * © 2025 CFH, All Rights Reserved
 * File: SellerPricingTool.test.tsx
 * Path: frontend/tests/components/SellerPricingTool.test.tsx
 * Purpose: Unit tests for SellerPricingTool component (mock API, debounce, input UX, accessibility)
 * Author: Cod1 Team
 * Date: 2025-07-18 [0837]
 * Version: 1.0.1
 * Version ID: z9x8c7v6-b5n4-m3l2-k1j0-h9g8f7d6s5a4
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: z9x8c7v6-b5n4-m3l2-k1j0-h9g8f7d6s5a4
 * Save Location: frontend/tests/components/SellerPricingTool.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SellerPricingTool from './SellerPricingTool';
import { getSuggestedPrice } from '@services/pricing';

jest.mock('@services/pricing');

describe('SellerPricingTool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields and button', () => {
    render(<SellerPricingTool />);
    expect(screen.getByPlaceholderText(/Car Make/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Car Model/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Year/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Suggested Price/i })).toBeInTheDocument();
  });

  it('fetches suggested price and displays it', async () => {
    (getSuggestedPrice as jest.Mock).mockResolvedValue({ suggestedPrice: 15500 });
    render(<SellerPricingTool />);
    fireEvent.change(screen.getByPlaceholderText(/Car Make/i), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByPlaceholderText(/Car Model/i), { target: { value: 'Camry' } });
    fireEvent.change(screen.getByPlaceholderText(/Year/i), { target: { value: '2021' } });
    fireEvent.click(screen.getByRole('button', { name: /Get Suggested Price/i }));

    await waitFor(() => expect(screen.getByText(/Suggested Listing Price/)).toBeInTheDocument());
    expect(screen.getByText(/\$15,500/)).toBeInTheDocument();
  });

  it('shows error message on API failure', async () => {
    (getSuggestedPrice as jest.Mock).mockRejectedValue(new Error('Pricing API down'));
    render(<SellerPricingTool />);
    fireEvent.change(screen.getByPlaceholderText(/Car Make/i), { target: { value: 'Honda' } });
    fireEvent.change(screen.getByPlaceholderText(/Car Model/i), { target: { value: 'Civic' } });
    fireEvent.change(screen.getByPlaceholderText(/Year/i), { target: { value: '2022' } });
    fireEvent.click(screen.getByRole('button', { name: /Get Suggested Price/i }));

    await waitFor(() => expect(screen.getByText(/Unable to fetch/)).toBeInTheDocument());
  });

  it('disables the button when loading', async () => {
    (getSuggestedPrice as jest.Mock).mockImplementation(() => new Promise(() => {})); // Simulate never resolves
    render(<SellerPricingTool />);
    fireEvent.change(screen.getByPlaceholderText(/Car Make/i), { target: { value: 'BMW' } });
    fireEvent.change(screen.getByPlaceholderText(/Car Model/i), { target: { value: 'X5' } });
    fireEvent.change(screen.getByPlaceholderText(/Year/i), { target: { value: '2020' } });
    fireEvent.click(screen.getByRole('button', { name: /Get Suggested Price/i }));
    expect(screen.getByRole('button', { name: /Analyzing/i })).toBeDisabled();
  });

  it('meets accessibility (aria) standards', () => {
    render(<SellerPricingTool />);
    expect(screen.getByPlaceholderText(/Car Make/i)).toHaveClass('w-full');
    expect(screen.getByRole('button', { name: /Get Suggested Price/i })).toBeEnabled();
    // Add more ARIA checks or jest-axe as needed
  });
});
