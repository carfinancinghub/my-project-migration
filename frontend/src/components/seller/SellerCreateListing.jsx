// File: SellerCreateListing.jsx
// Path: frontend/src/components/seller/SellerCreateListing.jsx
// Purpose: Allow sellers to create a new car listing with validated fields and upload
// 👑 Cod2 Crown Certified

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '@/components/common/Navbar.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx';
import { theme } from '@/styles/theme';

const SellerCreateListing = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    vin: '',
    mileage: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/seller/listings', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Listing created successfully!');
      navigate('/seller/listings');
    } catch (err) {
      console.error('Error creating listing:', err);
      toast.error('Failed to create listing');
      setError('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700">➕ Create New Car Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Make */}
          <div>
            <label className="block text-sm font-medium mb-1">Make *</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium mb-1">Model *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium mb-1">Year *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* VIN */}
          <div>
            <label className="block text-sm font-medium mb-1">VIN (Optional)</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Mileage */}
          <div>
            <label className="block text-sm font-medium mb-1">Mileage (Optional)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Add any important details about the car"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
          {error && <p className={theme.errorText}>{error}</p>}
          {loading && <LoadingSpinner />}
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default SellerCreateListing;
