// File: LanguageSelector.jsx
// Path: frontend/src/components/common/LanguageSelector.jsx
// 👑 Cod1 Crown Certified

import React from 'react';
import { useLanguage } from './MultiLanguageSupport';
import PremiumFeature from '@/components/common/PremiumFeature';

const LanguageSelector = () => {
  const { setUserLanguage, language } = useLanguage();

  return (
    <PremiumFeature feature="multiLanguage">
      <div className="transition-opacity duration-500 mt-2">
        <label className="text-sm mr-2">🌐 Language:</label>
        <select
          value={language}
          onChange={(e) => setUserLanguage(e.target.value)}
          className="border p-1 rounded text-sm"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </PremiumFeature>
  );
};

export default LanguageSelector;
