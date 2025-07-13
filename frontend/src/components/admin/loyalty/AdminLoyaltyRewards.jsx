// File: AdminLoyaltyRewards.js
// Path: frontend/src/components/admin/loyalty/AdminLoyaltyRewards.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Card from '../../common/Card';
import Button from '../../common/Button';

const AdminLoyaltyRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/loyalty/rewards`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRewards(res.data);
      } catch (err) {
        console.error('Error fetching loyalty rewards:', err);
        setError('❌ Failed to load loyalty rewards');
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const handleAward = async (userId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/loyalty/rewards/${userId}/award`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Reward awarded');
    } catch (err) {
      console.error('Error awarding reward:', err);
      alert('❌ Failed to award reward');
    }
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">🏆 Loyalty Rewards</h1>

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && rewards.length === 0 && (
            <p className="text-gray-500">No loyalty rewards data found.</p>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {rewards.map((r) => (
                <Card key={r.userId} className="hover:shadow-md flex justify-between items-center">
                  <div>
                    <p><strong>User:</strong> {r.userEmail}</p>
                    <p><strong>Points:</strong> {r.points}</p>
                    <p><strong>Tier:</strong> {r.tier}</p>
                  </div>
                  <Button onClick={() => handleAward(r.userId)} className="bg-indigo-600 hover:bg-indigo-700">
                    Award More
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminLoyaltyRewards;
