/**
 * BuyerAISuggestionEngine.jsx
 * Path: frontend/src/components/buyer/BuyerAISuggestionEngine.jsx
 * Purpose: Suggest cars to buyers based on preferences and behavior in a responsive card grid.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const BuyerAISuggestionEngine = ({ buyerId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch suggestions
  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view suggestions');
        setLoading(false);
        toast.error('Authentication required');
        return;
      }

      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/buyer/${buyerId}/suggestions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuggestions(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load suggestions');
      setLoading(false);
      toast.error('Error loading suggestions');
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchSuggestions();
  }, [buyerId]);

  // Handle refresh button
  const handleRefresh = () => {
    fetchSuggestions();
    toast.info('Refreshing suggestions...');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Suggested Cars</h2>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            aria-label="Refresh car suggestions"
          >
            Refresh Suggestions
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {suggestions.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No suggestions yet. Update your preferences to see tailored cars! 🚗
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="bg-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow animate-fadeIn"
                  role="region"
                  aria-label={`Suggested car: ${suggestion.make} ${suggestion.model}`}
                >
                  <img
                    src={suggestion.imageUrl || 'https://via.placeholder.com/150'}
                    alt={`${suggestion.make} ${suggestion.model}`}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {suggestion.make} {suggestion.model} ({suggestion.year})
                  </h3>
                  <p className="text-sm text-gray-600">
                    Price: ${suggestion.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Match Score: {suggestion.matchScore}%
                  </p>
                  <p className="text-sm text-blue-500 font-medium mt-1">
                    {suggestion.suggestedAction}
                  </p>
                </div>
              ))}
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

BuyerAISuggestionEngine.propTypes = {
  buyerId: PropTypes.string.isRequired,
};

export default BuyerAISuggestionEngine;