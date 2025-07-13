// File: BuyerEmailSettings.jsx
// Path: frontend/src/components/buyer/BuyerEmailSettings.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PropTypes from 'prop-types';

const BuyerEmailSettings = ({ buyerId }) => {
  const [settings, setSettings] = useState({
    newListings: true,
    escrowUpdates: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing email settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to manage email settings');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get(`/api/buyer/${buyerId}/email-settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSettings(response.data || { newListings: true, escrowUpdates: true });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load email settings');
        setLoading(false);
        toast.error('Error loading email settings');
      }
    };

    fetchSettings();
  }, [buyerId]);

  // Handle toggle switches
  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle save settings
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.post(
        `/api/buyer/${buyerId}/email-settings`,
        settings,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Email settings updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update email settings');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Notification Settings</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <div className="space-y-6">
            {/* New Listings Notification */}
            <div className="flex items-center justify-between">
              <label htmlFor="newListings" className="text-gray-700 font-medium">
                New Listings Alerts
              </label>
              <input
                id="newListings"
                type="checkbox"
                checked={settings.newListings}
                onChange={() => handleToggle('newListings')}
                className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                aria-label="Toggle new listings email notifications"
              />
            </div>
            {/* Escrow Updates Notification */}
            <div className="flex items-center justify-between">
              <label htmlFor="escrowUpdates" className="text-gray-700 font-medium">
                Escrow Updates
              </label>
              <input
                id="escrowUpdates"
                type="checkbox"
                checked={settings.escrowUpdates}
                onChange={() => handleToggle('escrowUpdates')}
                className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                aria-label="Toggle escrow updates email notifications"
              />
            </div>
            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              aria-label="Save email notification settings"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

BuyerEmailSettings.propTypes = {
  buyerId: PropTypes.string.isRequired,
};

export default BuyerEmailSettings;
