/**
 * @file InsuranceClaimsAnalytics.jsx
 * @path frontend/src/components/insurance/InsuranceClaimsAnalytics.jsx
 * @description Claims analytics dashboard with filtering, visualizations, and premium AI insights for CFH platform. Crown Certified for Rivers Auction Live Test Prep.
 * @wow Interactive data visualizations, premium AI risk trends, real-time polling updates.
 * @author Cod2 - May 08, 2025, 10:00 PST
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import PremiumFeature from '@components/common/PremiumFeature';
import ToastManager from '@components/common/ToastManager';
import styles from '@styles/InsuranceClaimsAnalytics.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Title);

const InsuranceClaimsAnalytics = () => {
  const [claims, setClaims] = useState([]);
  const [region, setRegion] = useState('CA');
  const [timeframe, setTimeframe] = useState('next_6_months');
  const [riskTrends, setRiskTrends] = useState({});

  const fetchClaimsData = async () => {
    try {
      const res = await fetch(`/api/claims?region=${region}&timeframe=${timeframe}`);
      if (!res.ok) throw new Error('Failed to fetch claims');
      const data = await res.json();
      setClaims(data);
    } catch (err) {
      console.error(err.message);
      ToastManager.error('Unable to load claims analytics.');
    }
  };

  const fetchRiskTrends = async () => {
    try {
      const trends = {};
      for (const claim of claims) {
        const res = await fetch(`/api/claims/${claim._id}/risk`);
        if (res.ok) {
          const { risk } = await res.json();
          trends[claim._id] = risk;
        }
      }
      setRiskTrends(trends);
    } catch (err) {
      console.error('Risk trend fetch failed', err.message);
      ToastManager.error('Unable to load AI risk trends.');
    }
  };

  useEffect(() => {
    fetchClaimsData();
  }, [region, timeframe]);

  useEffect(() => {
    fetchClaimsData();
    const interval = setInterval(() => {
      if (!document.hidden) fetchClaimsData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (claims.length) fetchRiskTrends();
  }, [claims]);

  const totalClaims = claims.length;
  const avgAmount = totalClaims ? (claims.reduce((acc, c) => acc + c.amount, 0) / totalClaims).toFixed(2) : 0;
  const statusCount = claims.reduce((acc, { status }) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: Object.keys(statusCount),
    datasets: [{
      label: 'Status Count',
      data: Object.values(statusCount),
    }],
  };

  const amountData = {
    labels: claims.map(c => c.policyId),
    datasets: [{
      label: 'Claim Amounts',
      data: claims.map(c => c.amount),
    }],
  };

  const chartOptions = (title) => ({
    plugins: {
      title: {
        display: true,
        text: title
      }
    }
  });

  return (
    <div className={styles.analyticsPanel} aria-label="claims-analytics" role="region" data-testid="claims-analytics">
      <h2>Claims Analytics</h2>

      <div className={styles.filters}>
        <label>
          Region:
          <select value={region} onChange={e => setRegion(e.target.value)}>
            <option value="CA">California</option>
            <option value="TX">Texas</option>
            <option value="NY">New York</option>
          </select>
        </label>
        <label>
          Timeframe:
          <select value={timeframe} onChange={e => setTimeframe(e.target.value)}>
            <option value="next_6_months">Next 6 Months</option>
            <option value="next_year">Next Year</option>
          </select>
        </label>
      </div>

      <div className={styles.stats}>
        <p>Total Claims: {totalClaims}</p>
        <p>Average Claim Amount: ${avgAmount}</p>
      </div>

      <div className={styles.charts}>
        <Bar data={statusData} options={chartOptions('Claims Status Distribution')} />
        <Pie data={amountData} options={chartOptions('Claim Amounts per Policy')} />
      </div>

      <PremiumFeature>
        <section className={styles.premiumInsights} aria-label="premium-risk-trends" role="region">
          <h3>AI Risk Trends</h3>
          {claims.map(claim => (
            <p key={claim._id}>Claim {claim._id}: Risk Score = {riskTrends[claim._id] !== undefined ? `${(riskTrends[claim._id] * 100).toFixed(1)}%` : 'Loading...'}</p>
          ))}
        </section>
      </PremiumFeature>
    </div>
  );
};

InsuranceClaimsAnalytics.propTypes = {};

export default InsuranceClaimsAnalytics;
