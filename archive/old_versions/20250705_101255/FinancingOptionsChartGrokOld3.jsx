/**
 *     File: FinancingOptionsChart.jsx
 *     Path: frontend/src/components/buyer/FinancingOptionsChart.jsx
 * 👑 Cod1 Crown Certified — Financing Options Chart with AI Insights
 *
 * 🔍 Function Index:
 * - fetchFinancingOptions(): Retrieves financing options from the API
 * - fetchAIRecommendations(): Fetches AI-generated financing recommendations (premium)
 * - handleExport(): Exports financing data and recommendations to PDF (premium)
 * - renderComparisonCharts(): Renders financing comparison charts using Chart.js
 * - renderAIRecommendations(): Displays AI-generated financing recommendations
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import PremiumFeature from '@components/common/PremiumFeature';
import Button from '@components/common/Button';
import logger from '@utils/logger';
import analyticsExportUtils from '@utils/analyticsExportUtils';

ChartJS.register(BarElement, ArcElement, Tooltip, Legend);

const FinancingOptionsChart = ({ buyerId }) => {
  const [financingOptions, setFinancingOptions] = useState([]);
  const [aiRecommendations, setAIRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancingOptions();
    fetchAIRecommendations();
  }, [buyerId]);

  const fetchFinancingOptions = async () => {
    try {
      const { data } = await axios.get(`/api/buyer/${buyerId}/financing-options`);
      setFinancingOptions(data);
    } catch (error) {
      logger.error('Error fetching financing options:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendations = async () => {
    try {
      const { data } = await axios.get(`/api/buyer/${buyerId}/financing-recommendations`);
      setAIRecommendations(data);
    } catch (error) {
      logger.warn('AI recommendations unavailable:', error);
    }
  };

  const handleExport = () => {
    try {
      analyticsExportUtils.exportPDF({
        title: 'Financing Options and AI Recommendations',
        content: JSON.stringify({ financingOptions, aiRecommendations }, null, 2)
      });
    } catch (error) {
      logger.error('Export failed:', error);
    }
  };

  const renderComparisonCharts = () => {
    if (!financingOptions.length) return null;

    const lenders = financingOptions.map(option => option.lender);
    const rates = financingOptions.map(option => option.rate);
    const terms = financingOptions.map(option => option.term);

    const rateData = {
      labels: lenders,
      datasets: [
        {
          label: 'Interest Rates (%)',
          data: rates,
          backgroundColor: '#60a5fa'
        }
      ]
    };

    const termData = {
      labels: lenders,
      datasets: [
        {
          label: 'Loan Terms (Months)',
          data: terms,
          backgroundColor: '#10b981'
        }
      ]
    };

    return (
      <div className="mt-6 space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Interest Rate Comparison</h4>
          <Bar data={rateData} />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Loan Term Distribution</h4>
          <Pie data={termData} />
        </div>
      </div>
    );
  };

  const renderAIRecommendations = () => {
    if (!aiRecommendations) return null;

    return (
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800">AI Financing Recommendations</h4>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {aiRecommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) return <div className="text-center p-6">Loading financing options...</div>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Financing Options</h2>

      {/* Basic Financing Options Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Lender</th>
              <th className="px-4 py-2">Interest Rate (%)</th>
              <th className="px-4 py-2">Loan Term (Months)</th>
            </tr>
          </thead>
          <tbody>
            {financingOptions.map((option, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{option.lender}</td>
                <td className="px-4 py-2">{option.rate}</td>
                <td className="px-4 py-2">{option.term}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Premium Features */}
      <PremiumFeature feature="financingAnalytics">
        {renderComparisonCharts()}
        {renderAIRecommendations()}
        <Button className="mt-6 bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleExport}>
          Export Financing Report (PDF)
        </Button>
      </PremiumFeature>
    </div>
  );
};

FinancingOptionsChart.propTypes = {
  buyerId: PropTypes.string.isRequired
};

export default FinancingOptionsChart;
