// File: BidDetailViewer.js
// Path: frontend/src/components/lender/BidDetailViewer.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../common/Card';
import LoadingSpinner from '../../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const BidDetailViewer = ({ bidId }) => {
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bids/${bidId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBid(res.data);
      } catch (err) {
        console.error('Error loading bid details:', err);
        setError('❌ Failed to load bid details');
      } finally {
        setLoading(false);
      }
    };
    fetchBidDetails();
  }, [bidId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;
  if (!bid) return null;

  return (
    <Card className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Bid Details</h2>
      <p><strong>Status:</strong> {bid.status}</p>
      <p><strong>Amount:</strong> ${bid.amount}</p>
      <p><strong>Submitted:</strong> {new Date(bid.createdAt).toLocaleString()}</p>
      <p><strong>Lender:</strong> {bid.lender?.email || 'N/A'}</p>
      <p><strong>Loan ID:</strong> {bid.loanId}</p>
      <p><strong>Term Length:</strong> {bid.termLength || 'N/A'}</p>
      <p><strong>Interest Rate:</strong> {bid.interestRate || 'N/A'}%</p>
      <p><strong>AI Rating:</strong> ⭐ {bid.aiScore || 'N/A'} / 5</p>
      <p className="text-sm text-gray-500 italic">AI score is based on financial history, risk profile, and collateral strength.</p>
    </Card>
  );
};

export default BidDetailViewer;
