// File: SellerReputationDashboard.jsx
// Path: frontend/src/components/seller/SellerReputationDashboard.jsx
// 👑 Cod1 Crown Certified with Multi-Language Support

import React, { useEffect, useState } from 'react';
import LanguageSelector from '@/components/common/LanguageSelector';
import PremiumFeature from '@/components/common/PremiumFeature';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import SellerBadgeEngine from '@/utils/SellerBadgeEngine';
import logger from '@/utils/logger';

const SellerReputationDashboard = ({ sellerId }) => {
  const { getTranslation } = useLanguage();
  const [reputationScore, setReputationScore] = useState(null);
  const [badges, setBadges] = useState([]);
  const [aiTips, setAiTips] = useState([]);

  useEffect(() => {
    fetchReputationData();
  }, [sellerId]);

  const fetchReputationData = async () => {
    try {
      const data = await SellerBadgeEngine.getSellerReputation(sellerId);
      setReputationScore(data.score);
      setBadges(data.badges);
      setAiTips(data.tips);
    } catch (err) {
      logger.error('Failed to fetch seller reputation:', err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{getTranslation('welcome')}</h2>
        <LanguageSelector />
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold">{getTranslation('reputationScore')}: {reputationScore}</h3>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold">{getTranslation('badgesEarned')}</h3>
        <ul className="list-disc list-inside">
          {badges.map((badge, idx) => (
            <li key={idx}>{badge}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold">{getTranslation('aiTips')}</h3>
        <ul className="list-disc list-inside text-sm">
          {aiTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      <PremiumFeature feature="sellerAnalytics">
        <div className="bg-white shadow rounded-lg p-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {getTranslation('shareProfile')}
          </button>
        </div>
      </PremiumFeature>
    </div>
  );
};

export default SellerReputationDashboard;
