// File: SellerViewListing.jsx
// Path: frontend/src/components/seller/SellerViewListing.jsx
// Purpose: Display a single seller listing with detailed car information, image gallery, and action buttons.
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx';

const SellerViewListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/seller/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListing(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load listing');
        setIsLoading(false);
        toast.error('Error loading listing');
      }
    };
    fetchListing();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !listing) return <div className="text-red-500 text-center py-8">{error || 'Listing not found'}</div>;

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <img
            src={listing.images?.[0] || '/placeholder-car.jpg'}
            alt={`${listing.carModel} ${listing.carYear}`}
            className="w-full h-64 object-cover"
          />
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {listing.carYear} {listing.carModel}
              </h1>
              <div className="flex gap-3">
                <Link
                  to={`/seller/listings/${id}/edit`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  aria-label={`Edit listing for ${listing.carModel} ${listing.carYear}`}
                >
                  Edit Listing
                </Link>
                <Link
                  to="/seller/listings"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  aria-label="Back to listings"
                >
                  Back
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-600">
                <span className="font-semibold">Price:</span> ${listing.price.toLocaleString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Status:</span>{' '}
                <span className="text-blue-600">{listing.status}</span>
              </p>
              {listing.mileage && (
                <p className="text-gray-600">
                  <span className="font-semibold">Mileage:</span> {listing.mileage.toLocaleString()} miles
                </p>
              )}
              {listing.vin && (
                <p className="text-gray-600">
                  <span className="font-semibold">VIN:</span> {listing.vin}
                </p>
              )}
              {listing.conditionGrade && (
                <p className="text-gray-600">
                  <span className="font-semibold">Condition:</span> {listing.conditionGrade}
                </p>
              )}
              {listing.createdAt && (
                <p className="text-gray-600">
                  <span className="font-semibold">Listed on:</span> {new Date(listing.createdAt).toLocaleDateString()}
                </p>
              )}
              {listing.tags?.length > 0 && (
                <p className="text-gray-600">
                  <span className="font-semibold">Tags:</span> {listing.tags.join(', ')}
                </p>
              )}
            </div>

            {listing.images?.length > 1 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Image Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {listing.images.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Image ${index + 1} of ${listing.carModel}`}
                      className="h-32 w-full object-cover rounded-lg shadow"
                    />
                  ))}
                </div>
              </div>
            )}

            {listing.description && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SellerViewListing;
