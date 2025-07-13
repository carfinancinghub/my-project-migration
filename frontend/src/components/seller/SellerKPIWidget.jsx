/**
 * SellerKPIWidget.jsx
 * Path: frontend/src/components/seller/SellerKPIWidget.jsx
 * Purpose: Display key performance indicators for sellers in a responsive card grid.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerKPIWidget = () => {
  const [kpiData, setKpiData] = useState({
    totalListings: 0,
    carsSold: 0,
    avgDaysOnMarket: 0,
    auctionSuccessRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/kpi-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKpiData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load KPI stats');
        setIsLoading(false);
        toast.error('Error loading KPI stats');
      }
    };
    fetchKPIStats();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  const kpiItems = [
    {
      title: 'Total Listings',
      value: kpiData.totalListings,
      icon: '📋',
      ariaLabel: 'Total number of listings',
    },
    {
      title: 'Cars Sold',
      value: kpiData.carsSold,
      icon: '🚗',
      ariaLabel: 'Total number of cars sold',
    },
    {
      title: 'Avg Days on Market',
      value: `${kpiData.avgDaysOnMarket.toFixed(1)} days`,
      icon: '⏳',
      ariaLabel: 'Average days on market for listings',
    },
    {
      title: 'Auction Success Rate',
      value: `${(kpiData.auctionSuccessRate * 100).toFixed(1)}%`,
      icon: '🏆',
      ariaLabel: 'Percentage of successful auctions',
    },
  ];

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Seller Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiItems.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow"
              aria-label={item.ariaLabel}
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-600">{item.title}</h3>
                <p className="text-xl font-bold text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SellerKPIWidget;