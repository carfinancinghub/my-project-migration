// File: BestFinancingDealCard.jsx
// Path: frontend/src/components/marketplace/BestFinancingDealCard.jsx
// 👑 Cod1 Crown Certified with Multi-Language Support
// Purpose: Display top financing match for user profile with AI insight
// Functions:
// - fetchBestDeal(): Pulls best lender offer for display
// - renderDealCard(): Displays key lender details
// - LanguageSelector: Optional for enterprise-tier localized insights

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import LanguageSelector from '@/components/common/LanguageSelector';
import PremiumFeature from '@/components/common/PremiumFeature';
import logger from '@/utils/logger';

const BestFinancingDealCard = ({ userId }) => {
  const { getTranslation } = useLanguage();
  const [bestDeal, setBestDeal] = useState(null);

  useEffect(() => {
    fetchBestDeal();
  }, [userId]);

  const fetchBestDeal = async () => {
    try {
      const res = await fetch(`/api/lenders/best-deal/${userId}`);
      const data = await res.json();
      setBestDeal(data);
    } catch (err) {
      logger.error('Failed to load best deal:', err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{getTranslation('bestFinancingOption')}</h3>
        <LanguageSelector />
      </div>

      {bestDeal ? (
        <div className="mt-2 text-sm text-gray-700 space-y-1">
          <p>{getTranslation('lender')}: {bestDeal.lenderName}</p>
          <p>{getTranslation('rate')}: {bestDeal.interestRate}%</p>
          <p>{getTranslation('term')}: {bestDeal.termMonths} {getTranslation('months')}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-400">{getTranslation('loadingDeal')}</p>
      )}

      <PremiumFeature feature="financingAnalytics">
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {getTranslation('downloadPDF')}
        </button>
      </PremiumFeature>
    </div>
  );
};

export default BestFinancingDealCard;
