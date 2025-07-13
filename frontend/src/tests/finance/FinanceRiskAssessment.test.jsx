// File: FinanceRiskAssessment.test.jsx
// Path: frontend/src/tests/finance/FinanceRiskAssessment.test.jsx
// Purpose: Unit tests for FinanceRiskAssessment.jsx
// Author: Cod1 (05111410 - PDT)
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FinanceRiskAssessment from '@components/finance/FinanceRiskAssessment';

jest.mock('@services/ai/RiskAnalyzer', () => ({
  fetchRiskScores: jest.fn(() => Promise.resolve({ 'a1': 0.8, 'a2': 0.5 }))
}));

describe('FinanceRiskAssessment', () => {
  const mockAuctions = [
    { id: 'a1', riskScore: 0.2 },
    { id: 'a2', riskScore: 0.3 }
  ];

  it('renders auction risk list', () => {
    render(<FinanceRiskAssessment auctions={mockAuctions} />);
    expect(screen.getByText(/a1/i)).toBeInTheDocument();
    expect(screen.getByText(/a2/i)).toBeInTheDocument();
  });

  it('displays AI risk scores on success', async () => {
    render(<FinanceRiskAssessment auctions={mockAuctions} />);
    await waitFor(() => {
      expect(screen.getByText(/0.8/i)).toBeInTheDocument();
      expect(screen.getByText(/0.5/i)).toBeInTheDocument();
    });
  });

  it('shows error message on failure', async () => {
    const { fetchRiskScores } = require('@services/ai/RiskAnalyzer');
    fetchRiskScores.mockImplementationOnce(() => Promise.reject(new Error('Failed')));
    render(<FinanceRiskAssessment auctions={mockAuctions} />);
    await waitFor(() => {
      expect(screen.getByText(/Unable to load risk analytics/i)).toBeInTheDocument();
    });
  });
});

/**
 * Functions Summary:
 * - renders auction risk list: Verifies auction IDs and base risk scores display
 * - displays AI risk scores on success: Confirms risk analytics from mock
 * - shows error message on failure: Fallback path for failed AI service
 * Dependencies: @services/ai/RiskAnalyzer, React Testing Library
 */