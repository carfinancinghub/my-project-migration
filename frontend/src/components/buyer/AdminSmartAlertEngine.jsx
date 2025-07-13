/**
 * AdminSmartAlertEngine.jsx
 * Path: frontend/src/components/admin/AdminSmartAlertEngine.jsx
 * Purpose: Display prioritized admin alerts for disputes, escrow, or user actions in a responsive list with urgency badges.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const AdminSmartAlertEngine = ({ adminId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view alerts');
        setLoading(false);
        toast.error('Authentication required');
        return;
      }

      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/admin/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlerts(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load alerts');
      setLoading(false);
      toast.error('Error loading alerts');
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchAlerts();
  }, [adminId]);

  // Handle refresh button
  const handleRefresh = () => {
    fetchAlerts();
    toast.info('Refreshing alerts...');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Smart Alerts</h2>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            aria-label="Refresh admin alerts"
          >
            Refresh Alerts
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {alerts.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No alerts at this time. Everything is running smoothly! 🌟
            </div>
          ) : (
            <ul className="space-y-4">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="bg-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow animate-fadeIn"
                  role="region"
                  aria-label={`Alert: ${alert.message}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800 font-semibold">{alert.message}</p>
                      <p className="text-sm text-gray-600">Type: {alert.type}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        alert.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : alert.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {alert.priority}
                    </span>
                  </div>
                  {alert.link && (
                    <a
                      href={alert.link}
                      className="text-blue-500 text-sm hover:underline mt-2 inline-block"
                      aria-label={`View details for ${alert.message}`}
                    >
                      View Details
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
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
        `}
      </style>
    </ErrorBoundary>
  );
};

AdminSmartAlertEngine.propTypes = {
  adminId: PropTypes.string.isRequired,
};

export default AdminSmartAlertEngine;