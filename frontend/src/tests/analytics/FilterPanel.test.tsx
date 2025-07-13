/**
 * @file FilterPanel.test.tsx
 * @path C:\CFH\frontend\src\tests\analytics\FilterPanel.test.tsx
 * @author Cod1 Team
 * @created 2025-06-11 [1810]
 * @purpose Tests the FilterPanel component for filter application.
 * @user_impact Ensures users can apply date filters correctly.
 * @version 1.0.0
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '../../components/analytics/FilterPanel';

describe('FilterPanel', () => {
  it('calls onChange when applied', () => {
    const fake = jest.fn();
    render(<FilterPanel onChange={fake} />);
    fireEvent.change(screen.getByLabelText('From:'), { target: { value: '2025-01-01' } });
    fireEvent.click(screen.getByText('Apply'));
    expect(fake).toHaveBeenCalledWith({ dateFrom: '2025-01-01', dateTo: '' });
  });
});
