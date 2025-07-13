// File: HaulerDashboard.js
// Path: frontend/src/components/hauler/HaulerDashboard.js
// 👑 Cod1 Crown Certified — Modern Hauler Dashboard with KPI Stats, GeoPanel, PDF Tool, Badge Tracker, and Navigation

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '@/utils/useAuth';
import AdminLayout from '../admin/layout/AdminLayout';
import HaulerReputationTracker from './HaulerReputationTracker';
import HaulerKPIStats from './HaulerKPIStats';
import GeoStatusPanel from './GeoStatusPanel';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';
import Card from '../common/Card';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const HaulerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const haulerId = localStorage.getItem('userId');
  const { role } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/transportation`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching transportation requests:', err);
        setError('❌ Failed to load transportation requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  const handleAcceptJob = async (requestId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/transportation/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/transportation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error accepting job:', err);
      setError('❌ Failed to accept job');
    }
  };

  const handleDownloadPDF = async (jobId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hauler/jobs/${jobId}/export-pdf`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DeliveryReport_${jobId}.pdf`;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('❌ Could not download delivery PDF.');
    }
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-6 justify-between items-start">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">🚚 Hauler Dashboard</h1>
              {/* Navigation Links */}
              <div className="flex flex-wrap gap-4">
                <Link to="/hauler/jobs" className="block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
                  View Delivery Jobs
                </Link>
                <Link to="/hauler/history" className="block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded">
                  Job History
                </Link>
                <Link to="/hauler/verify" className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
                  Verify Delivery
                </Link>
              </div>
              <HaulerKPIStats haulerId={haulerId} />
              <GeoStatusPanel />
            </div>
            <div className="w-full sm:w-80">
              <HaulerReputationTracker haulerId={haulerId} />
            </div>
          </div>

          {loading && <LoadingSpinner />}
          {error && <p className={theme.errorText}>{error}</p>}
          {!loading && !error && requests.length === 0 && (
            <p className="text-gray-500">No transportation requests available.</p>
          )}
          {!loading && !error && requests.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="grid">
              {requests.map((req) => (
                <Card key={req._id} className="hover:shadow-md">
                  <div className="space-y-2" role="gridcell">
                    <p className="text-sm text-gray-600">Request ID</p>
                    <p className="text-xl font-semibold">{req._id}</p>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="text-xl font-semibold">{req.destination}</p>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="text-xl font-semibold">{req.vehicle}</p>
                    <div className="flex gap-2 pt-2">
                      <Button variant="primary" onClick={() => handleAcceptJob(req._id)} aria-label={`Accept job ${req._id}`}>
                        Accept Job
                      </Button>
                      <Button variant="secondary" onClick={() => handleDownloadPDF(req._id)}>
                        📄 PDF
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">Current Role: <strong>{role}</strong></p>
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default HaulerDashboard;