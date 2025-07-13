// File: MobileAnalytics.jsx
// Path: C:\CFH\frontend\src\components\mobile\MobileAnalytics.jsx
// Purpose: Display mobile-optimized analytics dashboard
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/analytics

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getUserInsights } from '@services/api/analytics';

const MobileAnalytics = ({ userId }) => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Last 30 days
        const endDate = new Date().toISOString().split('T')[0];
        const data = await getUserInsights(userId, startDate, endDate);
        setInsights(data.insights);
        logger.info(`[MobileAnalytics] Fetched analytics for userId: ${userId}`);
      } catch (err) {
        logger.error(`[MobileAnalytics] Failed to fetch analytics for userId ${userId}: ${err.message}`, err);
        setError('Failed to load analytics. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();
  }, [userId]);

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading analytics...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Analytics</h2>
      <div className="space-y-3">
        {insights && insights.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {insights.map((insight, index) => (
              <li key={index} className="text-gray-600 text-sm">{insight}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No analytics insights available.</p>
        )}
      </div>
    </div>
  );
};

MobileAnalytics.propTypes = {
  userId: PropTypes.string.isRequired
};

export default MobileAnalytics;