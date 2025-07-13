
// File: InsurerInsightsChart.jsx
// Path: frontend/src/components/insurance/InsurerInsightsChart.jsx
// Author: Cod2 05050043
// 👑 Crown Certified
// Purpose: Visualize insurer metrics such as active policies and claims ratio, and support future real-time dashboards.
// Functions:
// - fetchData(): Loads mocked insurance metrics
// - useEffect(): Loads metrics on mount

import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import PremiumFeature from '@components/common/PremiumFeature';

const InsurerInsightsChart = () => {
  const [policyCount, setPolicyCount] = useState(0);
  const [claimsRatio, setClaimsRatio] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      setPolicyCount(1200);
      setClaimsRatio(0.23);
    };
    fetchData();
  }, []);

  const pieData = {
    labels: ['Policies Active', 'Claims Made'],
    datasets: [
      {
        data: [policyCount * (1 - claimsRatio), policyCount * claimsRatio],
        backgroundColor: ['#10b981', '#f87171'],
      },
    ],
  };

  const barData = {
    labels: ['Dealers', 'Buyers', 'Sellers'],
    datasets: [
      {
        label: 'Policies by User Type',
        data: [300, 500, 400],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Insurer Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Pie data={pieData} />
        <Bar data={barData} />
      </div>

      <PremiumFeature feature="insuranceAnalytics">
        <p className="mt-4 text-sm text-gray-500">Enterprise: Real-time updates, exportable charts, risk overlays coming soon.</p>
      </PremiumFeature>
    </div>
  );
};

export default InsurerInsightsChart;
