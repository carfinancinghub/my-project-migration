// File: LenderExportPanel.jsx
// Path: frontend/src/components/lender/LenderExportPanel.jsx
// 👑 Cod1 Crown Certified — Lender Export Panel with AI-Powered Negotiation Simulator

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import PremiumFeature from '@components/common/PremiumFeature';
import Button from '@components/common/Button';
import logger from '@utils/logger';
import { exportLenderTerms } from '@controllers/lender/LenderTermsExporter';

const LenderExportPanel = ({ lenderId, userProfile }) => {
  const [termsData, setTermsData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [negotiationResult, setNegotiationResult] = useState(null);

  useEffect(() => {
    // Fetch lender terms data
    const fetchTermsData = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`/api/lender/${lenderId}/terms`);
        const data = await response.json();
        setTermsData(data.offers);
        // Process analytics data for Chart.js
        const labels = data.offers.map((offer) => offer.term);
        const rates = data.offers.map((offer) => offer.interestRate);
        setAnalyticsData({
          labels,
          datasets: [
            {
              label: 'Interest Rates',
              data: rates,
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
            },
          ],
        });
      } catch (err) {
        logger.error('Failed to fetch lender terms:', err);
      }
    };

    fetchTermsData();
  }, [lenderId]);

  const handleExport = async (format) => {
    try {
      const response = await exportLenderTerms(lenderId, format, userProfile);
      // Handle file download or display success message
      console.log('Export successful:', response);
    } catch (err) {
      logger.error('Export failed:', err);
    }
  };

  const handleNegotiationSimulation = () => {
    // Simulate negotiation logic
    const simulatedSavings = 200; // Replace with actual calculation
    const simulatedRateReduction = 0.3; // Replace with actual calculation
    setNegotiationResult({
      savings: simulatedSavings,
      rateReduction: simulatedRateReduction,
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Lender Terms Export Panel</h2>

      {/* Basic Terms List (Free) */}
      <div className="space-y-2 text-sm text-gray-700">
        {termsData.map((offer, idx) => (
          <div key={idx} className="border p-3 rounded bg-gray-50">
            <p><strong>Term:</strong> {offer.term} months</p>
            <p><strong>Interest Rate:</strong> {offer.interestRate}%</p>
            <p><strong>Type:</strong> {offer.type}</p>
          </div>
        ))}
      </div>

      {/* Premium Features */}
      <PremiumFeature feature="lenderExportAnalytics">
        {/* Chart.js Visualization */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">📊 Interest Rate Trends</h3>
          <Bar
            data={analyticsData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Interest Rates by Term' },
              },
              animation: { duration: 800 },
            }}
          />
        </div>

        {/* PDF Export Button */}
        <div className="text-right mt-6">
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleExport('pdf')}>
            📄 Export to PDF
          </Button>
        </div>

        {/* AI-Driven Negotiation Simulator */}
        <div className="mt-6 bg-green-50 border border-green-300 p-4 rounded">
          <h3 className="text-md font-semibold text-green-700 mb-2">🤖 AI-Driven Negotiation Simulator</h3>
          <p className="text-sm text-gray-700 mb-2">
            Simulate a negotiation to see potential savings from rate reductions.
          </p>
          <Button className="bg-green-600 text-white hover:bg-green-700" onClick={handleNegotiationSimulation}>
            🎯 Simulate Negotiation
          </Button>
          {negotiationResult && (
            <div className="mt-4 text-sm text-gray-700">
              <p><strong>Simulated Rate Reduction:</strong> {negotiationResult.rateReduction}%</p>
              <p><strong>Estimated Savings:</strong> ${negotiationResult.savings}</p>
            </div>
          )}
        </div>
      </PremiumFeature>
    </div>
  );
};

LenderExportPanel.propTypes = {
  lenderId: PropTypes.string.isRequired,
  userProfile: PropTypes.object.isRequired,
};

export default LenderExportPanel;
