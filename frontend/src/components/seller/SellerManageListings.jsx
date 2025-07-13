/**
 * SellerManageListings.jsx
 * Path: frontend/src/components/seller/SellerManageListings.jsx
 * Purpose: Allow sellers to view, edit, and remove their car listings with a responsive, modern UI.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Mock data for initial development (optional)
const mockListings = [
  {
    id: '1',
    thumbnail: 'https://via.placeholder.com/150',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    price: 25000,
    status: 'Available',
  },
  {
    id: '2',
    thumbnail: 'https://via.placeholder.com/150',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    price: 22000,
    status: 'Sold',
  },
];

const SellerManageListings = ({ sellerId }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch listings on mount and when refreshTrigger changes
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view listings');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        // Replace with mock data if no backend
        // setListings(mockListings);
        // setLoading(false);
        // return;

        const response = await axios.get(`/api/cars/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setListings(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load listings');
        setLoading(false);
        toast.error('Error loading listings');
      }
    };

    fetchListings();
  }, [sellerId, refreshTrigger]);

  // Handle listing removal with confirmation
  const handleRemove = async (listingId) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.delete(`/api/cars/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRefreshTrigger((prev) => prev + 1);
      toast.success('Listing removed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove listing');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Listings</h2>
          <Link
            to="/seller/create-listing"
            className="fixed bottom-6 right-6 bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
            aria-label="Create new listing"
          >
            <span className="text-2xl">➕</span>
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {listings.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No listings found. Create your first listing! 🚗
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-gray-600">Thumbnail</th>
                    <th className="px-4 py-2 text-left text-gray-600">Car</th>
                    <th className="px-4 py-2 text-left text-gray-600">Price</th>
                    <th className="px-4 py-2 text-left text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="border-b hover:bg-gray-50 animate-fadeIn"
                    >
                      <td className="px-4 py-2">
                        <img
                          src={listing.thumbnail || 'https://via.placeholder.com/50'}
                          alt={`${listing.make} ${listing.model}`}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {listing.make} {listing.model} ({listing.year})
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        ${listing.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            listing.status === 'Available'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <Link
                          to={`/listing/${listing.id}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                          aria-label={`View listing ${listing.id}`}
                        >
                          View
                        </Link>
                        <Link
                          to={`/seller/edit-listing/${listing.id}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors"
                          aria-label={`Edit listing ${listing.id}`}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleRemove(listing.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                          aria-label={`Remove listing ${listing.id}`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

SellerManageListings.propTypes = {
  sellerId: PropTypes.string.isRequired,
};

export default SellerManageListings;