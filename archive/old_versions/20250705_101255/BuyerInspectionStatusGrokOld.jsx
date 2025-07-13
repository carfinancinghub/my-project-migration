// File: BuyerInspectionStatus.js
// Path: frontend/src/components/buyer/BuyerInspectionStatus.js
// 👑 Cod1 Crown Certified — Enhanced Buyer Inspection Status Tracker with PDF Export, Escrow Redirect, 360° VR Viewer, and Dispute Assistance

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';
import VRViewer from '../VRViewer';

const BuyerInspectionStatus = ({ inspectionId }) => {
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVR, setShowVR] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/inspections/${inspectionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInspection(res.data);
      } catch (err) {
        console.error('Error fetching inspection:', err);
        setError('❌ Failed to load inspection data');
      } finally {
        setLoading(false);
      }
    };
    if (inspectionId) fetchInspection();
  }, [inspectionId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;
  if (!inspection) return <p className="text-gray-500">Inspection not found.</p>;

  const {
    carMake,
    carModel,
    carYear,
    checklist,
    status,
    mechanicNotes,
    flagged,
    flaggedReason,
    updatedAt,
    carId,
    vrAssets = []
  } = inspection;

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🔍 Inspection Status</h2>
        <div className="space-x-2">
          <Button
            onClick={() => window.open(`/api/inspections/${inspectionId}/export-pdf`, '_blank')}
            variant="secondary"
          >
            📄 Download Report
          </Button>
          <Button
            onClick={() => window.location.href = `/escrow/funding/${carId}`}
            variant="success"
          >
            💸 Proceed to Funding
          </Button>
        </div>
      </div>

      <div className="text-gray-700">
        <p><strong>Vehicle:</strong> {carYear} {carMake} {carModel}</p>
        <p><strong>Current Status:</strong> {status}</p>
        <p><strong>Last Updated:</strong> {new Date(updatedAt).toLocaleString()}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">🔩 Inspection Checklist</h3>
        <ul className="list-disc pl-5 text-sm text-gray-800">
          {checklist?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">📝 Mechanic Notes</h3>
        <p className="text-gray-600 italic">{mechanicNotes || 'No notes provided.'}</p>
      </div>

      {flagged && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mt-4">
          <p className="text-yellow-700 font-semibold">⚠️ This inspection has been flagged.</p>
          <p className="text-sm">Reason: {flaggedReason}</p>
          <div className="mt-2">
            <Button
              variant="danger"
              onClick={() => window.location.href = `/disputes/start/${inspectionId}`}
            >
              🛠️ Open Dispute
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setShowVR(!showVR)}
        >
          🌀 {showVR ? 'Hide' : 'View'} 360° VR Tour
        </Button>
        {showVR && (
          <div className="mt-4 border rounded p-4">
            {vrAssets.length > 0 ? (
              <VRViewer assets={vrAssets} />
            ) : (
              <p className="text-gray-500 italic">No 360° assets available for this vehicle yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerInspectionStatus;
