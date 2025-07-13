// File: SellerExportPanel.test.jsx
// Path: frontend/src/tests/SellerExportPanel.test.jsx
// Author: Cod1 (05051047)

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SellerExportPanel from '@components/seller/SellerExportPanel';
import '@testing-library/jest-dom';

jest.mock('@components/common/MultiLanguageSupport', () => ({
  useLanguage: () => ({ getTranslation: (key) => key })
}));

jest.mock('@utils/analyticsExportUtils', () => ({
  exportSellerData: jest.fn()
}));

describe('SellerExportPanel', () => {
  test('renders export panel and triggers export', () => {
    render(<SellerExportPanel sellerId="seller123" />);
    fireEvent.click(screen.getByText('download'));
    expect(screen.getByText('exportSellerData')).toBeInTheDocument();
  });
});
