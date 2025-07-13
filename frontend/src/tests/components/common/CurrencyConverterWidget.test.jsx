// File: CurrencyConverterWidget.test.jsx
// Path: C:\CFH\frontend\src\tests\components\common\CurrencyConverterWidget.test.jsx
// Purpose: Unit tests for CurrencyConverterWidget.jsx, covering rendering and conversion
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\tests\components\common\CurrencyConverterWidget.test.jsx to test the CurrencyConverterWidget.jsx component.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CurrencyConverterWidget from '@components/common/CurrencyConverterWidget';
import logger from '@utils/logger';

jest.mock('@utils/logger');

describe('CurrencyConverterWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default currency', () => {
    render(<CurrencyConverterWidget amount={100} />);
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Currency converter');
    expect(screen.getByRole('option', { name: 'EUR' }).selected).toBe(true);
  });

  it('converts currency on button click', async () => {
    render(<CurrencyConverterWidget amount={100} />);
    fireEvent.click(screen.getByRole('button', { name: /Convert/ }));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Converted 100 USD to'));
    await screen.findByText(/85.00 EUR/);
  });

  it('handles invalid currency', async () => {
    render(<CurrencyConverterWidget amount={100} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'INVALID' } });
    fireEvent.click(screen.getByRole('button', { name: /Convert/ }));
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Currency conversion failed'));
    await screen.findByText('Error');
  });
});

CurrencyConverterWidget.test.propTypes = {};