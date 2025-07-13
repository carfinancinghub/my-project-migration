// File: SellerActivityTimeline.jsx
// Path: frontend/src/components/seller/SellerActivityTimeline.jsx
// Purpose: Display a timeline of recent seller activities (new listings, updates, auctions, offers)
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx';
import { theme } from '@/styles/theme';

const SellerActivityTimeline = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get('/api/seller/activity-log', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedActivities = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
        setActivities(sortedActivities);
      } catch (err) {
        console.error('Error fetching seller activities:', err);
        setError('Failed to load activity timeline');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const getActionEmoji = (actionType) => {
    switch (actionType) {
      case 'created': return '🆕';
      case 'updated': return '✏️';
      case 'auction_started': return '🚀';
      case 'offer_received': return '💸';
      default: return '🖊️';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className={theme.errorText}>{error}</div>;

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">⏳ Seller Activity Timeline</h2>

        {activities.length === 0 ? (
          <p className="text-gray-500">No recent activities found.</p>
        ) : (
          <div className="relative border-l-2 border-gray-300">
            {activities.map((activity, index) => (
              <div key={index} className="mb-8 ml-6">
                <div className="absolute w-6 h-6 bg-blue-500 rounded-full -left-3 flex items-center justify-center text-white">
                  {getActionEmoji(activity.actionType)}
                </div>
                <div className="bg-white shadow p-4 rounded-lg">
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                  <p className="font-semibold">
                    {activity.actionType.replace('_', ' ').toUpperCase()}: {activity.carModel} ({activity.carYear})
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SellerActivityTimeline;
