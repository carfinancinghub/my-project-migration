// File: AdvancedSmartRecommendations.js
// Path: frontend/src/components/recommendations/AdvancedSmartRecommendations.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const AdvancedSmartRecommendations = ({ buyerId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCriteria, setShowCriteria] = useState(true);
  const [priority, setPriority] = useState('lowestRate');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/loans/recommendations`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { buyerId, priority },
        });
        setRecommendations(res.data);
      } catch (err) {
        console.error('Failed to load advanced recommendations:', err);
        setError('❌ Unable to load recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [buyerId, priority, token]);

  const handleExportCSV = () => {
    const headers = ['Lender', 'Rate', 'Term', 'Monthly Payment', 'Down Payment', 'Match %'];
    const rows = recommendations.map(r => [
      r.lenderName,
      r.rate,
      r.term,
      r.monthlyPayment,
      r.downPayment,
      r.matchScore + '%'
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan_recommendations.csv';
    a.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Advanced Smart Loan Recommendations</h1>

      {loading && <LoadingSpinner />}
      {error && <p className={theme.errorText}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex items-center mb-4 space-x-4">
            <label className="font-medium">Prioritize:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="lowestRate">Lowest Rate</option>
              <option value="lowestPayment">Lowest Monthly Payment</option>
              <option value="noDown">No Down Payment</option>
              <option value="shortTerm">Shortest Term</option>
            </select>
            <Button variant="secondary" onClick={handleExportCSV}>📥 Export CSV</Button>
            <Button onClick={() => setShowCriteria(!showCriteria)}>
              {showCriteria ? '🔽 Hide Scores' : '🔍 Show Scores'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded p-4 shadow bg-white">
                <p><strong>Lender:</strong> {rec.lenderName}</p>
                <p><strong>Rate:</strong> {rec.rate}%</p>
                <p><strong>Term:</strong> {rec.term} months</p>
                <p><strong>Monthly Payment:</strong> ${rec.monthlyPayment}</p>
                <p><strong>Down Payment:</strong> ${rec.downPayment}</p>
                {showCriteria && (
                  <p className="text-green-600 font-semibold mt-2">🎯 Match Score: {rec.matchScore}%</p>
                )}
                {rec.aiReasoning && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600 underline">Why this option?</summary>
                    <p className="mt-1 text-sm text-gray-700">{rec.aiReasoning}</p>
                  </details>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedSmartRecommendations;
