import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './RoleActivityCharts.css';

Chart.register(...registerables);

const RoleActivityCharts = ({ role }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const roleRouteMap = {
    lender: '/api/analytics/lender',
    mechanic: '/api/analytics/mechanic',
    judge: '/api/analytics/judge',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(roleRouteMap[role]);
        setData(res.data);
      } catch (err) {
        console.error(`Error fetching analytics for ${role}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role]);

  if (loading) return <div className="loader">📈 Loading charts...</div>;
  if (!data) return <div className="error">No data available for {role}</div>;

  const commonOptions = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
  };

  return (
    <div className="role-activity-charts">
      <h2>📊 {role.charAt(0).toUpperCase() + role.slice(1)} Activity Overview</h2>
      {role === 'lender' && (
        <>
          <Bar
            data={{
              labels: ['Total Bids', 'Success Rate %', 'Avg Interest %'],
              datasets: [{ label: 'Lender Stats', data: [data.totalBids, data.successRate, data.avgInterest], backgroundColor: '#4e79a7' }],
            }}
            options={commonOptions}
          />
          <Line
            data={{
              labels: data.months,
              datasets: [{ label: 'Bids Over Time', data: data.bidsPerMonth, borderColor: '#f28e2c' }],
            }}
            options={commonOptions}
          />
        </>
      )}
      {role === 'mechanic' && (
        <>
          <Pie
            data={{
              labels: ['Completed', 'Pending'],
              datasets: [{ data: [data.completed, data.pending], backgroundColor: ['#59a14f', '#e15759'] }],
            }}
            options={commonOptions}
          />
        </>
      )}
      {role === 'judge' && (
        <>
          <Bar
            data={{
              labels: ['Cases Resolved', 'Vote Avg Time (min)'],
              datasets: [{ label: 'Judge Metrics', data: [data.casesResolved, data.avgVoteTime], backgroundColor: '#edc949' }],
            }}
            options={commonOptions}
          />
        </>
      )}
    </div>
  );
};

export default RoleActivityCharts;