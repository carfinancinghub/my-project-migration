// File: LenderMatchListView.js
// Path: frontend/src/components/lender/LenderMatchListView.js
// 👑 Cod1 Crown Certified — Lender Match List Display with Smart Sorting & Dynamic Filtering

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LenderMatchPreviewCard from './LenderMatchPreviewCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const LenderMatchListView = ({ filters }) => {
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLenders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/lender/matches`, {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        });
        setLenders(res.data);
      } catch (err) {
        console.error('Error fetching lender matches:', err);
        setError('❌ Failed to load lender matches');
      } finally {
        setLoading(false);
      }
    };
    fetchLenders();
  }, [filters]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;

  return (
    <div className="space-y-4" role="region" aria-label="Lender Matches List">
      {lenders.length === 0 ? (
        <p className="text-gray-500">No matching lenders found.</p>
      ) : (
        lenders.map(lender => (
          <LenderMatchPreviewCard key={lender._id} lender={lender} />
        ))
      )}
    </div>
  );
};

export default LenderMatchListView;
