// Crown Certified Test — AIBadgeOverlay.test.js
// Path: frontend/src/tests/ai/AIBadgeOverlay.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import AIBadgeOverlay from '@/components/ai/AIBadgeOverlay';

describe('AIBadgeOverlay', () => {
  const defaultProps = {
    badgeType: 'intelligence',
    stats: { score: 88 },
  };

  it('renders static badge for free users', () => {
    render(<AIBadgeOverlay {...defaultProps} isPremium={false} />);
    expect(screen.getByTestId('badge-overlay')).toBeInTheDocument();
    expect(screen.queryByTestId('badge-animation')).not.toBeInTheDocument();
  });

  it('renders animated badge for premium users', () => {
    render(<AIBadgeOverlay {...defaultProps} isPremium={true} />);
    expect(screen.getByTestId('badge-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('badge-animation')).toBeInTheDocument();
  });

  it('renders badge with correct score', () => {
    render(<AIBadgeOverlay {...defaultProps} isPremium={true} />);
    expect(screen.getByText('88')).toBeInTheDocument();
  });

  it('handles missing stats gracefully', () => {
    render(<AIBadgeOverlay badgeType="intelligence" isPremium={true} />);
    expect(screen.queryByText('88')).not.toBeInTheDocument();
  });
});