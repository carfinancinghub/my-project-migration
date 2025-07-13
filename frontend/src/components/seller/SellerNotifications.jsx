// File: SellerNotifications.jsx
// Path: C:\CFH\frontend\src\components\seller\SellerNotifications.jsx
// Purpose: Display seller notifications for auction updates
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/notifications

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getNotifications } from '@services/api/notifications';

const SellerNotifications = ({ sellerId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getNotifications(sellerId);
        setNotifications(data);
        logger.info(`[SellerNotifications] Fetched notifications for sellerId: ${sellerId}`);
      } catch (err) {
        logger.error(`[SellerNotifications] Failed to fetch notifications for sellerId ${sellerId}: ${err.message}`, err);
        setError('Failed to load notifications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [sellerId]);

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading notifications...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;
  if (!notifications.length) return <div className="p-4 text-center text-gray-500">No notifications available.</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-md mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li key={notification.id} className="border-b pb-4">
            <p className="text-lg font-medium text-gray-700">{notification.message}</p>
            <p className="text-sm text-gray-600">Date: {notification.date}</p>
            <p className="text-sm text-gray-600">Type: {notification.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

SellerNotifications.propTypes = { sellerId: PropTypes.string.isRequired };
export default SellerNotifications;