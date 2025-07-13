// Crown Certified Test — ArbitratorAnalyticsPanel.test.jsx
// Path: frontend/src/tests/arbitrator/ArbitratorAnalyticsPanel.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import ArbitratorAnalyticsPanel from '@/components/arbitrator/ArbitratorAnalyticsPanel';

describe('ArbitratorAnalyticsPanel', () => {
  const mockStats = {
    totalDisputes: 12,
    resolvedCases: 9,
    avgResolutionTime: 14,
    agreementRate: 75,
    premiumInsights: ['High consistency in no-vote cases', 'Top percentile by resolution speed'],
  };

  it('renders basic stats correctly', () => {
    render(<ArbitratorAnalyticsPanel stats={mockStats} isPremium={false} />);
    expect(screen.getByText('📁 Total Cases')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('✅ Resolved Cases')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('⏱️ Avg. Resolution Time')).toBeInTheDocument();
    expect(screen.getByText('14 hrs')).toBeInTheDocument();
    expect(screen.getByText('📊 Agreement Rate')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders premium insights if isPremium is true', () => {
    render(<ArbitratorAnalyticsPanel stats={mockStats} isPremium={true} />);
    expect(screen.getByText(/Premium Performance Insights/i)).toBeInTheDocument();
    expect(screen.getByText(/Top percentile by resolution speed/)).toBeInTheDocument();
  });

  it('does not render premium block for free users', () => {
    render(<ArbitratorAnalyticsPanel stats={mockStats} isPremium={false} />);
    expect(screen.queryByText(/Premium Performance Insights/i)).not.toBeInTheDocument();
  });

  it('handles missing stats gracefully', () => {
    render(<ArbitratorAnalyticsPanel stats={null} isPremium={false} />);
    expect(screen.getByText(/No analytics available/i)).toBeInTheDocument();
  });
});