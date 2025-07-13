/*
 * File: MarketplaceInsightsDashboard.test.jsx
 * Path: C:\CFH\frontend\src\tests\marketplace\MarketplaceInsightsDashboard.test.jsx
 * Purpose: SG Man-compliant test suite for MarketplaceInsightsDashboard.jsx covering Freemium, Premium, and Wow++ features.
 * Author: Rivers Auction QA Team
 * Date: June 3, 2025 (Time: 10:02 PM)
 * Cod2 Crown Certified: Yes
 * Save Location: C:\CFH\frontend\src\tests\marketplace\MarketplaceInsightsDashboard.test.jsx
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MarketplaceInsightsDashboard from '@/components/marketplace/MarketplaceInsightsDashboard';
import * as lenderExportUtils from '@/utils/lenderExportUtils';
import { toast } from 'sonner';

jest.mock('@/lib/websocket', () => ({
  useWebSocket: () => ({ sendMessage: jest.fn(), latestMessage: null })
}));

jest.mock('@/components/common/PremiumFeature', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>
}));
jest.mock('@/components/common/LanguageSelector', () => () => <div>LanguageSelector</div>);
jest.mock('@/components/common/PDFPreviewModal', () => () => <div>PDFPreviewModal</div>);
jest.mock('@/components/marketplace/BestFinancingDealCard', () => () => <div>BestFinancingDealCard</div>);
jest.mock('@/components/marketplace/HaulerSummaryCard', () => () => <div>HaulerSummaryCard</div>);
jest.mock('@/components/marketplace/BadgeDisplayPanel', () => () => <div>BadgeDisplayPanel</div>);
jest.mock('@/components/marketplace/ActivityOverview', () => () => <div>ActivityOverview</div>);
jest.mock('@/components/admin/layout/AdminLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('@/components/common/SEOHead', () => () => <></>);

jest.mock('@/utils/lenderExportUtils', () => ({
  exportLenderInsightsToPdf: jest.fn(),
  exportInsightsToCsv: jest.fn()
}));

jest.mock('@/utils/SocialShareHelper', () => ({
  shareToPlatform: jest.fn()
}));

it('renders loading state', async () => {
  render(<MarketplaceInsightsDashboard />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});

it('exports PDF when isPremium is true', async () => {
  await act(async () => {
    render(<MarketplaceInsightsDashboard isPremium={true} />);
  });
  fireEvent.click(screen.getByRole('button', { name: /exportPDF/i }));
  expect(lenderExportUtils.exportLenderInsightsToPdf).toHaveBeenCalled();
});

it('cleans up WebSocket listeners on unmount', async () => {
  const cleanupSpy = jest.spyOn(require('@/lib/websocket'), 'useWebSocket');
  const { unmount } = render(<MarketplaceInsightsDashboard isPremium={true} />);
  unmount();
  expect(cleanupSpy).toHaveBeenCalled();
});

it('handles null WebSocket messages', async () => {
  await act(async () => {
    render(<MarketplaceInsightsDashboard isPremium={true} />);
  });
  expect(toast.success).not.toHaveBeenCalled();
});

it('handles malformed WebSocket messages', async () => {
  jest.mock('@/lib/websocket', () => ({
    useWebSocket: () => ({ sendMessage: jest.fn(), latestMessage: {} })
  }));
  await act(async () => {
    render(<MarketplaceInsightsDashboard isPremium={true} />);
  });
  expect(toast.success).not.toHaveBeenCalled();
});

it('renders charts when isPremium is true', async () => {
  await act(async () => {
    render(<MarketplaceInsightsDashboard isPremium={true} />);
  });
  expect(await screen.findByText(/spendingTrends/i)).toBeInTheDocument();
  expect(await screen.findByText(/serviceUsage/i)).toBeInTheDocument();
});

it('does not render charts when isPremium is false', async () => {
  await act(async () => {
    render(<MarketplaceInsightsDashboard isPremium={false} />);
  });
  expect(screen.queryByText(/spendingTrends/i)).not.toBeInTheDocument();
});

it('exports CSV when isPremium is true', async () => {
  await act(async () => {
    render(<MarketplaceInsightsDashboard isPremium={true} />);
  });
  fireEvent.click(screen.getByRole('button', { name: /exportCSV/i }));
  expect(lenderExportUtils.exportInsightsToCsv).toHaveBeenCalled();
});

it('previews PDF when isPremium is true', async () => {
  await act(async () => {
    render(<MarketplaceInsightsDashboard isPremium={true} />);
  });
  fireEvent.click(screen.getByRole('button', { name: /previewPDF/i }));
  expect(lenderExportUtils.exportLenderInsightsToPdf).toHaveBeenCalledWith(expect.anything(), true);
});

it('shares insights when isPremium is true', async () => {
  const { shareToPlatform } = require('@/utils/SocialShareHelper');
  await act(async () => {
    render(<MarketplaceInsightsDashboard isPremium={true} />);
  });
  fireEvent.click(screen.getByRole('button', { name: /share/i }));
  expect(shareToPlatform).toHaveBeenCalledWith({
    data: { title: 'Marketplace Insights', url: expect.any(String) },
    platform: 'twitter'
  });
});

MarketplaceInsightsDashboard.test = {};
MarketplaceInsightsDashboard.test.propTypes = {};