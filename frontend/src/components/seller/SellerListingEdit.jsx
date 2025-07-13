/**
 * SellerListingEdit.jsx
 * Path: frontend/src/components/seller/SellerListingEdit.jsx
 * Purpose: Allow sellers to edit an existing car listing with a clean, responsive form.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerListingEdit = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    status: 'Available',
    thumbnailUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch listing details on mount
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to edit listing');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get(`/api/cars/${listingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          make: response.data.make || '',
          model: response.data.model || '',
          year: response.data.year || '',
          price: response.data.price || '',
          status: response.data.status || 'Available',
          thumbnailUrl: response.data.thumbnailUrl || '',
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load listing');
        setLoading(false);
        toast.error('Error loading listing');
      }
    };

    fetchListing();
  }, [listingId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate fields
    if (!formData.make || !formData.model || !formData.year || !formData.price) {
      setError('All fields except Thumbnail URL are required');
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to edit listing');
        toast.error('Authentication required');
        return;
      }

      setLoading(true);
      await axios.put(`/api/cars/${listingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Listing updated successfully');
      navigate('/seller/manage-listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing');
      toast.error('Error updating listing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Listing</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                Make
              </label>
              <input
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                aria-label="Car make"
              />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                aria-label="Car model"
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                aria-label="Car year"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                aria-label="Car price"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                aria-label="Listing status"
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
            <div>
              <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700">
                Thumbnail URL (Optional)
              </label>
              <input
                type="text"
                id="thumbnailUrl"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                aria-label="Thumbnail URL"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
                aria-label="Save listing changes"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                to="/seller/manage-listings"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                aria-label="Cancel and return to manage listings"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SellerListingEdit;