// File: EscrowTransactionSearch.jsx
// Path: frontend/src/components/escrow/EscrowTransactionSearch.jsx
// Author: Cod2 Crown Certified (05072023)
// Purpose: Allows escrow officers to search and filter transactions by ID, status, and date.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const EscrowTransactionSearch = ({ onResults }) => {
  const [query, setQuery] = useState({ transactionId: '', status: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/escrow/search', query, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onResults(response.data);
    } catch (err) {
      setError('Failed to search transactions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6">
      <h3 className="text-xl font-bold mb-4 text-indigo-700">🔎 Search Escrow Transactions</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="transactionId"
          value={query.transactionId}
          onChange={handleInputChange}
          placeholder="Transaction ID"
          className="input"
        />

        <select
          name="status"
          value={query.status}
          onChange={handleInputChange}
          className="input"
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="Released">Released</option>
          <option value="Refunded">Refunded</option>
          <option value="On Hold">On Hold</option>
        </select>

        <input
          type="date"
          name="date"
          value={query.date}
          onChange={handleInputChange}
          className="input"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={handleSearch} className="btn bg-blue-600 hover:bg-blue-700 text-white">
          Search
        </button>
      </div>

      {loading && <div className="mt-4"><LoadingSpinner /></div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

EscrowTransactionSearch.propTypes = {
  onResults: PropTypes.func.isRequired
};

export default EscrowTransactionSearch;
