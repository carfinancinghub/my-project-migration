/**
 * SellerExperienceLevel.jsx
 * Path: frontend/src/components/seller/SellerExperienceLevel.jsx
 * Purpose: Visually showcase the seller’s experience tier (Newbie, Rising Star, Top Seller) with badges, XP bars, and milestone progress.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const experienceLevels = [
  { name: 'Newbie', minXP: 0, icon: '🌱' },
  { name: 'Rising Star', minXP: 500, icon: '🚀' },
  { name: 'Top Seller', minXP: 1500, icon: '👑' },
];

const SellerExperienceLevel = () => {
  const [xpData, setXpData] = useState({ currentXP: 0, nextLevelXP: 500 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/experience', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setXpData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load experience data');
        setIsLoading(false);
        toast.error('Error loading experience');
      }
    };
    fetchXP();
  }, []);

  const getCurrentLevel = () => {
    return experienceLevels
      .slice()
      .reverse()
      .find((level) => xpData.currentXP >= level.minXP) || experienceLevels[0];
  };

  const currentLevel = getCurrentLevel();
  const progressPercent = Math.min(
    (xpData.currentXP / xpData.nextLevelXP) * 100,
    100
  ).toFixed(1);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Seller Level</h1>
        <div className="bg-white rounded-xl shadow-md p-8 space-y-4 inline-block">
          <div className="flex flex-col items-center">
            <span className="text-5xl">{currentLevel.icon}</span>
            <h2 className="text-xl font-semibold text-gray-800 mt-2">{currentLevel.name}</h2>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            {xpData.currentXP} XP / {xpData.nextLevelXP} XP
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SellerExperienceLevel;