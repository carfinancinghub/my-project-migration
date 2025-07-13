// File: InspectionSearchBar.js
// Path: frontend/src/components/inspections/InspectionSearchBar.js

import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';

const InspectionSearchBar = ({ onResults }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/inspection/search`, {
        query: search.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
      setError('❌ Could not find inspection reports');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-4">
      <input
        type="text"
        placeholder="Search by VIN, email, tag, or report ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded w-full"
        aria-label="Search Inspection Reports"
      />
      <Button type="submit">🔍 Search</Button>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </form>
  );
};

export default InspectionSearchBar;
