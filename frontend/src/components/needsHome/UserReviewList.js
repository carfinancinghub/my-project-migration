// File: UserReviewList.js
// Path: frontend/src/components/UserReviewList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserReviewList.css';

const UserReviewList = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/users/${userId}/reviews`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(res.data);
      } catch (err) {
        const msg = err.response?.data?.error || '❌ Failed to fetch reviews';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchReviews();
  }, [userId]);

  return (
    <div className="user-review-list bg-white p-4 rounded shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-3">User Reviews</h3>

      {loading && <p className="text-gray-600">Loading reviews...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-gray-500">No reviews yet.</p>
      )}

      <ul className="space-y-3">
        {reviews.map((review) => (
          <li key={review._id} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium text-gray-800">
                {review.reviewer?.email || 'Anonymous'} ({review.reviewer?.role || 'User'})
              </div>
              <div className="text-yellow-500 font-bold text-sm">⭐ {review.rating}</div>
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserReviewList;
