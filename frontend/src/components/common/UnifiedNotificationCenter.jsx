/**
 * UnifiedNotificationCenter.jsx
 * Path: frontend/src/components/common/UnifiedNotificationCenter.jsx
 * Purpose: Display a notification bell with a dropdown of recent alerts for buyers, sellers, admins, and mechanics.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const POLL_INTERVAL = 60 * 1000; // 60 seconds

const UnifiedNotificationCenter = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view notifications');
        setLoading(false);
        toast.error('Authentication required');
        return;
      }

      abortControllerRef.current = new AbortController();
      const response = await axios.get(`/api/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: abortControllerRef.current.signal,
      });

      setNotifications(response.data || []);
      setLoading(false);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Cannot load notifications');
      setLoading(false);
      toast.error('Error loading notifications');
    }
  };

  // Fetch on mount and poll every 60 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userId]);

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

  // Mark notification as read (client-side)
  const handleMarkAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
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
            <div className="p-4 text-gray-500 text-center">No new notifications. ✨</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`p-3 hover:bg-gray-100 transition-colors cursor-pointer ${
                    notif.read ? 'opacity-75' : 'font-bold'
                  }`}
                  role="listitem"
                  aria-label={`Notification: ${notif.message}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">{notif.message}</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        notif.type === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : notif.type === 'warning'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {notif.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

UnifiedNotificationCenter.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UnifiedNotificationCenter;