/**
 * SellerMissionCenter.jsx
 * Path: frontend/src/components/seller/SellerMissionCenter.jsx
 * Purpose: A motivational quest center for sellers to complete missions and earn rewards.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Status badge styles
const statusStyles = {
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  Locked: 'bg-gray-100 text-gray-800',
};

const SellerMissionCenter = () => {
  const [missions, setMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/missions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMissions(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load missions');
        setIsLoading(false);
        toast.error('Error loading missions');
      }
    };
    fetchMissions();
  }, []);

  const handleClaimReward = async (missionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/seller/missions/${missionId}/claim`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMissions((prev) =>
        prev.map((mission) =>
          mission.id === missionId ? { ...mission, status: 'Completed' } : mission
        )
      );
      toast.success('Reward claimed successfully!');
    } catch (err) {
      toast.error('Failed to claim reward');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mission Center</h1>
        {missions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No missions available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission, index) => (
              <div
                key={mission.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
                aria-label={`Mission: ${mission.name}`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl">{mission.icon || '🏆'}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{mission.name}</h3>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyles[mission.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {mission.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{mission.description}</p>
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full animate-progress"
                      style={{
                        width: `${(mission.progress / mission.totalTasks) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {mission.progress}/{mission.totalTasks} tasks completed
                  </p>
                </div>
                {mission.status === 'Completed' && (
                  <button
                    onClick={() => handleClaimReward(mission.id)}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    aria-label={`Claim reward for ${mission.name}`}
                  >
                    Claim Reward
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes progress {
            from { width: 0; }
            to { width: inherit; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .animate-progress {
            animation: progress 1s ease-out forwards;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerMissionCenter;