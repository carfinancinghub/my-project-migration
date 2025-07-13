/**
 * SellerMarketTrendInsights.jsx
 * Path: frontend/src/components/seller/SellerMarketTrendInsights.jsx
 * Purpose: Real-time dashboard for market shifts (price trends, hot-selling models) with predictive style, smart charts, and gamified badges.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const SellerMarketTrendInsights = () => {
  const [marketData, setMarketData] = useState({ trends: [], models: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view market trends');
          setIsLoading(false);
          return;
        }
        const response = await axios.get('/api/seller/market-trends', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMarketData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load market trends');
        setIsLoading(false);
        toast.error('Error loading market trends');
      }
    };
    fetchMarketData();
  }, []);

  // Placeholder for badge logic (untouched)
  const badges = []; // e.g., [{ name: 'Price Leader', icon: '🏆' }]

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Market Trend Insights 🔮
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price Trend Chart (untouched) */}
          <div className="bg-white rounded-xl shadow-md p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Price Trends</h2>
            <LineChart width={500} height={300} data={marketData.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgPrice" stroke="#3b82f6" />
            </LineChart>
          </div>
          {/* Hot Models Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hot-Selling Models</h2>
            {marketData.models.length === 0 ? (
              <div className="text-gray-500 text-center py-4">
                No hot models yet 🔥
              </div>
            ) : (
              <BarChart
                width={500}
                height={300}
                data={marketData.models}
                className="animate-chartFadeIn"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgPrice" fill="#10b981" />
              </BarChart>
            )}
          </div>
          {/* Badges (untouched) */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Your Achievements
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {badges.length === 0 ? (
                <div className="text-gray-500">No badges yet. Keep selling! 🌟</div>
              ) : (
                badges.map((badge) => (
                  <div
                    key={badge.name}
                    className="bg-yellow-500 text-white p-2 rounded-full animate-glow"
                  >
                    {badge.icon} {badge.name}
                  </div>
                ))
              )}
            </div>
          </div>
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
          @keyframes chartFadeIn {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-chartFadeIn {
            animation: chartFadeIn 0.7s ease-out;
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(234, 179, 8, 0.5); }
            50% { box-shadow: 0 0 15px rgba(234, 179, 8, 1); }
          }
          .animate-glow {
            animation: glow 1.5s infinite;
          }
          /* Hover effect for bars */
          .recharts-bar-rectangle:hover {
            fill: #059669 !important; /* Darker green on hover */
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerMarketTrendInsights;