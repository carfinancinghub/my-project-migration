/**
 * SellerActivityInsights.jsx
 * Path: frontend/src/components/seller/SellerActivityInsights.jsx
 * Purpose: Visualize seller activity metrics with animated counters and optional chart.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Simple count-up animation hook
const useCountUp = (end, duration = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
};

const SellerActivityInsights = () => {
  const [insights, setInsights] = useState({
    totalListings: 0,
    totalOffers: 0,
    totalAuctions: 0,
    totalContracts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/activity-insights', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInsights(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load activity insights');
        setIsLoading(false);
        toast.error('Error loading insights');
      }
    };
    fetchInsights();
  }, []);

  const listingsCount = useCountUp(insights.totalListings);
  const offersCount = useCountUp(insights.totalOffers);
  const auctionsCount = useCountUp(insights.totalAuctions);
  const contractsCount = useCountUp(insights.totalContracts);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  const metrics = [
    {
      title: 'Listings Created',
      value: listingsCount,
      icon: '📋',
      ariaLabel: 'Total number of listings created',
    },
    {
      title: 'Offers Received',
      value: offersCount,
      icon: '💸',
      ariaLabel: 'Total number of offers received',
    },
    {
      title: 'Auctions Started',
      value: auctionsCount,
      icon: '🔨',
      ariaLabel: 'Total number of auctions started',
    },
    {
      title: 'Contracts Signed',
      value: contractsCount,
      icon: '✍️',
      ariaLabel: 'Total number of contracts signed',
    },
  ];

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Activity Insights</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={metric.title}
              className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={metric.ariaLabel}
            >
              <span className="text-3xl">{metric.icon}</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-600">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
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

export default SellerActivityInsights;