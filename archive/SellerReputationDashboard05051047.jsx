// File: SellerReputationDashboard.jsx
// Path: frontend/src/components/seller/SellerReputationDashboard.jsx
// Author: Cod1 (05051047)
// Purpose: Central dashboard for seller performance, coaching, and insights
// Functions:
// - Render reputation score, XP, badges
// - Integrate analytics, negotiation coach, and export panel

import React, { useState, useEffect } from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import LanguageSelector from '@components/common/LanguageSelector';
import SellerDeepAnalytics from '@components/seller/SellerDeepAnalytics';
import SellerExportPanel from '@components/seller/SellerExportPanel';
import AISellerNegotiationCoach from '@utils/AISellerNegotiationCoach';
import { useLanguage } from '@components/common/MultiLanguageSupport';

const SellerReputationDashboard = ({ sellerId, listings }) => {
  const { getTranslation } = useLanguage();
  const [negotiationTips, setNegotiationTips] = useState([]);

  useEffect(() => {
    if (listings && listings.length > 0) {
      const tips = AISellerNegotiationCoach.getNegotiationTips(listings[0].id, listings);
      setNegotiationTips(tips);
    }
  }, [listings]);

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{getTranslation('sellerReputation')}</h1>
        <PremiumFeature feature="multiLanguage">
          <LanguageSelector />
        </PremiumFeature>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">{getTranslation('reputationMetrics')}</h2>
        <p>{getTranslation('reputationScore')}: 87</p>
        <p>{getTranslation('experiencePoints')}: 1540 XP</p>
        <p>{getTranslation('badges')}: Gold Seller, Top Communicator</p>
      </div>

      {/* Analytics Section */}
      <SellerDeepAnalytics sellerId={sellerId} />

      {/* Negotiation Coach Section */}
      <PremiumFeature feature="sellerNegotiationEnterprise">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{getTranslation('negotiationTips')}</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {negotiationTips.map((tip, idx) => (
              <li key={idx}>{tip.tip}</li>
            ))}
          </ul>
        </div>
      </PremiumFeature>

      {/* Export Panel Section */}
      <PremiumFeature feature="sellerExportEnterprise">
        <SellerExportPanel sellerId={sellerId} />
      </PremiumFeature>
    </div>
  );
};

export default SellerReputationDashboard;
