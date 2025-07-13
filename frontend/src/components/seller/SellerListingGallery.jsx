/**
 * SellerListingGallery.jsx
 * Path: frontend/src/components/seller/SellerListingGallery.jsx
 * Purpose: Display seller's active listings in a responsive card grid with edit/delete functionality.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Status badge color mapping
const statusStyles = {
  Active: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Sold: 'bg-gray-100 text-gray-800',
};

const SellerListingGallery = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/listings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Sort by createdAt descending (newest first) if available
        const sortedListings = response.data.sort((a, b) =>
          b.createdAt && a.createdAt ? new Date(b.createdAt) - new Date(a.createdAt) : 0
        );
        setListings(sortedListings);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load listings');
        setIsLoading(false);
        toast.error('Error loading listings');
      }
    };
    fetchListings();
  }, []);

  const handleDelete = async (_id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/seller/listings/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(listings.filter((listing) => listing._id !== _id));
        toast.success('Listing deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete listing');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Listings</h1>
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <img
              src="/empty-state-car.svg"
              alt="No listings"
              className="mx-auto h-32 w-32 mb-4 opacity-50"
            />
            <p className="text-gray-500 text-lg">No listings yet. Create your first listing!</p>
            <Link
              to="/seller/listings/new"
              className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Add New Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={listing.images[0] || '/placeholder-car.jpg'}
                  alt={`${listing.carModel} ${listing.carYear}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {listing.carModel} ({listing.carYear})
                    </h2>
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-medium ${
                        statusStyles[listing.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-lg font-medium mb-4">
                    ${listing.price.toLocaleString()}
                  </p>
                  <div className="flex justify-between gap-3">
                    <Link
                      to={`/seller/listings/${listing._id}/edit`}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-center"
                      aria-label={`Edit listing for ${listing.carModel} ${listing.carYear}`}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      aria-label={`Delete listing for ${listing.carModel} ${listing.carYear}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SellerListingGallery;