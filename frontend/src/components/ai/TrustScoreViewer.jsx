```
// 👑 Crown Certified Component — TrustScoreViewer.jsx
// Path: frontend/src/components/ai/TrustScoreViewer.jsx
// Purpose: Displays a user's trust score and premium breakdown, with trend insights.
// Author: Rivers Auction Team — May 17, 2025

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '@services/api';
import logger from '@utils/logger';
import { PremiumGate } from '@components/common';
import { Star } from 'lucide-react';

const TrustScoreViewer = ({ userId, isPremium }) => {
  const [scoreData, setScoreData] = useState(null);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrustScore();
  }, [userId]);

  const fetchTrustScore = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/trust/score', {
        params: { userId, isPremium },
      });
      setScoreData(response.data.data);
      setError(null);
    } catch (err) {
      logger.error(`Failed to fetch trust score for user ${userId}`, err);
      setError(err.response?.data?.message || 'Unable to load trust score');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrustTrend = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/trust/trend', {
        params: { userId },
      });
      setTrend(response.data.data);
      setError(null);
    } catch (err) {
      logger.error(`Failed to fetch trust trend for user ${userId}`, err);
      setError(err.response?.data?.message || 'Unable to load trust trend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trust-score-viewer">
      <h3>Trust Score</h3>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      {scoreData && (
        <div className="score">
          <Star className="score-icon" />
          <p><strong>Trust Score:</strong> {scoreData.score}/100</p>
        </div>
      )}
      <PremiumGate isPremium={isPremium} message="Detailed trust breakdown requires premium access">
        <div className="breakdown">
          <button
            onClick={fetchTrustTrend}
            disabled={loading}
            className="trend-button"
          >
            Load Trust Trend
          </button>
          {scoreData?.breakdown && (
            <div>
              <p><strong>Escrow Compliance:</strong> {scoreData.breakdown.escrowCompliance}</p>
              <p><strong>Bid Consistency:</strong> {scoreData.breakdown.bidConsistency}</p>
              <p><strong>Auction Activity:</strong> {scoreData.breakdown.auctionActivity}</p>
              <p><strong>Trust Trend:</strong> {scoreData.breakdown.trustTrend}</p>
            </div>
          )}
          {trend && (
            <p><strong>Trend:</strong> {trend.trend} (Confidence: {(trend.confidence * 100).toFixed(1)}%)</p>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

TrustScoreViewer.propTypes = {
  userId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default TrustScoreViewer;

/*
Functions Summary:
- TrustScoreViewer
  - Purpose: User-facing component to display trust score and premium breakdown
  - Inputs:
    - userId: string (required)
    - isPremium: boolean (required)
  - Outputs: React component rendering trust score and breakdown panel
  - Features:
    - Displays trust score via calculateTrustScore
    - Premium-gated breakdown and trend via calculateTrustScore and predictTrustTrend
    - Error handling for API failures
  - Dependencies: react, prop-types, @services/api, @utils/logger, @components/common/PremiumGate, lucide-react
*/
```