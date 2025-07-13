// File: HaulerJobReview.js
// Path: frontend/src/components/hauler/HaulerJobReview.js
// 👑 Cod1 Crown Certified — Hauler Delivery Review Panel with Smart AI Analysis

import React, { useEffect, useState } from 'react';
import Button from '../../common/Button';

const HaulerJobReview = ({ job }) => {
  const [aiReview, setAiReview] = useState(null);

  useEffect(() => {
    const fetchAIReview = async () => {
      try {
        const res = await fetch(`/api/hauler/jobs/${job._id}/ai-review`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setAiReview(data);
      } catch (err) {
        console.error('Failed to load AI Review:', err);
      }
    };
    fetchAIReview();
  }, [job._id]);

  return (
    <div className="p-6 space-y-6 bg-white shadow rounded border">
      <h2 className="text-2xl font-bold">🚚 Hauler Job Review</h2>
      <p className="text-gray-600">Job ID: <span className="font-mono">{job._id}</span></p>

      {/* SMART AI REVIEW */}
      {aiReview && (
        <div className="p-4 border-l-4 rounded border-blue-500 bg-blue-50">
          <h3 className="font-semibold text-blue-800">🤖 Smart Review Summary</h3>
          <p className="text-sm mb-2 text-blue-700">{aiReview.status}</p>
          <ul className="list-disc ml-5 text-sm text-gray-700">
            {aiReview.insights.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-md mb-2">📦 Delivery Status</h3>
        <p className="text-gray-800">{job.status}</p>
      </div>

      <div>
        <h3 className="font-semibold text-md mb-2">📍 GeoPin</h3>
        <p className="text-gray-800">{job.geoPin || 'No location recorded'}</p>
      </div>

      <div>
        <h3 className="font-semibold text-md mb-2">🖼️ Photos</h3>
        {job.photos?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {job.photos.map((url, i) => (
              <img key={i} src={url} alt={`Proof ${i + 1}`} className="w-full h-32 object-cover rounded border" />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No photos uploaded.</p>
        )}
      </div>

      <div className="pt-4 border-t mt-6">
        <Button
          variant="danger"
          onClick={() => window.location.href = `/disputes/start/${job._id}`}
        >
          🚩 Flag for Dispute
        </Button>
      </div>
    </div>
  );
};

export default HaulerJobReview;
