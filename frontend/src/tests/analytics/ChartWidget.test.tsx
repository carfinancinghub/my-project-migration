/**
 * @file ChartWidget.test.tsx
 * @path C:\CFH\frontend\src\tests\analytics\ChartWidget.test.tsx
 * @author Cod1 Team
 * @created 2025-06-11 [1810]
 * @purpose Tests the ChartWidget component for rendering.
 * @user_impact Ensures the chart displays correctly.
 * @version 1.0.0
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartWidget } from '../../components/analytics/ChartWidget';

describe('ChartWidget', () => {
  it('renders its heading', () => {
    render(<ChartWidget data={[{}]} />);
    expect(screen.getByText('Chart')).toBeInTheDocument();
  });
});
