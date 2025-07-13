// File: MarketplaceInsightsDashboardGrokOld(2).jsx
// Path: frontend/src/components/marketplace/MarketplaceInsightsDashboard.jsx
// 👑 Cod1 Crown Certified with Multi-Language Support
// Purpose: Marketplace dashboard with analytics, insights, AI summaries, and internationalized UI
// Functions:
// - fetchInsights(): Load analytics from backend or mock API
// - handleExportPdf/exportCsv(): Trigger insight data export
// - handlePreviewPdf(): Generate data URI for PDF preview
// - WebSocket handling: Display real-time insight alerts
// - LanguageSelector: Enterprise UI toggle for localized dashboard

// ⬇️ Multi-language additions
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import LanguageSelector from '@/components/common/LanguageSelector';

...

const MarketplaceInsightsDashboard = () => {
  const { getTranslation } = useLanguage();
  ...

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{getTranslation('marketplaceInsightsDashboard')}</h1>
          <LanguageSelector />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActivityOverview userId={userId} />

          <PremiumFeature feature="marketplaceInsights">
            <BestFinancingDealCard userId={userId} />
          </PremiumFeature>

          <PremiumFeature feature="marketplaceInsights">
            <HaulerSummaryCard region="west" />
          </PremiumFeature>

          <BadgeDisplayPanel userId={userId} />
        </div>

        ... (Charts, Export Buttons, WebSocket alert, PDF Preview)

      </div>
    </div>
  );
};
