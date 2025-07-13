// Crown Certified Test — AIScorePanel.test.js
// Path: frontend/src/tests/ai/AIScorePanel.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import AIScorePanel from '@/components/ai/AIScorePanel';

describe('AIScorePanel', () => {
  const sampleProps = {
    aiScore: 72,
    category: 'financial',
  };

  it('renders the score panel with AI score', () => {
    render(<AIScorePanel {...sampleProps} isPremium={false} />);
    expect(screen.getByText(/AI Score/i)).toBeInTheDocument();
    expect(screen.getByText('72')).toBeInTheDocument();
  });

  it('displays premium icon when isPremium is true', () => {
    render(<AIScorePanel {...sampleProps} isPremium={true} />);
    expect(screen.getByTestId('premium-icon')).toBeInTheDocument();
  });

  it('does not show premium icon for free users', () => {
    render(<AIScorePanel {...sampleProps} isPremium={false} />);
    expect(screen.queryByTestId('premium-icon')).not.toBeInTheDocument();
  });

  it('handles missing score gracefully', () => {
    render(<AIScorePanel category="financial" isPremium={false} />);
    expect(screen.queryByText('72')).not.toBeInTheDocument();
  });
});