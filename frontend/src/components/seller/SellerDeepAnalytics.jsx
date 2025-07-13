// File: SellerDeepAnalytics.jsx
// Path: frontend/src/components/seller/SellerDeepAnalytics.jsx
// Author: Cod1 05050043

// Purpose: Display seller’s historical performance trends and analytics
// Functions:
// - fetchSellerAnalytics(): Retrieves sales + feedback records
// - renderCharts(): Displays time-series visuals (revenue, ratings)
// - exportAnalytics(): Optionally exports reports (Premium)

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import PremiumFeature from '@/components/common/PremiumFeature';
import logger from '@/utils/logger';

const SellerDeepAnalytics = ({ sellerId }) => {
  const { getTranslation } = useLanguage();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerAnalytics();
  }, [sellerId]);

  const fetchSellerAnalytics = async () => {
    try {
      const res = await fetch(`/api/sellers/${sellerId}/analytics`);
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      logger.error('Failed to load seller analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{getTranslation('sellerAnalytics')}</h2>
      {loading ? (
        <p>{getTranslation('loading')}...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="saleDate" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="revenue" stroke="#0070f3" name={getTranslation('revenue')} />
            <Line type="monotone" dataKey="feedbackScore" stroke="#00b894" name={getTranslation('feedbackScore')} />
          </LineChart>
        </ResponsiveContainer>
      )}

      <PremiumFeature feature="sellerAnalytics">
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          {getTranslation('exportAnalytics')}
        </button>
      </PremiumFeature>
    </div>
  );
};

export default SellerDeepAnalytics;
