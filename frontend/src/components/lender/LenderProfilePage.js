// File: LenderProfilePage.js
// Path: frontend/src/components/lender/LenderProfilePage.js
// 👑 Cod1 Crown Certified — Enhanced Lender Identity Viewer with Shareable Link, PDF Export & Admin Tools + Social Proof

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const LenderProfilePage = ({ lenderId, isAdmin = false }) => {
  const [lender, setLender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLenderProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/lender/${lenderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLender(res.data);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchLenderProfile();
  }, [lenderId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;

  return (
    <Card className="p-6 space-y-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🏦 {lender.companyName}</h2>
        <div className="space-x-2">
          <Button
            onClick={() => window.open(`/api/lenders/${lender._id}/export-pdf`, '_blank')}
            variant="secondary"
          >
            📄 Export PDF
          </Button>
          <Button
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/lender/${lender._id}`)}
            variant="secondary"
          >
            🔗 Copy Shareable Link
          </Button>
        </div>
      </div>

      <p><strong>License:</strong> {lender.licenseNumber}</p>
      <p><strong>Interest Rate Range:</strong> {lender.interestRateRange}%</p>
      <p><strong>Max Loan:</strong> ${lender.maxLoanAmount?.toLocaleString()}</p>
      <p><strong>Rating:</strong> {lender.rating} / 5 ⭐</p>
      <p><strong>Tags:</strong> {lender.tags?.join(', ') || 'N/A'}</p>
      <p><strong>Status:</strong> {lender.isOnline ? '🟢 Online' : '🕓 Offline'}</p>

      {lender.socialLinks && (
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">🔗 Connect With Us</h3>
          <div className="flex space-x-4 text-blue-600">
            {lender.socialLinks.twitter && (
              <a href={lender.socialLinks.twitter} target="_blank" rel="noopener noreferrer">X / Twitter</a>
            )}
            {lender.socialLinks.linkedin && (
              <a href={lender.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
            {lender.socialLinks.facebook && (
              <a href={lender.socialLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            )}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-md font-semibold mb-1">📋 Reviews</h3>
        {lender.reviews?.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {lender.reviews.map((review) => (
              <li key={review._id} className="border rounded p-2">
                <p><strong>{review.reviewer?.username}</strong>: {review.rating}/5</p>
                <p className="text-gray-600 italic">"{review.comment}"</p>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                {isAdmin && (
                  <div className="text-right mt-1">
                    <button className="text-red-500 text-xs">🗑️ Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        )}
      </div>
    </Card>
  );
};

export default LenderProfilePage;
