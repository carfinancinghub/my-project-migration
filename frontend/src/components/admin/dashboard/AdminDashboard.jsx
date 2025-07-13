// File: AdminDashboard.jsx
// Path: frontend/src/components/admin/dashboard/AdminDashboard.jsx
// 👑 Cod1 + SG Crown Certified with Multi-Language, Lazy Loading, and Error Boundaries
// Purpose: Admin dashboard with KPI metrics, dispute analytics, user management, and multi-language support
// Functions:
// - fetchKPI(): Retrieves backend KPI data for admin panel
// - AdminDisputeAnalytics: Lazy-loaded, gated dispute insights for Enterprise users
// - AdminStatsPanel: Displays system KPIs
// - UserManager: Admin-facing user control panel
// - LanguageSelector: Multi-language UI toggle for international admins

import React\nimport SEOHead from '@components/common/SEOHead';, { useEffect, useState, Suspense } from 'react';
import PremiumFeature from '@/components/common/PremiumFeature';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LanguageSelector from '@/components/common/LanguageSelector';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import AdminStatsPanel from './AdminStatsPanel';
import UserManager from '../user/AdminUserManager';
import logger from '@/utils/logger';

// Lazy-loaded dispute analytics
const AdminDisputeAnalytics = React.lazy(() => import('@components/admin/disputes/AdminDisputeAnalytics'));

const AdminDashboard = () => {
  const { getTranslation } = useLanguage();
  const [kpiData, setKpiData] = useState(null);

  useEffect(() => {
    fetchKPI();
  }, []);

  const fetchKPI = async () => {
    try {
      const res = await fetch('/api/admin/kpis');
      const data = await res.json();
      setKpiData(data);
    } catch (err) {
      logger.error('Failed to load admin KPIs:', err);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{getTranslation('welcome')}</h1>
        <LanguageSelector />
      </div>

      <section className="bg-white rounded-lg shadow p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-700">{getTranslation('reputationScore')}</h2>
        <AdminStatsPanel kpiData={kpiData} />
      </section>

      <section className="bg-white rounded-lg shadow p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-700">{getTranslation('badgesEarned')}</h2>
        <UserManager />
      </section>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <section className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">{getTranslation('aiTips')}</h2>
            <PremiumFeature feature="disputeAnalytics">
              <AdminDisputeAnalytics />
            </PremiumFeature>
          </section>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default AdminDashboard;

