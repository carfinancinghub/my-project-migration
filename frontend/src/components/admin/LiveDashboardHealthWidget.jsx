/**
 * File: LiveDashboardHealthWidget.jsx
 * Path: frontend/src/components/admin/LiveDashboardHealthWidget.jsx
 * Purpose: Admin widget to monitor Hauler-related endpoint health in real-time via /api/hauler/health
 * Author: Cod3 (05051700)
 * Date: May 05, 2025
 * 👑 Cod3 Crown Certified
 */

// --- Dependencies ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Component Definition ---
/**
 * LiveDashboardHealthWidget Component
 * Purpose: Displays real-time health status of Hauler-related endpoints for admin monitoring
 * Props: None
 * Returns: JSX element for health status display
 */
const LiveDashboardHealthWidget = () => {
  // --- State Management ---
  const [healthStatus, setHealthStatus] = useState({ status: 'unknown', endpoints: {} });
  const [lastUpdated, setLastUpdated] = useState(null);

  // --- API Integration ---
  /**
   * fetchHealthStatus
   * Purpose: Fetch health status from /api/hauler/health and update component state
   */
  const fetchHealthStatus = async () => {
    try {
      const response = await axios.get('/api/hauler/health');
      setHealthStatus(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      toast.error('Failed to fetch hauler health status');
      setHealthStatus({ status: 'error', endpoints: {} });
    }
  };

  // --- Polling Setup ---
  useEffect(() => {
    fetchHealthStatus(); // Initial fetch
    const interval = setInterval(fetchHealthStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // --- UI Rendering ---
  return (
    <div className="bg-white shadow-md rounded p-4 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">Hauler Health Status</h3>
      <p className="mb-3">
        <strong>Overall Status:</strong>{' '}
        <span className={`font-bold ${healthStatus.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>{healthStatus.status}</span>
      </p>
      <h4 className="font-medium">Endpoints:</h4>
      <ul className="list-disc ml-5">
        {Object.entries(healthStatus.endpoints).map(([endpoint, status]) => (
          <li key={endpoint} className={status === 'up' ? 'text-green-600' : 'text-red-600'}>
            {endpoint}: {status}
          </li>
        ))}
      </ul>
      {lastUpdated && <p className="mt-3 text-sm text-gray-500">Last Updated: {lastUpdated}</p>}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default LiveDashboardHealthWidget;
