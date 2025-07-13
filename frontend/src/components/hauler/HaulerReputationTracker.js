// File: HaulerReputationTracker.js
// Path: frontend/src/components/hauler/HaulerReputationTracker.js
// 👑 Cod1 Crown Certified — Visual Reputation Profile for Hauler Trust System

import React, { useEffect, useState } from 'react';

const HaulerReputationTracker = ({ haulerId }) => {
  const [reputation, setReputation] = useState(null);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        const res = await fetch(`/api/reputation/hauler/${haulerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setReputation(data);
      } catch (err) {
        console.error('Failed to load reputation:', err);
      }
    };
    fetchReputation();
  }, [haulerId]);

  const renderBadge = (avg) => {
    if (avg >= 4.5) return <span className="text-yellow-500">🏅 Gold Badge</span>;
    if (avg >= 3.5) return <span className="text-gray-500">🥈 Silver Badge</span>;
    if (avg >= 2.5) return <span className="text-orange-400">🥉 Bronze Badge</span>;
    return <span className="text-red-400">⚠️ Needs Improvement</span>;
  };

  if (!reputation) return <p className="text-gray-400">Loading reputation data...</p>;

  return (
    <div className="p-4 bg-white border rounded shadow text-sm">
      <h3 className="text-lg font-bold mb-2">📈 Hauler Reputation</h3>
      <p className="text-gray-700 mb-1">Total Reviews: {reputation.totalReviews}</p>
      <p className="text-gray-700 mb-1">Average Rating: <strong>{reputation.averageRating}</strong> ⭐</p>
      <p className="text-sm font-semibold">🏆 Status: {renderBadge(reputation.averageRating)}</p>

      <h4 className="mt-3 text-md font-semibold">📝 Recent Ratings</h4>
      <ul className="text-sm list-disc ml-5 mt-2 space-y-1">
        {reputation.recentRatings.map((r, i) => (
          <li key={i}>
            <span className="text-yellow-600">{r.rating}⭐</span> — {r.feedback || 'No comment'}
            <span className="block text-gray-400 text-xs">{new Date(r.submittedAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HaulerReputationTracker;
