// 👑 Crown Certified Component — SmartInsightsWidget.jsx
// Path: frontend/src/components/ai/SmartInsightsWidget.jsx
// Purpose: Display AI-driven platform metrics and personalized recommendations using predictive models.
// Author: Rivers Auction Team — May 16, 2025

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InsightDisplay from '@/components/common/InsightDisplay';
import PredictiveGraph from '@/components/common/PredictiveGraph';
import InsightsService from '@/services/ai/InsightsService';
import logger from '@/utils/logger';

const SmartInsightsWidget = ({ isPremium }) => {
  const [metrics, setMetrics] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [isPremium]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await InsightsService.getPlatformInsights({ includePredictions: isPremium });
      setMetrics(response?.metrics || {});
      if (isPremium) {
        setPredictions(response?.predictions || {});
        setRecommendations(response?.recommendations || []);
      }
    } catch (err) {
      logger.error('Failed to fetch platform insights', err);
      setError('❌ Unable to load insights at this time');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 italic">Loading insights...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-4 space-y-6">
      <h3 className="text-xl font-semibold">📊 Platform Insights</h3>
      <InsightDisplay data={metrics} />

      {isPremium && predictions && (
        <>
          <h4 className="text-lg font-semibold text-blue-800">📈 Predictive Trends</h4>
          <PredictiveGraph data={predictions} />
        </>
      )}

      {isPremium && recommendations?.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-blue-800">🎯 AI Recommendations</h4>
          <ul className="list-disc list-inside text-blue-700 text-sm mt-1 space-y-1">
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

SmartInsightsWidget.propTypes = {
  isPremium: PropTypes.bool.isRequired,
};

export default SmartInsightsWidget;
