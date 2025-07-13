// File: LenderReputationSummary.js
// Path: frontend/src/components/lender/LenderReputationSummary.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const LenderReputationSummary = ({ lenderId }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/lender-reputation/${lenderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSummary(res.data);
      } catch (err) {
        setError('Failed to load reputation summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [lenderId]);

  const getTrustLabel = (score) => {
    if (score >= 4.5) return '✅ Reliable';
    if (score >= 3.5) return '⚠️ Cautious';
    return '🚩 Watchlist';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;
  if (!summary) return null;

  return (
    <Card className="p-4 bg-blue-50" role="region" aria-label="Lender Reputation Summary">
      <h3 className="text-lg font-bold mb-2">📊 Reputation Summary</h3>

      <p className="text-sm text-gray-600">Trust Score</p>
      <div className="flex items-center space-x-2">
        <div
          className={`h-3 w-3 rounded-full ${
            summary.rating >= 4.5 ? 'bg-green-500' : summary.rating >= 3.5 ? 'bg-yellow-400' : 'bg-red-500'
          }`}
        ></div>
        <span className="text-base font-semibold">{summary.rating.toFixed(2)} / 5</span>
        <span className="ml-2 text-xs">{getTrustLabel(summary.rating)}</span>
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <p>🗣️ {summary.reviews.length} reviews</p>
        <p>⚖️ {summary.disputes.length} disputes on record</p>
        <p>🕓 Last Updated: {new Date(summary.updatedAt).toLocaleDateString()}</p>
      </div>

      <button
        onClick={() => alert('AI Summary not yet implemented')}
        className="mt-4 text-blue-600 underline text-sm"
      >
        🔍 Summarize this profile
      </button>
    </Card>
  );
};

export default LenderReputationSummary;
