/**
 * SellerAuctionStarter.jsx
 * Path: frontend/src/components/seller/SellerAuctionStarter.jsx
 * Purpose: Enable sellers to start a new auction for a listing with customizable settings.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerAuctionStarter = () => {
  const { id: listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    startingPrice: '',
    reservePrice: '',
    durationDays: '3',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/seller/listings/${listingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListing(response.data);
        setFormData((prev) => ({
          ...prev,
          startingPrice: (response.data.price * 0.8).toFixed(0), // Suggest 80% of listing price
        }));
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load listing');
        setIsLoading(false);
        toast.error('Error loading listing');
      }
    };
    fetchListing();
  }, [listingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { startingPrice, reservePrice, durationDays } = formData;

    // Validation
    if (!startingPrice || startingPrice <= 0) {
      toast.error('Starting price must be greater than 0');
      return;
    }
    if (reservePrice && reservePrice < startingPrice) {
      toast.error('Reserve price must be greater than or equal to starting price');
      return;
    }
    if (!durationDays || durationDays < 1) {
      toast.error('Duration must be at least 1 day');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/seller/auctions/start',
        {
          listingId,
          startingPrice: Number(startingPrice),
          reservePrice: reservePrice ? Number(reservePrice) : null,
          durationDays: Number(durationDays),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Auction started successfully!');
      navigate('/seller/dashboard');
    } catch (err) {
      toast.error('Failed to start auction');
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !listing) return <div className="text-red-500 text-center py-8">{error || 'Listing not found'}</div>;

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Start Auction for {listing.carYear} {listing.carModel}</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div>
            <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700">
              Starting Price ($)
            </label>
            <input
              type="number"
              id="startingPrice"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Starting price for auction"
              required
            />
          </div>
          <div>
            <label htmlFor="reservePrice" className="block text-sm font-medium text-gray-700">
              Reserve Price ($) (Optional)
            </label>
            <input
              type="number"
              id="reservePrice"
              name="reservePrice"
              value={formData.reservePrice}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Reserve price for auction"
            />
          </div>
          <div>
            <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700">
              Auction Duration (Days)
            </label>
            <select
              id="durationDays"
              name="durationDays"
              value={formData.durationDays}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Auction duration in days"
              required
            >
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Link
              to="/seller/listings"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              aria-label="Cancel and return to listings"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              aria-label="Start auction"
            >
              Start Auction
            </button>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default SellerAuctionStarter;