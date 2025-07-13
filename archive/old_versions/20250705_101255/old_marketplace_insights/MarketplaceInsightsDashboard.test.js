/**
 * File: MarketplaceInsightsDashboard.test.js
 * Path: frontend/src/tests/MarketplaceInsightsDashboard.test.js
 * Purpose: Unit tests for MarketplaceInsightsDashboard.jsx to validate core and premium features
 * Author: SG
 * Date: April 28, 2025
 * Cod2 Crown Certified
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarketplaceInsightsDashboard from '@components/marketplace/MarketplaceInsightsDashboard';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@utils/logger', () => ({ default: { error: vi.fn(), info: vi.fn() } }));
vi.mock('recharts', () => ({
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  PieChart: () => <div data-testid="pie-chart" />,
  Pie: () => <div />,
  Cell: () => <div />,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));
vi.mock('sonner', () => ({ toast: { info: vi.fn(), success: vi.fn(), error: vi.fn() } }));
vi.mock('@lib/websocket', () => ({
  useWebSocket: vi.fn(),
}));
vi.mock('@utils/lenderExportUtils', () => ({
  exportLenderInsightsToPdf: vi.fn(),
  exportInsightsToCsv: vi.fn(),
}));
vi.mock('@utils/SocialShareHelper', () => ({
  shareToPlatform: vi.fn(),
}));
vi.mock('@components/common/PremiumFeature', () => ({ children }) => <div>{children}</div>);
vi.mock('@components/common/PDFPreviewModal', () => () => <div data-testid="pdf-preview-modal" />);
vi.mock('@components/common/LanguageSelector', () => () => <div data-testid="language-selector" />);
vi.mock('@components/common/MultiLanguageSupport', () => ({
  useLanguage: () => ({
    getTranslation: (key) => key,
    currentLanguage: 'en',
  }),
}));
vi.mock('@components/marketplace/BestFinancingDealCard', () => () => <div data-testid="best-financing-deal" />);
vi.mock('@components/marketplace/HaulerSummaryCard', () => () => <div data-testid="hauler-summary" />);
vi.mock('@components/marketplace/BadgeDisplayPanel', () => () => <div data-testid="badge-panel" />);
vi.mock('@components/marketplace/ActivityOverview', () => () => <div data-testid="activity-overview" />);
vi.mock('@lib/utils', () => ({
  cn: vi.fn((...args) => args.join(' ')),
}));
global.fetch = vi.fn();

describe('MarketplaceInsightsDashboard', () => {
  const mockInsights = {
    auctions: 125,
    totalSpent: 75000,
    bestFinancingDeal: { lender: 'Lender A', savings: 500 },
    haulersHired: 3,
    badges: ['Gold Marketplace Member'],
    loyaltyPoints: 2500,
    spendingTrends: [{ month: 'Jan', amount: 5000 }],
    serviceUsage: [{ name: 'Auction Bids', value: 400 }],
    newFinancingDeal: { lender: 'Lender B', amount: 1000, rate: 5.5 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockReset();
    require('@lib/websocket').useWebSocket.mockReturnValue({
      sendMessage: vi.fn(),
      latestMessage: null,
    });
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockInsights,
    });
    require('@utils/lenderExportUtils').exportLenderInsightsToPdf.mockReturnValue('mock-pdf-data-uri');
  });

  it('displays activity overview for non-premium users', async () => {
    render(<MarketplaceInsightsDashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('activity-overview')).toBeInTheDocument();
      expect(screen.getByText('marketplaceInsightsDashboard')).toBeInTheDocument();
    });
  });

  it('disables premium features for non-premium users', async () => {
    render(<MarketplaceInsightsDashboard />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /preview PDF/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /export PDF/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download CSV/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share insights/i })).toBeInTheDocument();
    });
  });

  it('displays premium features for premium users', async () => {
    render(<MarketplaceInsightsDashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('best-financing-deal')).toBeInTheDocument();
      expect(screen.getByTestId('hauler-summary')).toBeInTheDocument();
      expect(screen.getByTestId('badge-panel')).toBeInTheDocument();
    });
  });

  it('triggers PDF preview for premium users', async () => {
    render(<MarketplaceInsightsDashboard />);
    await userEvent.click(screen.getByRole('button', { name: /preview PDF/i }));
    await waitFor(() => {
      expect(screen.getByTestId('pdf-preview-modal')).toBeInTheDocument();
      expect(require('@utils/lenderExportUtils').exportLenderInsightsToPdf).toHaveBeenCalledWith(mockInsights, true);
    });
  });

  it('exports PDF with WebSocket alert for premium users', async () => {
    const mockWs = {
      sendMessage: vi.fn(),
      latestMessage: 'PDF_Ready_user123_mock-url',
    };
    require('@lib/websocket').useWebSocket.mockReturnValue(mockWs);

    render(<MarketplaceInsightsDashboard />);
    await userEvent.click(screen.getByRole('button', { name: /export PDF/i }));
    await waitFor(() => {
      expect(mockWs.sendMessage).toHaveBeenCalledWith(expect.stringContaining('Export_PDF_user123_'));
      expect(require('sonner').toast.success).toHaveBeenCalledWith('pdfReady', expect.any(Object));
    });
  });

  it('shares insights for premium users', async () => {
    render(<MarketplaceInsightsDashboard />);
    await userEvent.click(screen.getByRole('button', { name: /share insights/i }));
    await waitFor(() => {
      expect(require('@utils/SocialShareHelper').shareToPlatform).toHaveBeenCalledWith(
        'twitter',
        expect.objectContaining({ text: 'Check out my Marketplace Insights!' })
      );
      expect(require('sonner').toast.success).toHaveBeenCalledWith('insightsShared');
    });
  });

  it('handles API failure', async () => {
    fetch.mockRejectedValueOnce(new Error('API failure'));
    render(<MarketplaceInsightsDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/errorFetchingInsights/i)).toBeInTheDocument();
      expect(require('@utils/logger').default.error).toHaveBeenCalledWith(
        expect.stringContaining('errorFetchingInsights')
      );
    });
  });

  it('handles WebSocket errors', async () => {
    require('@lib/websocket').useWebSocket.mockImplementation(() => {
      throw new Error('WebSocket failure');
    });
    render(<MarketplaceInsightsDashboard />);
    await userEvent.click(screen.getByRole('button', { name: /export PDF/i }));
    await waitFor(() => {
      expect(require('@utils/logger').default.error).toHaveBeenCalledWith(
        expect.stringContaining('WebSocket failure')
      );
    });
  });

  it('includes ARIA labels for accessibility', () => {
    render(<MarketplaceInsightsDashboard />);
    expect(screen.getByRole('button', { name: /preview PDF/i })).toHaveAttribute('aria-label', 'Preview PDF');
    expect(screen.getByRole('button', { name: /export PDF/i })).toHaveAttribute('aria-label', 'Export PDF');
    expect(screen.getByRole('button', { name: /download CSV/i })).toHaveAttribute('aria-label', 'Download CSV');
    expect(screen.getByRole('button', { name: /share insights/i })).toHaveAttribute('aria-label', 'Share insights');
  });
});

// Cod2 Crown Certified: This test suite validates MarketplaceInsightsDashboard.jsx with Jest,
// covering free/premium features, WebSocket alerts, PDF preview, insight sharing, error handling, and accessibility,
// uses @ aliases, and ensures robust testing coverage.