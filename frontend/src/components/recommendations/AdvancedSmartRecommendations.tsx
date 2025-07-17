/**
 * © 2025 CFH, All Rights Reserved
 * File: AdvancedSmartRecommendations.tsx
 * Path: frontend/src/components/recommendations/AdvancedSmartRecommendations.tsx
 * Purpose: Provides advanced AI-driven loan recommendations with prioritization, match scores, and export functionality.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-17 [1114]
 * Version: 1.0.1
 * Version ID: z9x8c7v6-b5n4-m3l2-k1j0-h9g8f7e6d5c4
 * Crown Certified: Yes
 * Batch ID: Compliance-071725
 * Artifact ID: z9x8c7v6-b5n4-m3l2-k1j0-h9g8f7e6d5c4
 * Save Location: frontend/src/components/recommendations/AdvancedSmartRecommendations.tsx
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Strongly typed interfaces and props
 * - Error handling, authentication via token
 * - Code split: Free features (recommendations), Premium (export), Wow++ (AI explanation)
 * - Suggest moving fetch/export logic to @services/recommendations
 * - Validation schema suggested in @validation/recommendations.validation.ts
 * - Suggest tests in __tests__/recommendations/AdvancedSmartRecommendations.test.tsx
 */
import React, { useEffect, useState, FC, ChangeEvent } from 'react';
import axios from 'axios';
import Button from '@common/Button';
import LoadingSpinner from '@common/LoadingSpinner';
import { theme } from '@styles/theme';

export interface Recommendation {
  lenderName: string;
  rate: number;
  term: number;
  monthlyPayment: number;
  downPayment: number;
  matchScore: number;
  aiReasoning?: string;
}

export interface AdvancedSmartRecommendationsProps {
  buyerId: string;
}

const AdvancedSmartRecommendations: FC<AdvancedSmartRecommendationsProps> = ({ buyerId }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCriteria, setShowCriteria] = useState<boolean>(true);
  const [priority, setPriority] = useState<'lowestRate' | 'lowestPayment' | 'noDown' | 'shortTerm'>('lowestRate');

  const token = localStorage.getItem('token');

  // Free Feature: Fetch AI recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get<Recommendation[]>(
          `${process.env.REACT_APP_API_URL}/api/loans/recommendations`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { buyerId, priority },
          }
        );
        setRecommendations(res.data);
      } catch (err) {
        console.error('Failed to load advanced recommendations:', err);
        setError('❌ Unable to load recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyerId, priority, token]);

  // Premium Feature: Export CSV
  const handleExportCSV = () => {
    const headers = ['Lender', 'Rate', 'Term', 'Monthly Payment', 'Down Payment', 'Match %'];
    const rows = recommendations.map((r) => [
      r.lenderName,
      r.rate,
      r.term,
      r.monthlyPayment,
      r.downPayment,
      r.matchScore + '%',
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as typeof priority)}
              className="border px-2 py-1 rounded"
            >
              <option value="lowestRate">Lowest Rate</option>
              <option value="lowestPayment">Lowest Monthly Payment</option>
              <option value="noDown">No Down Payment</option>
              <option value="shortTerm">Shortest Term</option>
            </select>
            <button className="secondary" onClick={handleExportCSV}>
              📥 Export CSV
            </button>
            <button onClick={() => setShowCriteria(!showCriteria)}>
              {showCriteria ? '🔽 Hide Scores' : '🔍 Show Scores'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded p-4 shadow bg-white">
                <p>
                  <strong>Lender:</strong> {rec.lenderName}
                </p>
                <p>
                  <strong>Rate:</strong> {rec.rate}%
                </p>
                <p>
                  <strong>Term:</strong> {rec.term} months
                </p>
                <p>
                  <strong>Monthly Payment:</strong> ${rec.monthlyPayment}
                </p>
                <p>
                  <strong>Down Payment:</strong> ${rec.downPayment}
                </p>
                {showCriteria && (
                  <p className="text-green-600 font-semibold mt-2">
                    🎯 Match Score: {rec.matchScore}%
                  </p>
                )}
                {/* Wow ++ Feature: Show AI Reasoning */}
                {rec.aiReasoning && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600 underline">
                      Why this option?
                    </summary>
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
