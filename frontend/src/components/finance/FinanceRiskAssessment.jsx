// File: FinanceRiskAssessment.jsx
// Path: frontend/src/components/finance/FinanceRiskAssessment.jsx
// Purpose: UI for finance officers to assess auction risks with optional AI analytics
// Author: Cod1 (05111410 - PDT)
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { fetchRiskScores } from '@services/ai/RiskAnalyzer';

/**
 * Functions Summary:
 * - fetchRiskScores(): Fetches AI-generated risk scores (paid section)
 * Inputs: auctions (array)
 * Outputs: JSX display of risk scores and analytics
 * Dependencies: logger, @services/ai/RiskAnalyzer
 */
const FinanceRiskAssessment = ({ auctions }) => {
  const [riskData, setRiskData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const scores = await fetchRiskScores(auctions.map(a => a.id));
        setRiskData(scores);
      } catch (err) {
        logger.error('Failed to fetch AI risk analytics:', err);
        setError('Unable to load risk analytics');
      }
    }
    loadAnalytics();
  }, [auctions]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Finance Risk Assessment</h2>
      {error && <div className="text-red-600">{error}</div>}
      <ul className="space-y-2">
        {auctions.map((a) => (
          <li key={a.id}>
            <div>ID: {a.id}</div>
            <div>Risk Score: {riskData[a.id] || a.riskScore || 'N/A'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

FinanceRiskAssessment.propTypes = {
  auctions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      riskScore: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
};

export default FinanceRiskAssessment;