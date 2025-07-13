// File: SellerSuccessTips.jsx
// Path: frontend/src/components/seller/SellerSuccessTips.jsx
// Purpose: Display motivational success tips for sellers in an engaging, animated card layout.
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Mock tips data (can be replaced with API call)
const mockTips = [
  { id: 1, text: 'Use clear, high-quality car photos', icon: '📸' },
  { id: 2, text: 'Respond to offers quickly', icon: '⚡' },
  { id: 3, text: 'Set a competitive price', icon: '💰' },
  { id: 4, text: 'Write detailed descriptions', icon: '📝' },
  { id: 5, text: 'Highlight unique features', icon: '✨' },
  { id: 6, text: 'Keep your listings updated', icon: '🔄' },
];

const SellerSuccessTips = () => {
  const [tips, setTips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API fetch (can be replaced with real /api/seller/tips call)
    const fetchTips = async () => {
      try {
        // Mock delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTips(mockTips);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load tips');
        setIsLoading(false);
        toast.error('Error loading tips');
      }
    };
    fetchTips();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tips for Seller Success</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, index) => (
            <div
              key={tip.id}
              className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={`Seller success tip: ${tip.text}`}
            >
              <span className="text-3xl">{tip.icon}</span>
              <p className="text-gray-700 font-medium">{tip.text}</p>
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

export default SellerSuccessTips;