// File: HaulerJobStatus.js
// Path: frontend/src/components/hauler/HaulerJobStatus.js
// 👑 Cod1 Crown Certified — Advanced Hauler Delivery Tracker with Photos, GPS, Notes, and PDF Export

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const HaulerJobStatus = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hauler/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJob(res.data);
      } catch (err) {
        setError('Failed to load delivery job');
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId]);

  const handleProofSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/hauler/jobs/${jobId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Delivery marked complete. Awaiting buyer confirmation.');
    } catch (err) {
      console.error('Delivery confirmation failed:', err);
    }
  };

  const handleExportPdf = () => {
    window.open(`${process.env.REACT_APP_API_URL}/api/hauler/jobs/${jobId}/export-pdf`, '_blank');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;
  if (!job) return <p>No delivery job found.</p>;

  return (
    <div className="space-y-6 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold">🚚 Hauler Delivery Status</h2>

      <div className="text-sm text-gray-700">
        <p><strong>Pickup:</strong> {job.pickupLocation}</p>
        <p><strong>Drop-off:</strong> {job.dropoffLocation}</p>
        <p><strong>Status:</strong> {job.status}</p>
        <p><strong>Vehicle:</strong> {job.vehicle?.make} {job.vehicle?.model} ({job.vehicle?.year})</p>
        <p><strong>Hauler:</strong> {job.hauler?.name || 'N/A'}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">📸 Delivery Proof Photos</h3>
        <div className="grid grid-cols-2 gap-4">
          {job.photos?.map((url, i) => (
            <img key={i} src={url} alt={`Proof ${i + 1}`} className="rounded border" />
          )) || <p className="text-gray-500">No photos uploaded.</p>}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">📍 GeoPin Location</h3>
        <p className="text-gray-600">Coordinates: {job.geoPin || 'N/A'}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">📝 Hauler Notes</h3>
        <p className="text-gray-600 italic">{job.notes || 'No notes available.'}</p>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        {job.status === 'In Transit' && (
          <Button onClick={handleProofSubmit} variant="success">✅ Mark as Delivered</Button>
        )}
        <Button onClick={handleExportPdf} variant="primary">📄 Export PDF</Button>
      </div>

      {job.flagged && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-4">
          <p className="text-yellow-700 font-semibold">⚠️ This delivery has been flagged for review.</p>
          <p className="text-sm">Reason: {job.flaggedReason}</p>
          <Button
            variant="danger"
            onClick={() => window.location.href = `/disputes/start/${jobId}`}
          >
            🚧 Start Dispute
          </Button>
        </div>
      )}
    </div>
  );
};

export default HaulerJobStatus;
