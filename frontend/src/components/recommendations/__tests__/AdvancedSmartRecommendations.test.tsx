/**
 * © 2025 CFH, All Rights Reserved
 * File: AdvancedSmartRecommendations.test.tsx
 * Path: frontend/src/components/recommendations/__tests__/AdvancedSmartRecommendations.test.tsx
 * Purpose: Jest/RTL test for AdvancedSmartRecommendations component; covers fetching, prioritization, export, and reasoning.
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-17 [1121]
 * Version: 1.0.0
 * Crown Certified: Yes (pending)
 * Related To: frontend/src/components/recommendations/AdvancedSmartRecommendations.tsx
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvancedSmartRecommendations from '../AdvancedSmartRecommendations';

jest.mock('axios', () => ({
  get: jest.fn(),
}));
import axios from 'axios';

const mockRecs = [
  {
    lenderName: 'CFH Bank',
    rate: 2.5,
    term: 36,
    monthlyPayment: 300,
    downPayment: 1000,
    matchScore: 96,
    aiReasoning: 'Best rate and shortest term for your credit score.',
  },
  {
    lenderName: 'AutoFinancePro',
    rate: 3.0,
    term: 48,
    monthlyPayment: 250,
    downPayment: 500,
    matchScore: 87,
  },
];

describe('AdvancedSmartRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.setItem('token', 'test-token');
  });

  it('fetches and displays recommendations', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockRecs });
    render(<AdvancedSmartRecommendations buyerId="buyer123" />);
    await waitFor(() => expect(screen.getByText(/CFH Bank/)).toBeInTheDocument());
    expect(screen.getByText(/AutoFinancePro/)).toBeInTheDocument();
    expect(screen.getByText(/Match Score: 96%/)).toBeInTheDocument();
    expect(screen.getByText(/Match Score: 87%/)).toBeInTheDocument();
  });

  it('updates recommendations when priority changes', async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockRecs })
      .mockResolvedValueOnce({ data: [mockRecs[1]] });
    render(<AdvancedSmartRecommendations buyerId="buyer123" />);
    await waitFor(() => expect(screen.getByText(/CFH Bank/)).toBeInTheDocument());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'lowestPayment' } });
    await waitFor(() => expect(screen.getByText(/AutoFinancePro/)).toBeInTheDocument());
  });

  it('shows AI reasoning (Wow++ feature)', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockRecs });
    render(<AdvancedSmartRecommendations buyerId="buyer123" />);
    await waitFor(() => expect(screen.getByText(/CFH Bank/)).toBeInTheDocument());
    fireEvent.click(screen.getAllByText(/Why this option?/)[0]);
    expect(screen.getByText(/Best rate and shortest term/)).toBeInTheDocument();
  });

  it('calls export CSV when button clicked (Premium feature)', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockRecs });
    const createObjectURL = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    render(<AdvancedSmartRecommendations buyerId="buyer123" />);
    await waitFor(() => expect(screen.getByText(/CFH Bank/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /export csv/i }));
    expect(createObjectURL).toHaveBeenCalled();
  });

  it('handles API error gracefully', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Fetch fail'));
    render(<AdvancedSmartRecommendations buyerId="buyer123" />);
    await waitFor(() => expect(screen.getByText(/Unable to load recommendations/)).toBeInTheDocument());
  });
});
