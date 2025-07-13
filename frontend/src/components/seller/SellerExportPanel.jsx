// File: SellerExportPanel.jsx
// Path: frontend/src/components/seller/SellerExportPanel.jsx
// Author: Cod1 05050043
// Purpose: Export sales data, badges, and contracts
// Functions:
// - handleExport(): prepares export file by type/format/date
// - UI includes type dropdown, date range, export buttons

import React, { useState } from 'react';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import PremiumFeature from '@/components/common/PremiumFeature';
import { exportSellerData } from '@/utils/analyticsExportUtils';

const SellerExportPanel = ({ sellerId }) => {
  const { getTranslation } = useLanguage();
  const [exportType, setExportType] = useState('Badges');
  const [format, setFormat] = useState('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = () => {
    const config = {
      type: exportType,
      format,
      sellerId,
      startDate,
      endDate,
    };
    exportSellerData(config);
  };

  return (
    <div className="bg-white shadow rounded p-6">
      <h3 className="text-xl font-semibold mb-4">{getTranslation('exportSellerData')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">{getTranslation('exportType')}</label>
          <select value={exportType} onChange={e => setExportType(e.target.value)} className="w-full border rounded p-2">
            <option value="Badges">{getTranslation('badges')}</option>
            <option value="Sales">{getTranslation('sales')}</option>
            <option value="Contracts">{getTranslation('contracts')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">{getTranslation('format')}</label>
          <select value={format} onChange={e => setFormat(e.target.value)} className="w-full border rounded p-2">
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">{getTranslation('startDate')}</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">{getTranslation('endDate')}</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border rounded p-2" />
        </div>
      </div>

      <div className="mt-6">
        <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {getTranslation('download')}
        </button>
      </div>

      <PremiumFeature feature="sellerAnalytics">
        <div className="mt-4 text-sm text-gray-500 italic">{getTranslation('scheduledExportsComingSoon')}</div>
      </PremiumFeature>
    </div>
  );
};

export default SellerExportPanel;
