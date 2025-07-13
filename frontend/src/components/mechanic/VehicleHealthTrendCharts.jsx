// File: VehicleHealthTrendCharts.jsx
// Path: frontend/src/components/mechanic/VehicleHealthTrendCharts.jsx
// Author: Cod1 (05051115)
// Purpose: Display recurring issue trends over time by vehicle type
// Functions:
// - Render a line chart of historical mechanic issues
// - Gate premium insights behind "mechanicPro"

import React from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import { useLanguage } from '@components/common/MultiLanguageSupport';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const mockTrendData = [
  { month: 'Jan', tire: 12, brake: 8, oil: 5 },
  { month: 'Feb', tire: 15, brake: 10, oil: 7 },
  { month: 'Mar', tire: 11, brake: 9, oil: 6 },
  { month: 'Apr', tire: 18, brake: 11, oil: 9 },
  { month: 'May', tire: 20, brake: 14, oil: 10 },
];

const VehicleHealthTrendCharts = () => {
  const { getTranslation } = useLanguage();

  return (
    <PremiumFeature feature="mechanicPro">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          {getTranslation('vehicleHealthTrends')}
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockTrendData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="tire" stroke="#8884d8" name={getTranslation('tire')} />
            <Line type="monotone" dataKey="brake" stroke="#82ca9d" name={getTranslation('brake')} />
            <Line type="monotone" dataKey="oil" stroke="#ffc658" name={getTranslation('oil')} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </PremiumFeature>
  );
};

export default VehicleHealthTrendCharts;
