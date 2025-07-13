/**
 * SellerReviewSummary.jsx
 * Path: frontend/src/components/seller/SellerReviewSummary.jsx
 * Purpose: Summarize buyer reviews for the seller with rating breakdown, average score, and optional filter.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerReviewSummary = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRating, setFilterRating] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/reviews', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load reviews');
        setIsLoading(false);
        toast.error('Error loading reviews');
      }
    };
    fetchReviews();
  }, []);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Review Summary</h1>

        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <div className="text-xl font-semibold text-gray-700">
            ⭐ Average Rating: {averageRating}/5
          </div>
          <div className="flex gap-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-1 rounded-full ${
                  filterRating === rating ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {rating}★
              </button>
            ))}
            {filterRating && (
              <button
                onClick={() => setFilterRating(null)}
                className="text-sm text-red-500 underline"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="text-gray-500">No reviews found for this filter.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between mb-2">
                  <div className="font-semibold">{review.buyerName}</div>
                  <div className="text-yellow-500">
                    {'★'.repeat(review.rating)}{' '}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SellerReviewSummary;
