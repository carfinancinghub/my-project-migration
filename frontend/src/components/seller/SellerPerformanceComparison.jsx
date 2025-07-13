/**
 * SellerPerformanceComparison.jsx
 * Path: frontend/src/components/seller/SellerPerformanceComparison.jsx
 * Purpose: Benchmark seller KPIs against platform-wide averages with animated progress bars.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerPerformanceComparison = () => {
  const [performanceData, setPerformanceData] = useState({
    listings: { user: 0, average: 0 },
    sales: { user: 0, average: 0 },
    offers: { user: 0, average: 0 },
    auctions: { user: 0, average: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/performance-comparison', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPerformanceData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load performance data');
        setIsLoading(false);
        toast.error('Error loading performance data');
      }
    };
    fetchPerformanceData();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  const metrics = [
    {
      title: 'Listings Created',
      userValue: performanceData.listings.user,
      averageValue: performanceData.listings.average,
      icon: '📋',
      ariaLabel: 'Comparison of listings created',
    },
    {
      title: 'Cars Sold',
      userValue: performanceData.sales.user,
      averageValue: performanceData.sales.average,
      icon: '🚗',
      ariaLabel: 'Comparison of cars sold',
    },
    {
      title: 'Offers Received',
      userValue: performanceData.offers.user,
      averageValue: performanceData.offers.average,
      icon: '💸',
      ariaLabel: 'Comparison of offers received',
    },
    {
      title: 'Auctions Started',
      userValue: performanceData.auctions.user,
      averageValue: performanceData.auctions.average,
      icon: '🔨',
      ariaLabel: 'Comparison of auctions started',
    },
  ];

  const getPercentage = (user, avg) => {
    if (avg === 0) return 0;
    return Math.min((user / avg) * 100, 100).toFixed(1);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Performance Comparison</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={metric.title}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={metric.ariaLabel}
            >
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl">{metric.icon}</span>
                <h3 className="text-sm font-semibold text-gray-600">{metric.title}</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Your Performance</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000"
                      style={{ width: `${getPercentage(metric.userValue, metric.averageValue)}%` }}
                    ></div>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{metric.userValue}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Platform Average</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gray-400 h-2.5 rounded-full transition-all duration-1000"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{metric.averageValue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerPerformanceComparison;