/**
 * BuyerAnalyticsDashboardOld1.jsx
 * Path: frontend/src/components/buyer/BuyerAnalyticsDashboard.jsx
 * Purpose: Display buyer's purchase history and engagement stats with Recharts visualizations.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PropTypes from 'prop-types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const BuyerAnalyticsDashboard = ({ buyerId }) => {
  const [analyticsData, setAnalyticsData] = useState({
    purchases: [],
    totalSaved: 0,
    favoriteBrands: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view analytics');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get(`/api/buyer/${buyerId}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAnalyticsData(response.data || { purchases: [], totalSaved: 0, favoriteBrands: [] });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
        setLoading(false);
        toast.error('Error loading analytics');
      }
    };

    fetchAnalytics();
  }, [buyerId]);

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics Dashboard</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {analyticsData.purchases.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No purchase data yet. Start shopping to see your stats! 🚗
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Purchases Over Time */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Purchases Over Time
                </h3>
                <BarChart
                  width={300}
                  height={200}
                  data={analyticsData.purchases}
                  className="animate-fadeIn"
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </div>
              {/* Favorite Brands */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Favorite Brands</h3>
                <PieChart width={300} height={200} className="animate-fadeIn">
                  <Pie
                    data={analyticsData.favoriteBrands}
                    dataKey="count"
                    nameKey="brand"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {analyticsData.favoriteBrands.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
              {/* Total Saved */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Savings</h3>
                <p className="text-2xl font-bold text-green-500">
                  ${analyticsData.totalSaved.toLocaleString()} Saved
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

BuyerAnalyticsDashboard.propTypes = {
  buyerId: PropTypes.string.isRequired,
};

export default BuyerAnalyticsDashboard;