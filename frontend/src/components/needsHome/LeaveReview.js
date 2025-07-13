// File: LeaveReview.js
// Path: frontend/src/components/LeaveReview.js

import React, { useState } from 'react';
import axios from 'axios';
import './LeaveReview.css';

const LeaveReview = ({ userId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/${userId}/review`, { rating, comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Review submitted successfully');
      setComment('');
      setRating(5);
    } catch (err) {
      const msg = err.response?.data?.error || '❌ Failed to submit review';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="leave-review bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-sm">Rating (1–5)</label>
          <select
            className="border px-2 py-1 rounded w-full"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            {[5, 4, 3, 2, 1].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Comment</label>
          <textarea
            className="border px-3 py-2 rounded w-full h-24"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your thoughts..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>

        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default LeaveReview;
