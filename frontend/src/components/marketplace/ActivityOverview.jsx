// File: ActivityOverview.jsx
// Path: frontend/src/components/marketplace/ActivityOverview.jsx
// 👑 Cod1 Crown Certified with Multi-Language Support
// Purpose: Display recent user activity summary across marketplace roles
// Functions:
// - fetchActivitySummary(): Loads metrics and event history
// - renderActivityTimeline(): Displays summary in user language
// - LanguageSelector: Enables enterprise-level multi-language switching

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import PremiumFeature from '@/components/common/PremiumFeature';
import LanguageSelector from '@/components/common/LanguageSelector';
import logger from '@/utils/logger';

const ActivityOverview = ({ userId }) => {
  const { getTranslation } = useLanguage();
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    fetchActivitySummary();
  }, [userId]);

  const fetchActivitySummary = async () => {
    try {
      const res = await fetch(`/api/activity/summary/${userId}`);
      const data = await res.json();
      setActivityData(data);
    } catch (err) {
      logger.error('Failed to fetch activity data:', err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{getTranslation('activityOverview')}</h3>
        <LanguageSelector />
      </div>

      {activityData ? (
        <div className="mt-2 text-sm text-gray-700 space-y-1">
          <p>{getTranslation('recentLogins')}: {activityData.logins}</p>
          <p>{getTranslation('disputesOpened')}: {activityData.disputes}</p>
          <p>{getTranslation('contractsViewed')}: {activityData.contracts}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-400">{getTranslation('loadingActivity')}</p>
      )}

      <PremiumFeature feature="marketplaceInsights">
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          {getTranslation('downloadPDF')}
        </button>
      </PremiumFeature>
    </div>
  );
};

export default ActivityOverview;
