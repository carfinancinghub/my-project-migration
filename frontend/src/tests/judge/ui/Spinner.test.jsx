// frontend/src/tests/ui/Spinner.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from '@/components/ui/Spinner';

describe('Spinner Component', () => {
  test('renders spinner element', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // Assumes Spinner has role="status"
  });
});