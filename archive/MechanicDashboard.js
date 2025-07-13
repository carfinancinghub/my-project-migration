// File: MechanicDashboard.js
// Path: frontend/src/components/mechanic/MechanicDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/layout/AdminLayout';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const MechanicDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mechanic/jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data);
      } catch (err) {
        console.error('Error loading inspection jobs:', err);
        setError('❌ Failed to fetch inspection jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleMarkInspected = async (jobId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/mechanic/jobs/${jobId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (err) {
      console.error('Error completing inspection:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🛠️ Mechanic Dashboard</h1>

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-gray-500">No current inspection jobs.</p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job._id}>
                <p className="text-sm text-gray-600">Vehicle:</p>
                <p className="font-semibold">{job.car?.make} {job.car?.model} ({job.car?.year})</p>

                <p className="text-sm text-gray-600 mt-2">Owner:</p>
                <p>{job.owner?.email || 'N/A'}</p>

                <p className="text-sm text-gray-600 mt-2">Requested Date:</p>
                <p>{new Date(job.scheduledAt).toLocaleString()}</p>

                <p className="text-sm text-gray-600 mt-2">Service Notes:</p>
                <p className="text-xs text-gray-800 italic">{job.notes || 'No additional notes provided.'}</p>

                {job.photoUrl && (
                  <img src={job.photoUrl} alt="Inspection" className="mt-2 rounded shadow w-full object-cover" />
                )}

                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => handleMarkInspected(job._id)}
                >
                  ✅ Mark Inspected
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MechanicDashboard;
