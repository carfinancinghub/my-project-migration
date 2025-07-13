// Crown Certified Test — SmartInsightsWidget.test.js
// Path: frontend/src/tests/ai/SmartInsightsWidget.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SmartInsightsWidget from '@/components/ai/SmartInsightsWidget';

describe('SmartInsightsWidget', () => {
  const insightsMock = [
    { id: 1, label: 'Loan Risk', value: 'Low' },
    { id: 2, label: 'Best Region', value: 'Pacific West' },
  ];

  it('renders default insights view', () => {
    render(<SmartInsightsWidget insights={insightsMock} isPremium={false} />);
    expect(screen.getByText('Loan Risk')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('renders premium section for premium users', () => {
    render(<SmartInsightsWidget insights={insightsMock} isPremium={true} />);
    expect(screen.getByTestId('premium-insights')).toBeInTheDocument();
  });

  it('does not render premium section for free users', () => {
    render(<SmartInsightsWidget insights={insightsMock} isPremium={false} />);
    expect(screen.queryByTestId('premium-insights')).not.toBeInTheDocument();
  });

  it('handles empty insights gracefully', () => {
    render(<SmartInsightsWidget insights={[]} isPremium={true} />);
    expect(screen.getByText(/No insights/i)).toBeInTheDocument();
  });

  it('expands and collapses insight details if interactive', () => {
    render(<SmartInsightsWidget insights={insightsMock} isPremium={true} />);
    const toggle = screen.getByTestId('insight-toggle-1');
    fireEvent.click(toggle);
    expect(screen.getByTestId('insight-expanded-1')).toBeInTheDocument();
  });
});