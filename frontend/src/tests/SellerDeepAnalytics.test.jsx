// File: SellerDeepAnalytics.test.jsx
// Path: frontend/src/tests/SellerDeepAnalytics.test.jsx
// Author: Cod1 (05051047)

import React from 'react';
import { render, screen } from '@testing-library/react';
import SellerDeepAnalytics from '@components/seller/SellerDeepAnalytics';
import '@testing-library/jest-dom';

jest.mock('@components/common/MultiLanguageSupport', () => ({
  useLanguage: () => ({ getTranslation: (key) => key })
}));

jest.mock('@components/common/PremiumFeature', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>
}));

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve([{ saleDate: '2025-05-01', revenue: 5000, feedbackScore: 4.5 }]) })
);

describe('SellerDeepAnalytics', () => {
  test('renders chart with fetched data', async () => {
    render(<SellerDeepAnalytics sellerId="seller123" />);
    expect(await screen.findByText('revenue')).toBeInTheDocument();
  });
});
