// File: FeedbackForm.jsx
// Path: C:\CFH\frontend\src\components\common\FeedbackForm.jsx
// Purpose: Allow users to submit feedback on auctions
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/operational

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { submitFeedback } from '@services/api/operational';

const FeedbackForm = ({ userId, auctionId }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await submitFeedback(userId, auctionId, rating, comments);
      setSuccess('Feedback submitted successfully!');
      setRating(0);
      setComments('');
      logger.info(`[FeedbackForm] Submitted feedback for userId: ${userId}, auctionId: ${auctionId}`);
    } catch (err) {
      logger.error(`[FeedbackForm] Failed to submit feedback for userId ${userId}: ${err.message}`, err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Submit Feedback</h3>
      {error && <div className="p-2 text-red-600 bg-red-100 border border-red-300 rounded-md mb-2" role="alert">{error}</div>}
      {success && <div className="p-2 text-green-600 bg-green-100 border border-green-300 rounded-md mb-2">{success}</div>}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter rating"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Comments</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your feedback"
            rows="3"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
};

FeedbackForm.propTypes = {
  userId: PropTypes.string.isRequired,
  auctionId: PropTypes.string.isRequired
};

export default FeedbackForm;