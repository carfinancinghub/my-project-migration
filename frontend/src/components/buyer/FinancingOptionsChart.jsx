import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Button from '@components/common/Button';
import PremiumFeature from '@components/common/PremiumFeature';
import logger from '@utils/logger';
import LoanCalculatorWidget from '@utils/LoanCalculatorWidget';
import AILoanRecommender from '@utils/AILoanRecommender';
import analyticsExportUtils from '@utils/analyticsExportUtils';

const FinancingOptionsChart = ({ loanOffers, buyerProfile }) => {
  const [loanAnalytics, setLoanAnalytics] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    try {
      const basicAnalysis = loanOffers.map(offer =>
        LoanCalculatorWidget.calculateLoanSummary(offer.amount, offer.rate, offer.term)
      );
      setLoanAnalytics(basicAnalysis);

      const aiRecs = AILoanRecommender.recommendLoanStrategies(loanOffers, buyerProfile);
      setRecommendations(aiRecs);
    } catch (err) {
      logger.error('Error generating loan analytics:', err);
    }
  }, [loanOffers, buyerProfile]);

  const exportPDF = () => {
    try {
      analyticsExportUtils.exportLoanAnalyticsToPDF({ loanAnalytics, recommendations });
    } catch (err) {
      logger.error('Export failed:', err);
    }
  };

  const chartData = {
    labels: loanOffers.map(offer => offer.lender),
    datasets: [
      {
        label: 'Total Interest ($)',
        data: loanAnalytics.map(summary => summary.totalInterest),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Financing Options Overview</h2>

      {/* Basic Offer List (Free) */}
      <div className="space-y-2 text-sm text-gray-700">
        {loanOffers.map((offer, idx) => (
          <div key={idx} className="border p-3 rounded bg-gray-50">
            <p><strong>Lender:</strong> {offer.lender}</p>
            <p><strong>Rate:</strong> {offer.rate}%</p>
            <p><strong>Term:</strong> {offer.term} months</p>
          </div>
        ))}
      </div>

      {/* Premium Analytics + Recommendations */}
      <PremiumFeature feature="loanAnalytics">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">📊 Interest Comparison</h3>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Total Interest Over Loan Term' },
              },
              animation: { duration: 800 },
            }}
          />
        </div>

        {/* AI Loan Strategy Recommendations */}
        <div className="mt-6 bg-green-50 border border-green-300 p-4 rounded">
          <h3 className="text-md font-semibold text-green-700 mb-2">🧠 AI Loan Recommendations</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec.message}</li>
            ))}
          </ul>
        </div>

        {/* PDF Export */}
        <div className="text-right mt-6">
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={exportPDF}>
            📄 Export to PDF
          </Button>
        </div>
      </PremiumFeature>
    </div>
  );
};

FinancingOptionsChart.propTypes = {
  loanOffers: PropTypes.array.isRequired,
  buyerProfile: PropTypes.object.isRequired,
};

export default FinancingOptionsChart;
