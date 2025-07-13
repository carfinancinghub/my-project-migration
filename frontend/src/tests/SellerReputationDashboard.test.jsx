// File: SellerReputationDashboard.test.jsx
// Path: frontend/src/tests/SellerReputationDashboard.test.jsx
// Author: Cod1 (05051047)

import React from 'react';
import { render, screen } from '@testing-library/react';
import SellerReputationDashboard from '@components/seller/SellerReputationDashboard';
import '@testing-library/jest-dom';

jest.mock('@components/seller/SellerDeepAnalytics', () => () => <div>Mocked Analytics</div>);
jest.mock('@components/seller/SellerExportPanel', () => () => <div>Mocked Export Panel</div>);
jest.mock('@components/common/MultiLanguageSupport', () => ({
  useLanguage: () => ({ getTranslation: (key) => key })
}));
jest.mock('@components/common/PremiumFeature', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>
}));

const listings = [
  { id: 'listing1', views: 40, inquiries: 15, conversionRate: 0.05, price: 11000, avgMarketPrice: 9500, negotiationAttempts: 5 }
];

describe('SellerReputationDashboard', () => {
  test('renders reputation metrics and integrated modules', () => {
    render(<SellerReputationDashboard sellerId="seller123" listings={listings} />);
    expect(screen.getByText('sellerReputation')).toBeInTheDocument();
    expect(screen.getByText('Mocked Analytics')).toBeInTheDocument();
    expect(screen.getByText('Mocked Export Panel')).toBeInTheDocument();
    expect(screen.getByText('negotiationTips')).toBeInTheDocument();
  });
});
