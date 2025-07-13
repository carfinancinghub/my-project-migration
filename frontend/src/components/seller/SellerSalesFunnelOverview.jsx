/**
 * SellerSalesFunnelOverview.jsx
 * Path: frontend/src/components/seller/SellerSalesFunnelOverview.jsx
 * Purpose: Visualize seller’s sales funnel (Listings → Offers → Negotiations → Sold) with animated stages, counts, and conversion rates.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const funnelStages = [
  { name: 'Listings Created', key: 'listings', color: 'bg-blue-500', icon: '🏠' },
  { name: 'Offers Received', key: 'offers', color: 'bg-green-500', icon: '💸' },
  { name: 'Negotiations Ongoing', key: 'negotiations', color: 'bg-yellow-500', icon: '🤝' },
  { name: 'Cars Sold', key: 'sales', color: 'bg-red-500', icon: '🚗' },
];

const SellerSalesFunnelOverview = () => {
  const [funnelData, setFunnelData] = useState({
    listings: 0,
    offers: 0,
    negotiations: 0,
    sales: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFunnelData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view sales funnel');
          setIsLoading(false);
          return;
        }
        const response = await axios.get('/api/seller/sales-funnel', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFunnelData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load sales funnel data');
        setIsLoading(false);
        toast.error('Error loading sales funnel');
      }
    };
    fetchFunnelData();
  }, []);

  // Memoize conversion rates to optimize renders
  const conversionRates = useMemo(() => {
    return funnelStages.slice(1).map((stage, index) => {
      const prevStage = funnelStages[index];
      const prevCount = funnelData[prevStage.key];
      const currentCount = funnelData[stage.key];
      return prevCount > 0 ? ((currentCount / prevCount) * 100).toFixed(1) : 0;
    });
  }, [funnelData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sales Funnel
        </h1>
        <div className="space-y-4 max-w-2xl mx-auto">
          {funnelStages.map((stage, index) => (
            <div
              key={stage.key}
              className={`relative animate-funnelStage flex items-center justify-between p-4 ${stage.color} text-white rounded-lg shadow-md transform transition-all duration-500 hover:shadow-lg`}
              style={{
                clipPath:
                  index === 0
                    ? 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)'
                    : index === funnelStages.length - 1
                    ? 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)'
                    : 'polygon(10% 0%, 90% 0%, 90% 100%, 10% 100%)',
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{stage.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold">{stage.name}</h3>
                  <p className="text-sm">📈 {funnelData[stage.key]} items</p>
                </div>
              </div>
              {index > 0 && (
                <div className="text-sm font-medium">
                  🔥 {conversionRates[index - 1]}% conversion
                </div>
              )}
              {/* Sparkle effect for gamified feel */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle"></div>
            </div>
          ))}
        </div>
      </div>
      {/* CSS for animations */}
      <style>
        {`
          @keyframes funnelStage {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-funnelStage {
            animation: funnelStage 0.5s ease-out forwards;
            animation-delay: calc(0.1s * var(--index));
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          .animate-sparkle {
            animation: sparkle 1.5s infinite;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerSalesFunnelOverview;