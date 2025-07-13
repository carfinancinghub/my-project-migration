// frontend/src/tests/lender/LenderTermsHistoryViewer.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LenderTermsHistoryViewer from '@/components/lender/LenderTermsHistoryViewer';

// Mock the fetch API
global.fetch = jest.fn();

describe('LenderTermsHistoryViewer Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders loading state initially', () => {
    render(<LenderTermsHistoryViewer userId="user123" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays terms history on successful fetch', async () => {
    const mockHistory = [
      { loanAmount: 5000, interestRate: 4.5, durationMonths: 24, createdAt: '2025-05-29' },
    ];
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: true, data: mockHistory }),
    });

    render(<LenderTermsHistoryViewer userId="user123" />);

    await waitFor(() => {
      expect(screen.getByText(/Loan: \$5000 at 4.5% for 24 months/)).toBeInTheDocument();
    });
  });

  test('displays error on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<LenderTermsHistoryViewer userId="user123" />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch terms history/i)).toBeInTheDocument();
    });
  });
});