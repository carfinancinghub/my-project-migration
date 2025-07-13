// File: BidAssistantSimulator.jsx
// Path: frontend/src/components/buyer/BidAssistantSimulator.jsx
// 👑 Cod1 Crown Certified — Premium Strategy Tool for Buyers (Smart, Conservative, Aggressive AI Modes)
// 👥 Contributors: SG (vision), Cod1 (logic, UX, AI layer)

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import Button from '@components/common/Button';
import InfoTooltip from '@components/common/InfoTooltip';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

// --- Simulated AI Models ---
const generateStrategy = (basePrice, strategyType) => {
  const multipliers = {
    conservative: [1.01, 1.015, 1.02, 1.025],
    smart: [1.01, 1.0175, 1.025, 1.03],
    aggressive: [1.02, 1.035, 1.05, 1.065],
  };
  const data = multipliers[strategyType].map((factor, i) => ({
    round: `Round ${i + 1}`,
    bid: parseFloat((basePrice * factor).toFixed(2)),
  }));
  return data;
};

const BidAssistantSimulator = ({ basePrice }) => {
  const [strategy, setStrategy] = useState('smart');
  const strategyData = generateStrategy(basePrice, strategy);

  const chartData = {
    labels: strategyData.map((d) => d.round),
    datasets: [
      {
        label: `${strategy.charAt(0).toUpperCase() + strategy.slice(1)} Strategy`,
        data: strategyData.map((d) => d.bid),
        fill: false,
        borderColor:
          strategy === 'smart'
            ? '#10b981'
            : strategy === 'conservative'
            ? '#3b82f6'
            : '#ef4444',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Simulated Bid Strategy (AI Estimated)',
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6 space-y-6" aria-labelledby="bid-simulator-title">
      <div className="flex items-center justify-between">
        <h2 id="bid-simulator-title" className="text-xl font-bold text-gray-800">
          Bid Strategy Simulator (AI Powered)
        </h2>
        <InfoTooltip text="Simulate bidding outcomes across strategies and rounds based on AI estimations." />
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setStrategy('conservative')} className={strategy === 'conservative' ? 'bg-blue-600 text-white' : ''}>
          Conservative
        </Button>
        <Button onClick={() => setStrategy('smart')} className={strategy === 'smart' ? 'bg-green-600 text-white' : ''}>
          Smart AI
        </Button>
        <Button onClick={() => setStrategy('aggressive')} className={strategy === 'aggressive' ? 'bg-red-600 text-white' : ''}>
          Aggressive
        </Button>
      </div>

      <div role="region" aria-label="Strategy Bid Chart">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="text-sm text-gray-600 mt-2">
        <p>
          This tool helps you estimate how different strategies affect your final price. The Smart AI strategy balances cost vs. competitiveness.
        </p>
        <p className="mt-1 italic">
          Data shown is simulated based on platform bidding trends. Future versions will support live simulation & competitor analysis.
        </p>
      </div>
    </div>
  );
};

BidAssistantSimulator.propTypes = {
  basePrice: PropTypes.number.isRequired,
};

export default BidAssistantSimulator;
