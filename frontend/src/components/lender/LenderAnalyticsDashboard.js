// File: LenderAnalyticsDashboard.js
// Path: frontend/src/components/lender/LenderAnalyticsDashboard.js
// 👑 Cod1 Crown Certified — Data-Driven Lending Disruption Dashboard

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/layout/AdminLayout';
import LoadingSpinner from '../common/LoadingSpinner';
import Card from '../common/Card';
import Button from '../common/Button';
import { theme } from '../../styles/theme';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';

const LenderAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/lender/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('❌ Failed to load lender analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const exportToPDF = () => {
    alert('📄 PDF Export Coming Soon — Add PDF Generator Utility');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;

  const { totalBids, successRate, avgInterestRate, avgLoanDuration, totalEarnings, recentPerformance } = analytics;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">📊 Lender Analytics</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={exportToPDF}>Export PDF</Button>
            <CSVLink
              filename="lender_analytics.csv"
              data={[analytics]}
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Export CSV
            </CSVLink>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card><h3>Total Bids</h3><p className="text-xl font-semibold">{totalBids}</p></Card>
          <Card><h3>Success Rate</h3><p className="text-xl font-semibold">{successRate}%</p></Card>
          <Card><h3>Average Interest Rate</h3><p className="text-xl font-semibold">{avgInterestRate}%</p></Card>
          <Card><h3>Loan Duration</h3><p className="text-xl font-semibold">{avgLoanDuration} months</p></Card>
          <Card><h3>Earnings</h3><p className="text-xl font-semibold">${totalEarnings.toLocaleString()}</p></Card>
          <Card>
            <h3>🧠 AI Highlights</h3>
            <ul className="text-sm list-disc pl-5 text-gray-700">
              {recentPerformance.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LenderAnalyticsDashboard;
