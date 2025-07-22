// File: RateHaulerForm.js
// Path: frontend/src/components/buyer/RateHaulerForm.js
// 👑 Cod1 Crown Certified — Buyer Rating & Feedback Form for Hauler Performance

import React, { useState } from 'react';
import Button from '../../common/Button';

const RateHaulerForm = ({ jobId }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return alert('Please select a rating.');

    try {
      const res = await fetch(`/api/reviews/hauler/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ rating, feedback }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Review submission failed:', err);
      alert('Error submitting review.');
    }
  };

  if (submitted) {
    return <p className="text-green-600">✅ Thank you! Your rating has been submitted.</p>;
  }

  return (
    <div className="p-4 border rounded bg-gray-50 mt-6">
      <h3 className="text-lg font-semibold mb-2">⭐ Rate Your Hauler</h3>
      <div className="flex items-center space-x-2 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Optional feedback"
        className="w-full border rounded p-2 text-sm mb-3"
        rows={3}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      ></textarea>
      <Button variant="primary" onClick={handleSubmit}>Submit Review</Button>
    </div>
  );
};

export default RateHaulerForm;
