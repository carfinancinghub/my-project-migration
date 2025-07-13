// File: ValuationDisplay.test.jsx
// Path: C:\CFH\frontend\src\tests\components\common\ValuationDisplay.test.jsx
// Purpose: Unit tests for ValuationDisplay.jsx, covering rendering, formatting, and animations
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\tests\components\common\ValuationDisplay.test.jsx to test the ValuationDisplay.jsx component.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ValuationDisplay from '@components/common/ValuationDisplay';
import logger from '@utils/logger';

jest.mock('@utils/logger');

describe('ValuationDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders valuation with default formatting', () => {
    render(<ValuationDisplay value={1000} type="vehicle" />);
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('vehicle')).toBeInTheDocument();
  });

  it('shows upward change animation', () => {
    render(<ValuationDisplay value={1000} />);
    expect(screen.getByText('↑')).toHaveClass('up');
  });

  it('hides decimals when specified', () => {
    render(<ValuationDisplay value={1000.50} hideDecimals={true} />);
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('abbreviates large values', () => {
    render(<ValuationDisplay value={1000000} abbreviate={true} />);
    expect(screen.getByText('$1.0M')).toBeInTheDocument();
  });

  it('displays tooltip on hover', () => {
    render(<ValuationDisplay value={1000} type="vehicle" />);
    const tooltip = screen.getByRole('region');
    fireEvent.mouseEnter(tooltip);
    expect(screen.getByText(/AI estimation for vehicle/)).toBeInTheDocument();
    fireEvent.mouseLeave(tooltip);
    expect(screen.queryByText(/AI estimation for vehicle/)).not.toBeInTheDocument();
  });

  it('handles invalid currency gracefully', () => {
    render(<ValuationDisplay value={1000} currency="INVALID" />);
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Currency symbol retrieval failed'));
  });
});

ValuationDisplay.test.propTypes = {};