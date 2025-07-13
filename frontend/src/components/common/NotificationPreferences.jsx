// File: NotificationPreferences.jsx
// Path: C:\CFH\frontend\src\components\common\NotificationPreferences.jsx
// Purpose: Allow users to configure notification preferences
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/user

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { updatePreferences } from '@services/api/user';

const NotificationPreferences = ({ userId }) => {
  const [preferences, setPreferences] = useState({
    bidUpdates: true,
    messages: true,
    insuranceOffers: true,
    intensity: 'normal' // Options: 'normal', 'low', 'off'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      setIsLoading(true);
      try {
        const user = await db.getUser(userId);
        if (user && user.preferences && user.preferences.notifications) {
          setPreferences(user.preferences.notifications);
        }
        logger.info(`[NotificationPreferences] Fetched preferences for userId: ${userId}`);
      } catch (err) {
        logger.error(`[NotificationPreferences] Failed to fetch preferences for userId ${userId}: ${err.message}`, err);
        setError('Failed to load preferences. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferences();
  }, [userId]);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await updatePreferences(userId, { notifications: preferences });
      logger.info(`[NotificationPreferences] Saved preferences for userId: ${userId}`);
    } catch (err) {
      logger.error(`[NotificationPreferences] Failed to save preferences for userId ${userId}: ${err.message}`, err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading preferences...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Notification Preferences</h3>
      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.bidUpdates}
              onChange={(e) => handlePreferenceChange('bidUpdates', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">Receive Bid Updates</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.messages}
              onChange={(e) => handlePreferenceChange('messages', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">Receive Messages</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.insuranceOffers}
              onChange={(e) => handlePreferenceChange('insuranceOffers', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">Receive Insurance Offers</span>
          </label>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Notification Intensity</label>
          <select
            value={preferences.intensity}
            onChange={(e) => handlePreferenceChange('intensity', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="low">Low</option>
            <option value="off">Off</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

NotificationPreferences.propTypes = {
  userId: PropTypes.string.isRequired
};

export default NotificationPreferences;