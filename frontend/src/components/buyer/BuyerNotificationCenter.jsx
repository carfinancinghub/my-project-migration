/**
 * BuyerNotificationCenter.jsx
 * Path: frontend/src/components/buyer/BuyerNotificationCenter.jsx
 * Purpose: Display unified in-app notifications for buyers in a dropdown with badge counter.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PropTypes from 'prop-types';

const BuyerNotificationCenter = ({ buyerId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view notifications');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get(`/api/notifications/${buyerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load notifications');
        setLoading(false);
        toast.error('Error loading notifications');
      }
    };

    fetchNotifications();
  }, [buyerId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.post(
        `/api/notifications/${buyerId}/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark notifications as read');
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
        {/* Notification Bell */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="relative flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          aria-label={`Notifications: ${unreadCount} unread`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto animate-fadeIn">
            {error && <div className="p-4 text-red-500 text-center">{error}</div>}
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                No notifications at this time
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-sm text-blue-500 hover:underline"
                    aria-label="Mark all notifications as read"
                  >
                    Mark All as Read
                  </button>
                </div>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 border-b border-gray-200 hover:bg-gray-100 transition-colors ${
                      notif.read ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{notif.icon || '🔔'}</span>
                      <div>
                        <p className="text-sm text-gray-700">{notif.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
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

BuyerNotificationCenter.propTypes = {
  buyerId: PropTypes.string.isRequired,
};

export default BuyerNotificationCenter;