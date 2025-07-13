// File: TransporterLiveTracking.js
// Path: frontend/src/components/hauler/TransporterLiveTracking.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/layout/AdminLayout';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const TransporterLiveTracking = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hauler/jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data);
      } catch (err) {
        console.error('Error loading transport jobs:', err);
        setError('❌ Failed to load transport jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleLocationPing = async (jobId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/hauler/jobs/${jobId}/location`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('📍 Location ping sent successfully!');
    } catch (err) {
      console.error('Failed to send location update:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🚚 Live Transport Tracker</h1>

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-gray-500">No active transport assignments.</p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <Card key={job._id}>
                <p className="text-sm text-gray-600">Vehicle:</p>
                <p className="font-bold">{job.car?.make} {job.car?.model} ({job.car?.year})</p>
                <p className="text-sm text-gray-600 mt-2">Pickup:</p>
                <p>{job.pickupLocation}</p>
                <p className="text-sm text-gray-600 mt-2">Delivery:</p>
                <p>{job.deliveryLocation}</p>
                <p className="text-sm text-gray-600 mt-2">Status:</p>
                <p className="font-semibold">{job.status}</p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => handleLocationPing(job._id)}
                >
                  Send Location Ping
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TransporterLiveTracking;
