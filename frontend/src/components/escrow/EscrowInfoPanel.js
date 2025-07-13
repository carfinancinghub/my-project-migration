// File: EscrowInfoPanel.js
// Path: frontend/src/components/escrow/EscrowInfoPanel.js
// 👑 Cod1 Crown Certified with Multi-Language Support

import React from 'react';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import LanguageSelector from '@/components/common/LanguageSelector';
import PremiumFeature from '@/components/common/PremiumFeature';

const EscrowInfoPanel = ({ escrowData }) => {
  const { getTranslation } = useLanguage();

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{getTranslation('escrowDetails')}</h2>
        <LanguageSelector />
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-sm text-gray-600">{getTranslation('status')}: {escrowData.status}</p>
        <p className="text-sm text-gray-600">{getTranslation('deadline')}: {escrowData.deadline}</p>
        <p className="text-sm text-gray-600">{getTranslation('amount')}: ${escrowData.amount}</p>
      </div>

      <PremiumFeature feature="escrowAIInsights">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold">{getTranslation('aiRiskInsights')}</h3>
          <p className="text-sm text-gray-700">{escrowData.aiRiskSummary}</p>
        </div>
      </PremiumFeature>

      <PremiumFeature feature="escrowExport">
        <div className="bg-white shadow rounded-lg p-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {getTranslation('downloadPDF')}
          </button>
        </div>
      </PremiumFeature>
    </div>
  );
};

export default EscrowInfoPanel;
