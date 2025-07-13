// frontend/src/tests/global/PremiumBadge.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import PremiumBadge from '@/components/global/PremiumBadge';

describe('PremiumBadge Component', () => {
  test('renders nothing when isPremium is false', () => {
    const { container } = render(<PremiumBadge isPremium={false} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders badge when isPremium is true', () => {
    render(<PremiumBadge isPremium={true} />);
    expect(screen.getByText(/premium/i)).toBeInTheDocument();
  });
});