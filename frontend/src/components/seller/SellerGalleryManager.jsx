/**
 * SellerGalleryManager.jsx
 * Path: frontend/src/components/seller/SellerGalleryManager.jsx
 * Purpose: Allow sellers to manage photo gallery for a car listing with upload and delete functionality.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerGalleryManager = () => {
  const { listingId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');

  // Fetch photos on mount
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view photos');
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get(/api/cars/${listingId}/photos, {
          headers: { Authorization: Bearer ${token} },
        });

        setPhotos(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load photos');
        toast.error('Error loading photos');
      }
    };

    fetchPhotos();
  }, [listingId]);

  // Handle photo URL upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!photoUrl) {
      toast.error('Please enter a photo URL');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to upload photos');
        setUploading(false);
        toast.error('Authentication required');
        return;
      }

      const response = await axios.post(
        /api/cars/${listingId}/photos,
        { url: photoUrl },
        {
          headers: { Authorization: Bearer ${token} },
        }
      );

      setPhotos((prev) => [...prev, response.data]);
      setPhotoUrl('');
      toast.success('Photo added successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add photo');
      toast.error('Error adding photo');
    } finally {
      setUploading(false);
    }
  };

  // Handle photo deletion
  const handleDelete = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to delete photos');
        toast.error('Authentication required');
        return;
      }

      await axios.delete(/api/cars/${listingId}/photos/${photoId}, {
        headers: { Authorization: Bearer ${token} },
      });

      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
      toast.success('Photo deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete photo');
      toast.error('Error deleting photo');
    }
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Listing Photos</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {/* Upload Form */}
          <form onSubmit={handleUpload} className="mb-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Enter photo URL"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="Photo URL"
            />
            <button
              type="submit"
              className={bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }}
              disabled={uploading}
              aria-label="Add photo"
            >
              {uploading ? <LoadingSpinner /> : 'Add Photo'}
            </button>
          </form>
          {/* Photo Grid */}
          {photos.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No photos uploaded yet. Add some to showcase your listing! 📷
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative bg-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow animate-fadeIn"
                  role="region"
                  aria-label={Photo: ${photo.url}}
                >
                  <img
                    src={photo.url}
                    alt="Listing photo"
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    aria-label={Delete photo ${photo.url}}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>
        {
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        }
      </style>
    </ErrorBoundary>
  );
};

export default SellerGalleryManager;