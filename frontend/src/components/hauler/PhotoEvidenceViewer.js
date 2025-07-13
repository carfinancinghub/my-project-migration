// File: PhotoEvidenceViewer.js
// Path: frontend/src/components/hauler/PhotoEvidenceViewer.js
// 👑 Cod1 Crown Certified — Hauler Photo Evidence Viewer with Timestamp, AI Tag Support, and Secure Preview

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const PhotoEvidenceViewer = ({ deliveryId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/utils/photos/${deliveryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPhotos(res.data);
      } catch (err) {
        console.error('Error fetching photo evidence:', err);
        setError('Failed to load delivery photo evidence.');
      } finally {
        setLoading(false);
      }
    };
    if (deliveryId) fetchPhotos();
  }, [deliveryId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;
  if (photos.length === 0) return <p className="text-gray-500">No photo evidence submitted yet.</p>;

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">📸 Photo Evidence</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo._id}
            className="border p-2 rounded bg-gray-50 hover:shadow"
            aria-label="Delivery Photo"
          >
            <img
              src={photo.url}
              alt={`Delivery Proof taken at ${new Date(photo.timestamp).toLocaleString()}`}
              className="rounded w-full h-48 object-cover"
            />
            <p className="text-sm mt-2 text-gray-600">
              <strong>Timestamp:</strong> {new Date(photo.timestamp).toLocaleString()}
            </p>
            {photo.tags?.length > 0 && (
              <p className="text-xs text-indigo-600 mt-1 italic">
                Tags: {photo.tags.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoEvidenceViewer;
