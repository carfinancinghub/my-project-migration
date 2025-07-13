// File: StorageDashboard.js
// Path: frontend/src/components/StorageDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StorageDashboard = () => {
  const [storageRequests, setStorageRequests] = useState([]);

  useEffect(() => {
    const fetchStorageJobs = async () => {
      try {
        const res = await axios.get('/api/storage/jobs');
        setStorageRequests(res.data);
      } catch (err) {
        console.error('Failed to fetch storage jobs', err);
      }
    };
    fetchStorageJobs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Storage Provider Dashboard</h2>
      {storageRequests.length === 0 ? (
        <p>No pending storage jobs.</p>
      ) : (
        <ul className="space-y-4">
          {storageRequests.map((job) => (
            <li key={job._id} className="border rounded p-4">
              <p><strong>Vehicle:</strong> {job.vehicleId}</p>
              <p><strong>Duration:</strong> {job.duration} days</p>
              <p><strong>Requested by:</strong> {job.requestedBy}</p>
              <p><strong>Status:</strong> {job.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StorageDashboard;
