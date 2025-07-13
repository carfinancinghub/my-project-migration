// File: AIScorePanel.js
// Path: frontend/src/components/ai/AIScorePanel.js
// Purpose: Display AI-generated trust scores for users or auctions with premium transparency
// Author: Rivers Auction Team
// Editor: Cod1 (05152352 - PDT)
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { fetchAIScoreBreakdown } from '@services/ai/ScoreService';

/**
 * Functions Summary:
 * - fetchAIScoreBreakdown(targetId): Retrieves AI score summary and transparency data (premium)
 * Inputs:
 * - targetId (string): ID of the user or auction
 * - isPremium (boolean): Enables detailed score breakdown
 * Outputs:
 * - JSX showing trust score with optional detail table
 * Dependencies: React, @services/ai/ScoreService, logger
 */
const AIScorePanel = ({ targetId, isPremium }) => {
  const [scoreData, setScoreData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadScore() {
      try {
        const result = await fetchAIScoreBreakdown(targetId, isPremium);
        setScoreData(result);
      } catch (err) {
        logger.error('Failed to load AI score breakdown:', err);
        setError('Unable to fetch trust score.');
      }
    }

    if (targetId) loadScore();
  }, [targetId, isPremium]);

  if (!targetId) return <div>Invalid target ID</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!scoreData) return <div>Loading AI trust score...</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">AI Trust Score</h2>
      <div className="text-3xl font-bold text-blue-600">{scoreData.overallScore}</div>
      {isPremium && scoreData.details && (
        <ul className="mt-4 space-y-1 text-sm text-gray-700">
          {scoreData.details.map((d, idx) => (
            <li key={idx}>• {d.label}: {d.value}</li>
          ))}
        </ul>
      )}
      {!isPremium && <p className="mt-2 text-gray-500">Upgrade to see breakdown.</p>}
    </div>
  );
};

AIScorePanel.propTypes = {
  targetId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default AIScorePanel;