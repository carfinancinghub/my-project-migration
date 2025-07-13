/**
 * File: EquityIntelligenceHub.jsx
 * Path: frontend/src/components/equity-hub/EquityIntelligenceHub.jsx
 * Purpose: Premium dashboard for real-time insights into equity-based loan dynamics, supporting equity financing workflows
 * Author: Cod3 (05052256)
 * Date: May 05, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import axios from 'axios';
import PremiumFeature from '@components/common/PremiumFeature';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement);

// --- Component Definition ---
const EquityIntelligenceHub = () => {
  // --- State Management ---
  const [equityRisk, setEquityRisk] = useState(null);
  const [disputeTrends, setDisputeTrends] = useState(null);
  const [yieldHeatmap, setYieldHeatmap] = useState(null);
  const [filter, setFilter] = useState({ vehicleClass: 'all', region: 'all', riskLevel: 'all' });

  // --- API Integration ---
  const fetchEquityData = async () => {
    try {
      const [risk, dispute, yieldMap] = await Promise.all([
        axios.get('/api/equity-hub/risk-feed', { params: { ...filter } }),
        axios.get('/api/equity-hub/dispute-trends', { params: { ...filter } }),
        axios.get('/api/equity-hub/yield-heatmap', { params: { ...filter } })
      ]);
      setEquityRisk(risk.data);
      setDisputeTrends(dispute.data);
      setYieldHeatmap(yieldMap.data);
    } catch (err) {
      console.error('Equity Hub data fetch failed:', err);
    }
  };

  useEffect(() => { fetchEquityData(); }, [filter]);

  const handleFilterChange = (key, val) => setFilter(prev => ({ ...prev, [key]: val }));

  const disputeChartData = {
    labels: disputeTrends?.labels || [],
    datasets: [{ label: 'Dispute Trends', data: disputeTrends?.values || [], borderColor: '#10b981', tension: 0.4 }]
  };

  const yieldChartData = {
    labels: yieldHeatmap?.labels || [],
    datasets: [{ label: 'Yield Opportunities', data: yieldHeatmap?.values || [], backgroundColor: ['#34d399', '#60a5fa', '#fbbf24'] }]
  };

  return (
    <PremiumFeature feature="equityIntelligenceHub">
      <div className="equity-intelligence-hub p-4">
        <h2 className="text-2xl font-bold">Equity Intelligence Hub</h2>
        <div className="filters flex space-x-4 my-4">
          <select onChange={e => handleFilterChange('vehicleClass', e.target.value)}>
            <option value="all">All Vehicle Classes</option>
            <option value="suv">SUV</option><option value="classic">Classic</option>
          </select>
          <select onChange={e => handleFilterChange('region', e.target.value)}>
            <option value="all">All Regions</option><option value="texas">Texas</option>
          </select>
          <select onChange={e => handleFilterChange('riskLevel', e.target.value)}>
            <option value="all">All Risk Levels</option>
            <option value="low">Low</option><option value="high">High</option>
          </select>
        </div>
        <div className="dashboard-section mb-4">
          <h3 className="font-semibold">Equity Risk Feed</h3>
          <p>Average Risk Score: {equityRisk?.averageRisk || 'Loading...'}</p>
        </div>
        <motion.div className="dashboard-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="font-semibold">Dispute Trends</h3>
          <Line data={disputeChartData} />
        </motion.div>
        <motion.div className="dashboard-section mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="font-semibold">Yield Opportunity Heatmap</h3>
          <Pie data={yieldChartData} />
        </motion.div>
      </div>
    </PremiumFeature>
  );
};

export default EquityIntelligenceHub;
