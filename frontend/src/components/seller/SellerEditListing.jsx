// File: SellerEditListing.jsx
// Path: frontend/src/components/seller/SellerEditListing.jsx
// Purpose: Allow sellers to edit an existing car listing with live field updates and validations
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx';
import Input from '@/components/common/Input.jsx';
import Button from '@/components/common/Button.jsx';
import { theme } from '@/styles/theme';

const SellerEditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load existing listing on mount
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`/api/seller/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching listing:', err);
        toast.error('❌ Failed to load listing');
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.patch(`/api/seller/listings/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Listing updated successfully!');
      navigate(`/seller/listings/${id}`);
    } catch (err) {
      console.error('Error updating listing:', err);
      toast.error('❌ Failed to update listing');
      setError('Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">✏️ Edit Car Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Make" name="make" value={formData.make || ''} onChange={handleChange} required />
          <Input label="Model" name="model" value={formData.model || ''} onChange={handleChange} required />
          <Input label="Year" name="year" type="number" value={formData.year || ''} onChange={handleChange} required />
          <Input label="Price ($)" name="price" type="number" value={formData.price || ''} onChange={handleChange} required />
          <Input label="Mileage" name="mileage" type="number" value={formData.mileage || ''} onChange={handleChange} />
          <Input label="VIN" name="vin" value={formData.vin || ''} onChange={handleChange} />
          <Input label="Location" name="location" value={formData.location || ''} onChange={handleChange} />
          <Input label="Condition Grade" name="conditionGrade" value={formData.conditionGrade || ''} onChange={handleChange} placeholder="Excellent, Good, Fair, Poor" />
          <Input label="Tags (comma-separated)" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''} onChange={handleChange} />
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded px-3 py-2"
              placeholder="Add details about the vehicle condition, upgrades, issues, etc."
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
          {error && <p className={theme.errorText}>{error}</p>}
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default SellerEditListing;