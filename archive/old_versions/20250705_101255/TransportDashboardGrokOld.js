// File: TransportDashboard.js
// Path: frontend/src/components/hauler/TransportDashboard.js

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TransportDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hauler/jobs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setJobs)
      .catch((err) => console.error('Failed to fetch hauler jobs:', err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>🚚 Hauler Job Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobs.length === 0 ? (
            <p className="text-gray-500">No assigned jobs.</p>
          ) : (
            jobs.map((job, idx) => (
              <div key={idx} className="p-4 border rounded bg-white shadow-sm">
                <p><strong>Car:</strong> {job.carMake} {job.carModel} ({job.year})</p>
                <p><strong>Pickup:</strong> {job.pickupLocation}</p>
                <p><strong>Dropoff:</strong> {job.dropoffLocation}</p>
                <p><strong>Status:</strong> {job.status}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportDashboard;
