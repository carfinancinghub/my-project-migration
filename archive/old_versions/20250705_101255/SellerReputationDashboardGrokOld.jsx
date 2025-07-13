// File: SellerReputationDashboardGrokOld.jsx
// Path: frontend/src/components/seller/SellerReputationDashboardGrokOld.jsx

import React, { useEffect, useState } from 'react';
import UserTrustBadges from '@components/common/UserTrustBadges';
import { Chart } from 'react-chartjs-2';
import axios from 'axios';

const SellerReputationDashboard = ({ sellerId }) => {
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        const res = await axios.get(`/api/reputation/seller/${sellerId}`);
        setReputation(res.data);
      } catch (err) {
        setError('Failed to load reputation');
      } finally {
        setLoading(false);
      }
    };
    fetchReputation();
  }, [sellerId]);

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const chartData = {
    labels: reputation.history.map((entry) => entry.date),
    datasets: [
      {
        label: 'Reputation Score',
        data: reputation.history.map((entry) => entry.score),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      <h2 className="text-xl font-bold text-gray-800">📈 Seller Reputation Overview</h2>

      <div className="text-sm text-gray-600">
        <p>Verified Score: <span className="font-semibold">{reputation.currentScore}</span> / 100</p>
        <p>Percentile: <span className="font-semibold">{reputation.percentile}th</span></p>
        <p>AI Trust Grade: <span className="font-bold text-indigo-600">{reputation.aiRating}</span></p>
      </div>

      <div>
        <Chart type="line" data={chartData} />
      </div>

      <UserTrustBadges badges={reputation.badges} />

      <div className="mt-4">
        <h3 className="font-semibold mb-2">🔍 Trust Audit History</h3>
        <ul className="text-xs text-gray-700 space-y-1">
          {reputation.history.slice(-5).map((entry, i) => (
            <li key={i}>• {entry.date}: score {entry.score}, reason: {entry.reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SellerReputationDashboard;
