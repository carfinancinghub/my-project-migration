// File: HaulerSummaryCard.jsx
// Path: frontend/src/components/marketplace/HaulerSummaryCard.jsx
// 👑 Cod1 Crown Certified with Multi-Language Support
// Purpose: Display summary of hauler activity and performance for marketplace insights
// Functions:
// - fetchHaulerSummary(): Retrieves hauler stats for the dashboard
// - renderSummaryCard(): Shows hauler metrics in localized format
// - LanguageSelector: Allows language switching for enterprise users

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import LanguageSelector from '@/components/common/LanguageSelector';
import PremiumFeature from '@/components/common/PremiumFeature';
import logger from '@/utils/logger';

const HaulerSummaryCard = ({ region }) => {
  const { getTranslation } = useLanguage();
  const [haulerStats, setHaulerStats] = useState(null);

  useEffect(() => {
    fetchHaulerSummary();
  }, [region]);

  const fetchHaulerSummary = async () => {
    try {
      const res = await fetch(`/api/haulers/summary?region=${region}`);
      const data = await res.json();
      setHaulerStats(data);
    } catch (err) {
      logger.error('Failed to fetch hauler summary:', err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{getTranslation('haulerSummary')}</h3>
        <LanguageSelector />
      </div>

      {haulerStats ? (
        <div className="mt-2 text-sm text-gray-700 space-y-1">
          <p>{getTranslation('totalHaulers')}: {haulerStats.total}</p>
          <p>{getTranslation('activeThisWeek')}: {haulerStats.activeThisWeek}</p>
          <p>{getTranslation('regionCovered')}: {haulerStats.region}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-400">{getTranslation('loadingHaulerStats')}</p>
      )}

      <PremiumFeature feature="haulerExport">
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          {getTranslation('downloadPDF')}
        </button>
      </PremiumFeature>
    </div>
  );
};

export default HaulerSummaryCard;
