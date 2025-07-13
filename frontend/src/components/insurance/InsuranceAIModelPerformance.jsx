// File: InsuranceAIModelPerformance.jsx
// Path: frontend/src/components/insurance/InsuranceAIModelPerformance.jsx
// @file InsuranceAIModelPerformance.jsx
// @path frontend/src/components/insurance/InsuranceAIModelPerformance.jsx
// @description Displays AI model performance metrics (basic + premium) for insurance officers
// @author Cod2 - May 08, 2025, 16:00 PST

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Card, CardContent } from '@/components/ui/card';
import PremiumFeature from '@components/common/PremiumFeature';
import ToastManager from '@components/common/ToastManager';
import '@/styles/InsuranceAIModelPerformance.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

/**
 * @function InsuranceAIModelPerformance
 * @wow Displays real-time AI model stats and premium-only confusion matrix
 */
const InsuranceAIModelPerformance = ({ modelId }) => {
  const [metrics, setMetrics] = useState(null);
  const [confusionMatrix, setConfusionMatrix] = useState(null);
  const [timeframe, setTimeframe] = useState('last_30_days');
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`/api/insurance/model-performance/${modelId}?timeframe=${timeframe}`);
      const data = await res.json();
      setMetrics(data.metrics);
      setConfusionMatrix(data.confusionMatrix);
    } catch (err) {
      console.error('Error fetching metrics:', err.message);
      ToastManager.error('Failed to load AI metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    intervalRef.current = setInterval(() => {
      if (!document.hidden) fetchMetrics();
    }, 15000);

    return () => clearInterval(intervalRef.current);
  }, [modelId, timeframe]);

  if (loading) return <div data-testid="loading">Loading performance...</div>;

  return (
    <section aria-label="AI Performance Metrics" className="insurance-performance-panel">
      <h2 className="section-title">AI Model Performance</h2>

      <div className="timeframe-filter" aria-label="Select timeframe">
        <label htmlFor="timeframe" className="filter-label">Timeframe:</label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          aria-label="Timeframe filter"
          data-testid="timeframe-select"
        >
          <option value="last_30_days">Last 30 Days</option>
          <option value="last_90_days">Last 90 Days</option>
        </select>
      </div>

      <Card className="basic-metrics-card">
        <CardContent>
          <table className="metrics-table" role="table" aria-label="Basic AI metrics" data-testid="basic-metrics">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Accuracy</td>
                <td>{metrics.accuracy?.toFixed(2)}%</td>
              </tr>
              <tr>
                <td>Precision</td>
                <td>{metrics.precision?.toFixed(2)}%</td>
              </tr>
              <tr>
                <td>Recall</td>
                <td>{metrics.recall?.toFixed(2)}%</td>
              </tr>
              <tr>
                <td>F1 Score</td>
                <td>{metrics.f1Score?.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <PremiumFeature feature="aiModelInsights">
        <Card className="premium-confusion-matrix-card">
          <CardContent>
            <h3 className="premium-title">Confusion Matrix (Premium)</h3>
            {confusionMatrix ? (
              <Chart
                type="bar"
                data={{
                  labels: ['True Positive', 'False Positive', 'True Negative', 'False Negative'],
                  datasets: [
                    {
                      label: 'Count',
                      data: [
                        confusionMatrix.tp,
                        confusionMatrix.fp,
                        confusionMatrix.tn,
                        confusionMatrix.fn,
                      ],
                    },
                  ],
                }}
                options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Confusion Matrix' } } }}
                data-testid="confusion-matrix"
              />
            ) : (
              <div>No confusion matrix data available.</div>
            )}
          </CardContent>
        </Card>
      </PremiumFeature>
    </section>
  );
};

InsuranceAIModelPerformance.propTypes = {
  modelId: PropTypes.string.isRequired,
};

export default InsuranceAIModelPerformance;
