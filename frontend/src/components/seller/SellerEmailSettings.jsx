// File: SellerEmailSettings.jsx
// Path: frontend/src/components/seller/SellerEmailSettings.jsx
// Purpose: Allow sellers to toggle email alert preferences (offers, disputes, escrow).

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PropTypes from 'prop-types';

const SellerEmailSettings = ({ sellerId }) => {
  const [settings, setSettings] = useState({
    offerAlerts: true,
    disputeUpdates: true,
    escrowNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current settings
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        toast.error('Please log in to view email settings.');
        return;
      }

      const response = await axios.get(`/api/seller/${sellerId}/email-settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSettings(response.data || {});
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load email settings');
      setLoading(false);
      toast.error('Error loading email settings.');
    }
  };

  // Save settings
  const saveSettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.post(`/api/seller/${sellerId}/email-settings`, settings, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Email settings updated successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchSettings();
  }, [sellerId]);

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Notification Settings</h2>
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          {/* Toggle Settings */}
          <div className="flex items-center justify-between">
            <label htmlFor="offerAlerts" className="text-sm font-medium text-gray-700">
              New Offer Alerts
            </label>
            <input
              id="offerAlerts"
              type="checkbox"
              checked={settings.offerAlerts}
              onChange={() =>
                setSettings((prev) => ({ ...prev, offerAlerts: !prev.offerAlerts }))
              }
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label="Toggle New Offer Email Alerts"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="disputeUpdates" className="text-sm font-medium text-gray-700">
              Dispute Status Updates
            </label>
            <input
              id="disputeUpdates"
              type="checkbox"
              checked={settings.disputeUpdates}
              onChange={() =>
                setSettings((prev) => ({ ...prev, disputeUpdates: !prev.disputeUpdates }))
              }
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label="Toggle Dispute Update Email Alerts"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="escrowNotifications" className="text-sm font-medium text-gray-700">
              Escrow Notifications
            </label>
            <input
              id="escrowNotifications"
              type="checkbox"
              checked={settings.escrowNotifications}
              onChange={() =>
                setSettings((prev) => ({ ...prev, escrowNotifications: !prev.escrowNotifications }))
              }
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label="Toggle Escrow Email Notifications"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            disabled={saving}
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Save Email Notification Settings"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

SellerEmailSettings.propTypes = {
  sellerId: PropTypes.string.isRequired,
};

export default SellerEmailSettings;
