/*
 * File: MarketplaceInsightsDashboard.jsx
 * Path: frontend/src/components/marketplace/MarketplaceInsightsDashboard.jsx
 * Author: Cod1 Final Pass
 * Date: June 3, 2025 (Time: 04:35 PM California Time)
 * Crown Certified: Yes
 * Tier: Freemium + Premium + Wow++
 * Save Location: C:\CFH\frontend\src\components\marketplace\MarketplaceInsightsDashboard.jsx
 *
 * Description:
 * Final reworked dashboard with full isPremium gating, WebSocket alert control, and export restrictions.
 *
 * ## Functions Summary
 *
 * | Function               | Purpose                            | Inputs | Outputs     | Dependencies                                     |
 * |------------------------|------------------------------------|--------|-------------|--------------------------------------------------|
 * | MarketplaceInsightsDashboard | Renders unified dashboard        | None   | JSX Element | react, framer-motion, recharts, sonner, lucide-react, @/components/*, @utils/* |
 * | fetchInsights          | Fetches mock insights data         | None   | Promise<void> | @utils/logger, setInsights, setLoading, setError |
 * | handleExportPdf        | Exports insights to PDF (Premium)  | None   | void        | @utils/lenderExportUtils, sonner                |
 * | handleExportCsv        | Exports insights to CSV (Premium)  | None   | void        | @utils/lenderExportUtils                        |
 * | handlePreviewPdf       | Previews PDF (Premium)             | None   | void        | @utils/lenderExportUtils, setPdfPreview         |
 * | handleShareInsights    | Shares via social (Premium)        | None   | void        | @utils/SocialShareHelper, sonner                |
 * | closePdfPreview        | Closes PDF preview modal           | None   | void        | setPdfPreview                                   |
 */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, FilePdf, FileCsv, Share2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import PremiumFeature from '@/components/common/PremiumFeature';
import LanguageSelector from '@/components/common/LanguageSelector';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import { useWebSocket } from '@/lib/websocket';
import { logger } from '@/utils/SocialShareHelper';
import { cn } from '@/lib/utils';
import { exportLenderInsightsToPdf, exportInsightsToCsv } from '@/utils/lenderExportUtils';
import { shareToPlatform } from '@/utils/SocialShareHelper';
import BestFinancingDealCard from '@/components/marketplace/BestFinancingDealCard';
import HaulerSummaryCard from '@/components/marketplace/HaulerSummaryCard';
import BadgeDisplayPanel from '@/components/marketplace/BadgeDisplayPanel';
import ActivityOverview from '@/components/marketplace/ActivityOverview';
import PDFPreviewModal from '@/components/common/PDFPreviewModal';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import SEOHead from '@/components/common/SEOHead';

const MarketplaceInsightsDashboard = ({ isPremium = false }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const { sendMessage, latestMessage } = useWebSocket('ws://localhost:8080');
  const { getTranslation } = useLanguage();
  const userId = 'user123';

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = {
        totalAuctions: 125,
        totalSpent: 75000,
        loyaltyPoints: 2500,
        badges: ['Gold Marketplace Member', 'Top Bidder'],
        spendingTrends: [
          { month: 'Jan', amount: 5000 },
          { month: 'Feb', amount: 6500 },
          { month: 'Mar', amount: 8000 },
          { month: 'Apr', amount: 7000 },
          { month: 'May', amount: 9000 },
          { month: 'Jun', amount: 10000 },
        ],
        serviceUsage: [
          { name: 'Auction Bids', value: 400 },
          { name: 'Financing Deals', value: 150 },
          { name: 'Hauler Hires', value: 50 },
        ],
        bestFinancingDeal: { lender: 'Lender A', savings: 500 },
        haulerSummary: { haulerName: 'Hauler A', hires: 3, region: 'west' },
        newFinancingDeal: { lender: 'Lender B', amount: 1000, rate: 5.5 }
      };
      setInsights(mockData);
    } catch (err) {
      logger.error('Error fetching insights:', err.message);
      setError(`${getTranslation('errorFetchingInsights')}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [getTranslation]);

  useEffect(() => { fetchInsights(); }, [fetchInsights]);

  const handleExportPdf = () => {
    if (isPremium && insights) {
      toast.info(getTranslation('generatingPDF'));
      exportLenderInsightsToPdf(insights);
    }
  };

  const handleExportCsv = () => {
    if (isPremium && insights) {
      exportInsightsToCsv(insights);
    }
  };

  const handlePreviewPdf = () => {
    if (isPremium && insights) {
      setPdfPreview(exportLenderInsightsToPdf(insights, true));
    }
  };

  const closePdfPreview = () => setPdfPreview(null);

  const handleShareInsights = () => {
    if (isPremium) {
      const url = `${window.location.origin}/insights?userId=${userId}`;
      shareToPlatform({ data: { title: 'Marketplace Insights', url }, platform: 'twitter' });
      toast.success(getTranslation('insightsShared'));
    }
  };

  useEffect(() => {
    if (isPremium && latestMessage?.includes('financing deal')) {
      toast.success(latestMessage, {
        duration: 8000,
        style: { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' },
        action: { label: 'View', onClick: () => logger.info('Navigating to deals page') }
      });
    }
  }, [latestMessage, isPremium]);

  if (loading) return <div role="status"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;
  if (error) return <div className={cn("bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded")} role="alert">{error}</div>;
  if (!insights) return <div>{getTranslation('noInsightsAvailable')}</div>;

  return (
    <AdminLayout>
      <SEOHead title="Marketplace Insights Dashboard - CFH" />
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="space-y-8 container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{getTranslation('marketplaceInsightsDashboard')}</h1>
            {isPremium && <PremiumFeature feature="multiLanguage"><LanguageSelector /></PremiumFeature>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActivityOverview totalAuctions={insights.totalAuctions} totalSpent={insights.totalSpent} />
            {isPremium && (
              <PremiumFeature feature="marketplaceInsights">
                <BestFinancingDealCard deal={insights.bestFinancingDeal} />
                <HaulerSummaryCard summary={insights.haulerSummary} />
              </PremiumFeature>
            )}
            <BadgeDisplayPanel badges={insights.badges} loyaltyPoints={insights.loyaltyPoints} />
          </div>

          {isPremium && (
            <PremiumFeature feature="charts">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">{getTranslation('spendingTrends')}</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={insights.spendingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">{getTranslation('serviceUsage')}</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={insights.serviceUsage} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {insights.serviceUsage.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={['#10B981', '#3B82F6', '#F59E0B'][idx % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleExportPdf} icon={FilePdf}>{getTranslation('exportPDF')}</Button>
                <Button onClick={handleExportCsv} icon={FileCsv}>{getTranslation('exportCSV')}</Button>
                <Button onClick={handlePreviewPdf} icon={FilePdf}>{getTranslation('previewPDF')}</Button>
                <Button onClick={handleShareInsights} icon={Share2}>{getTranslation('share')}</Button>
              </div>
            </PremiumFeature>
          )}

          <PDFPreviewModal pdfData={pdfPreview} onClose={closePdfPreview} title={getTranslation('pdfPreview')} />
        </div>
      </div>
    </AdminLayout>
  );
};

MarketplaceInsightsDashboard.propTypes = {
  isPremium: PropTypes.bool
};

export default MarketplaceInsightsDashboard;