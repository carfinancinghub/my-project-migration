/**
 * EscrowStatusNotifier.jsx
 * Path: frontend/src/components/escrow/EscrowStatusNotifier.jsx
 * Purpose: Monitor escrow transactions and alert officers to critical issues via a notification bell and dropdown.
 * 👑 Crown Pyramid Escrow System
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes
const PENDING_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 days
const ESCALATION_THRESHOLD = 48 * 60 * 60 * 1000; // 48 hours
const CONDITIONS_THRESHOLD = 5 * 24 * 60 * 60 * 1000; // 5 days

const EscrowStatusNotifier = () => {
  const [warnings, setWarnings] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasNewWarnings, setHasNewWarnings] = useState(false);
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchEscrowData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view escrow alerts');
        navigate('/login');
        return;
      }

      abortControllerRef.current = new AbortController();
      const response = await axios.get('/api/escrow-transactions', {
        headers: { Authorization: `Bearer ${token}` },
        signal: abortControllerRef.current.signal,
      });

      const newWarnings = [];
      const now = new Date();

      response.data.forEach((escrow) => {
        const createdAt = new Date(escrow.createdAt);
        const escalatedAt = escrow.escalatedAt ? new Date(escrow.escalatedAt) : null;
        const timeSinceCreation = now - createdAt;
        const timeSinceEscalation = escalatedAt ? now - escalatedAt : 0;

        // Check pending > 7 days
        if (escrow.status === 'pending' && timeSinceCreation > PENDING_THRESHOLD) {
          newWarnings.push({
            id: escrow.id,
            message: `Escrow ${escrow.id} pending > 7 days`,
          });
        }

        // Check escalated > 48 hours
        if (escrow.status === 'escalated' && timeSinceEscalation > ESCALATION_THRESHOLD) {
          newWarnings.push({
            id: escrow.id,
            message: `Escrow ${escrow.id} escalated > 48 hours`,
          });
        }

        // Check unmet conditions > 5 days
        const hasUnmetConditions = escrow.conditions.some((condition) => !condition.met);
        if (hasUnmetConditions && timeSinceCreation > CONDITIONS_THRESHOLD) {
          newWarnings.push({
            id: escrow.id,
            message: `Escrow ${escrow.id} has unmet conditions > 5 days`,
          });
        }
      });

      // Trigger pulse animation if new warnings appear
      if (newWarnings.length > warnings.length) {
        setHasNewWarnings(true);
        setTimeout(() => setHasNewWarnings(false), 2000); // Reset after 2s
      }

      setWarnings(newWarnings);
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error(err.response?.data?.message || 'Failed to fetch escrow alerts');
      }
    }
  };

  // Polling effect
  useEffect(() => {
    fetchEscrowData(); // Initial fetch
    const interval = setInterval(fetchEscrowData, POLL_INTERVAL);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleRefresh = () => {
    fetchEscrowData();
    toast.info('Checking for new escrow alerts...');
  };

  return (
    <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`relative flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors ${
          hasNewWarnings ? 'animate-pulse' : ''
        }`}
        aria-label={`Escrow alerts: ${warnings.length} warnings`}
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
        {warnings.length > 0 && (
          <span className="absolute -top-1 -right-1   bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {warnings.length}
          </span>
        )}
      </button>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="absolute top-12 right-0 bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-sm hover:bg-gray-300 transition-colors"
        aria-label="Refresh escrow alerts"
      >
        Refresh
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto">
          {warnings.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No alerts at this time
            </div>
          ) : (
            warnings.map((warning) => (
              <div
                key={warning.id}
                className="p-3 border-b border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm text-gray-700">{warning.message}</p>
              </div>
            ))
        )}
      </div>
    )}
    <style>
      {`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 0.5s ease-in-out 3;
        }
      `}
    </style>
  </div>
);
};

export default EscrowStatusNotifier;