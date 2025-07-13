// File: BuyerDeliveryConfirmation.js
// Path: frontend/src/components/buyer/BuyerDeliveryConfirmation.js
// 👑 Cod1 Crown Certified — Buyer Delivery Confirmation & Dispute Module

import React, { useEffect, useState } from 'react';
import Button from '../../common/Button';

const BuyerDeliveryConfirmation = ({ job }) => {
  const [aiReview, setAiReview] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const fetchAIReview = async () => {
      try {
        const res = await fetch(`/api/hauler/jobs/${job._id}/ai-review`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setAiReview(data);
      } catch (err) {
        console.error('AI Review fetch failed:', err);
      }
    };
    fetchAIReview();
  }, [job._id]);

  const handleConfirm = () => {
    setConfirmed(true);
    alert('✅ Delivery confirmed. Thank you!');
    // TODO: API PATCH call to mark delivery as accepted
  };

  const handleFlag = () => {
    alert('🚩 Issue reported. Our team will follow up.');
    // TODO: API PATCH call to flag delivery for admin
  };

  return (
    <div className="space-y-6 p-6 bg-white shadow rounded border">
      <h2 className="text-xl font-bold">📦 Delivery Review</h2>
      <p className="text-gray-600">Please review the delivered vehicle before confirming acceptance.</p>

      {/* AI Review Summary */}
      {aiReview && (
        <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-800">🤖 AI Smart Review</h3>
          <p className="text-sm text-blue-700 mb-2">{aiReview.status}</p>
          <ul className="list-disc ml-6 text-sm text-gray-800">
            {aiReview.insights.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>
      )}

      {/* Photo Evidence */}
      <div>
        <h3 className="text-md font-semibold">🖼️ Delivery Photos</h3>
        {job.photos?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {job.photos.map((url, i) => (
              <img key={i} src={url} alt={`Photo ${i + 1}`} className="rounded border h-32 w-full object-cover" />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No photos available.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 pt-4 border-t">
        <Button variant="primary" onClick={handleConfirm} disabled={confirmed}>
          ✅ Confirm Delivery
        </Button>

        <Button variant="danger" onClick={handleFlag}>
          🚩 Report an Issue
        </Button>

        <Button variant="default" onClick={() => window.open(`/api/hauler/jobs/${job._id}/export-pdf`, '_blank')}>
          📄 View Delivery Report
        </Button>
      </div>
    </div>
  );
};

export default BuyerDeliveryConfirmation;
