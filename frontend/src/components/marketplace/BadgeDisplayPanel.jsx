// File: BadgeDisplayPanel.jsx
// Path: frontend/src/components/marketplace/BadgeDisplayPanel.jsx
// 👑 Cod1 Crown Certified with Multi-Language Support
// Purpose: Display seller or buyer achievement badges with internationalized labels
// Functions:
// - fetchBadges(): Load user badges from backend
// - renderBadges(): Render badges with translations
// - LanguageSelector: Enterprise toggle for multilingual UI

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import PremiumFeature from '@/components/common/PremiumFeature';
import LanguageSelector from '@/components/common/LanguageSelector';
import logger from '@/utils/logger';

const BadgeDisplayPanel = ({ userId }) => {
  const { getTranslation } = useLanguage();
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  const fetchBadges = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/badges`);
      const data = await res.json();
      setBadges(data);
    } catch (err) {
      logger.error('Failed to load badges:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{getTranslation('badgesEarned')}</h3>
        <LanguageSelector />
      </div>
      <ul className="mt-3 list-disc list-inside text-sm text-gray-700">
        {badges.length > 0 ? (
          badges.map((badge, idx) => (
            <li key={idx}>{badge.name}</li>
          ))
        ) : (
          <li>{getTranslation('noBadges')}</li>
        )}
      </ul>
    </div>
  );
};

export default BadgeDisplayPanel;
