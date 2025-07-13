// File: MechanicInspectionDetail.js
// Path: frontend/src/components/mechanic/MechanicInspectionDetail.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../admin/layout/AdminLayout';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const MechanicInspectionDetail = () => {
  const { inspectionId } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Pending');
  const [file, setFile] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mechanic/inspections/${inspectionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInspection(res.data);
        setNotes(res.data.notes || '');
        setStatus(res.data.status || 'Pending');
      } catch (err) {
        setError('❌ Failed to load inspection');
      } finally {
        setLoading(false);
      }
    };
    fetchInspection();
  }, [inspectionId]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('notes', notes);
    formData.append('status', status);
    if (file) formData.append('file', file);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/mechanic/inspections/${inspectionId}/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ Inspection submitted successfully');
    } catch (err) {
      alert('❌ Failed to submit inspection');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🧰 Inspection Detail – {inspection?.car?.make} {inspection?.car?.model}</h1>

        <div className="space-y-4">
          <p><strong>VIN:</strong> {inspection?.car?.vin}</p>
          <p><strong>Year:</strong> {inspection?.car?.year}</p>
          <p><strong>Assigned By:</strong> {inspection?.assignedBy?.email}</p>

          <label className="block text-sm font-medium">Inspection Status</label>
          <select
            className="border p-2 rounded w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
          </select>

          <label className="block text-sm font-medium mt-2">Mechanic Notes</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe issues, recommendations, etc."
          />

          <label className="block text-sm font-medium mt-2">Upload Inspection File</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <Button onClick={handleSubmit} className="mt-4">
            Submit Inspection
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MechanicInspectionDetail;
