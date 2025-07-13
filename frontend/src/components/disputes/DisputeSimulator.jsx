// File: DisputeSimulator.jsx
// Path: frontend/src/components/disputes/DisputeSimulator.jsx
// Purpose: Interactive AI dispute simulator UI for buyers, sellers, and admins
// Author: Cod2
// Date: 2025-05-01
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DisputeSimulator = ({ disputeId }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await axios.get(`/api/disputes/${disputeId}/predict`);
        setPrediction(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch prediction.');
        toast.error('Prediction fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [disputeId]);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const res = await axios.get(`/api/disputes/${disputeId}/export`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arbitration_report_${disputeId}.pdf`;
      a.click();
      toast.success('PDF exported successfully');
    } catch (err) {
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const trendData = {
    labels: ['Bias', 'Risk', 'Confidence'],
    datasets: [
      {
        label: 'Dispute Score Trend',
        data: prediction ? [prediction.biasIndex, prediction.riskScore, prediction.confidence] : [],
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.3
      }
    ]
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Dispute Score Visualization'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1
      }
    }
  };

  const renderGamifiedFeedback = () => {
    if (!prediction) return null;
    if (prediction.alertLevel === 'HIGH') {
      return (
        <div className="mt-4 text-center animate-bounce text-red-600 font-bold">
          ⚠️ High-Risk Dispute Detected!
        </div>
      );
    } else if (prediction.confidence > 0.8) {
      return (
        <div className="mt-4 text-center animate-pulse text-green-600 font-bold">
          ✨ Strong Prediction Confidence ✨
        </div>
      );
    } else {
      return (
        <div className="mt-4 text-center text-yellow-600 font-semibold">
          🔎 Moderate prediction certainty
        </div>
      );
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dispute Outcome Simulator</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Predicted Result:</strong> {prediction.result}</p>
          <p><strong>Confidence:</strong> {Math.round(prediction.confidence * 100)}%</p>
          <p><strong>Bias Index:</strong> {prediction.biasIndex.toFixed(2)}</p>
          <p><strong>Risk Score:</strong> {prediction.riskScore.toFixed(2)}</p>
          <p><strong>Alert Level:</strong> <span className={`font-semibold ${prediction.alertLevel === 'HIGH' ? 'text-red-600' : 'text-green-600'}`}>{prediction.alertLevel}</span></p>
        </div>

        <div className="mt-4">
          <Line data={trendData} options={trendOptions} />
        </div>

        {renderGamifiedFeedback()}

        <div className="mt-6 text-center">
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
            disabled={isExporting}
            aria-label="Export Arbitration Report as PDF"
          >
            {isExporting ? 'Exporting...' : 'Download Arbitration PDF'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </ErrorBoundary>
  );
};

DisputeSimulator.propTypes = {
  disputeId: PropTypes.string.isRequired
};

export default DisputeSimulator;
