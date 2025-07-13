/**
 * File: AdminDisputeAnalytics.jsx
 * Path: frontend/src/components/admin/disputes/AdminDisputeAnalytics.jsx
 * Purpose: Admin dashboard for dispute resolution analytics and AI recommendations
 * Author: Cod1 + SG
 * Date: 2025-05-01
 */

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import PremiumFeature from '@components/common/PremiumFeature';
import Button from '@components/common/Button';
import logger from '@utils/logger';
import DisputeResolutionHelper from '@utils/DisputeResolutionHelper';
import analyticsExportUtils from '@utils/analyticsExportUtils';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDisputeAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await DisputeResolutionHelper.getResolutionAnalytics();
        const recommendations = await DisputeResolutionHelper.getAIRecommendations();
        setAnalyticsData(analytics);
        setAiRecommendations(recommendations);
      } catch (error) {
        logger.error('Error fetching dispute analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      await DisputeResolutionHelper.exportResolutionAnalytics('pdf');
      alert('Export successful!');
    } catch (error) {
      logger.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading dispute analytics...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Admin Dispute Analytics</h2>

      {/* Free Version: Basic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Disputes</h3>
          <p className="text-2xl text-gray-900">{analyticsData.totalDisputes}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-700">Resolution Rate</h3>
          <p className="text-2xl text-gray-900">{(analyticsData.resolutionRate * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-700">Avg. Resolution Time</h3>
          <p className="text-2xl text-gray-900">
            {(analyticsData.avgResolutionTimeMs / 3600000).toFixed(2)} hrs
          </p>
        </div>
      </div>

      {/* Premium Features */}
      <PremiumFeature feature="disputeAnalytics">
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Resolution Patterns</h3>
          <Bar
            data={{
              labels: ['Open', 'Pending', 'Closed'],
              datasets: [
                {
                  label: 'Disputes',
                  data: [
                    analyticsData.statusCounts.open,
                    analyticsData.statusCounts.pending,
                    analyticsData.statusCounts.closed,
                  ],
                  backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Dispute Status Distribution' },
              },
            }}
          />
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Recommendations</h3>
          <ul className="space-y-2">
            {aiRecommendations.map((rec, index) => (
              <li key={index} className="bg-blue-50 p-4 rounded shadow">
                <p className="text-gray-700">{rec.recommendation}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={handleExport} disabled={exporting} className="bg-indigo-600 text-white hover:bg-indigo-700">
            {exporting ? 'Exporting...' : '📄 Export PDF'}
          </Button>
        </div>
      </PremiumFeature>
    </div>
  );
};

export default AdminDisputeAnalytics;
