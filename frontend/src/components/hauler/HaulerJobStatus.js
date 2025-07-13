// File: HaulerJobStatus.js
// Path: frontend/src/components/hauler/HaulerJobStatus.js

import React from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '@/utils/useAuth';
import Button from '@/components/common/Button';
import Navbar from '@/components/common/Navbar';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const HaulerJobStatus = () => {
  const { token } = useAuth();
  const { jobId } = useParams();

  // Placeholder for data fetch
  const job = {
    id: jobId,
    status: 'In Transit',
    origin: 'Los Angeles, CA',
    destination: 'Austin, TX',
    estimatedDelivery: '2025-04-25',
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📦 Delivery Job Status</h1>
        <div className="bg-white shadow rounded p-4">
          <p><strong>Job ID:</strong> {job.id}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>From:</strong> {job.origin}</p>
          <p><strong>To:</strong> {job.destination}</p>
          <p><strong>Estimated Delivery:</strong> {job.estimatedDelivery}</p>
        </div>

        <div className="mt-6 flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700 text-white">Mark as Delivered</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">Flag Issue</Button>
        </div>
      </div>
    </div>
  );
};

export default HaulerJobStatus;
