// File: LenderReputationTracker.js
// Path: frontend/src/components/lender/LenderReputationTracker.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../common/Card';
import { theme } from '../../styles/theme';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const LenderReputationTracker = ({ lenderId }) => {
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/lender-reputation/${lenderId}`
        );
        setReputation(res.data);
      } catch (err) {
        console.error('Error fetching lender reputation:', err);
        setError('❌ Failed to load lender reputation');
      } finally {
        setLoading(false);
      }
    };
    fetchReputation();
  }, [lenderId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <p className={theme.errorText}>{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 shadow border bg-white rounded-xl" role="region" aria-label="Lender Reputation">
        <h3 className="text-lg font-semibold mb-2">Lender Reputation</h3>
        {// File: LenderReputationTracker.js
// Path: frontend/src/components/lender/LenderReputationTracker.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../common/Card';
import { theme } from '../../styles/theme';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const LenderReputationTracker = ({ lenderId }) => {
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/lender-reputation/${lenderId}`
        );
        setReputation(res.data);
      } catch (err) {
        console.error('Error fetching lender reputation:', err);
        setError('❌ Failed to load lender reputation');
      } finally {
        setLoading(false);
      }
    };
    fetchReputation();
  }, [lenderId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <p className={theme.errorText}>{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 shadow border bg-white rounded-xl" role="region" aria-label="Lender Reputation">
        <h3 className="text-lg font-semibold mb-2">Lender Reputation</h3>
        {reputation ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Average Rating:</p>
              <p className="text-xl font-semibold flex items-center gap-1">
                {reputation.rating.toFixed(1)} / 5
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              </p>
            </div>
            <p className="text-sm text-gray-600">Total Reviews</p>
            <p className="text-lg font-medium">{reputation.reviews.length}</p>
            <p className="text-sm text-gray-600">Disputes</p>
            <p className="text-lg font-medium">{reputation.disputes.length}</p>
            <div className="mt-4">
              <h4 className="text-md font-medium">Recent Reviews</h4>
              <ul className="space-y-2 mt-2" role="list">
                {reputation.reviews.slice(0, 3).map((review) => (
                  <li key={review._id} className="border-b pb-2">
                    <p className="text-sm">
                      <strong>{review.reviewer.username}</strong>: {review.rating}/5
                    </p>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No reputation data available.</p>
        )}
      </Card>
    </motion.div>
  );
};

export default LenderReputationTracker;
reputation ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Average Rating:</p>
              <p className="text-xl font-semibold flex items-center gap-1">
                {reputation.rating.toFixed(1)} / 5
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              </p>
            </div>
            <p className="text-sm text-gray-600">Total Reviews</p>
            <p className="text-lg font-medium">{reputation.reviews.length}</p>
            <p className="text-sm text-gray-600">Disputes</p>
            <p className="text-lg font-medium">{reputation.disputes.length}</p>
            <div className="mt-4">
              <h4 className="text-md font-medium">Recent Reviews</h4>
              <ul className="space-y-2 mt-2" role="list">
                {reputation.reviews.slice(0, 3).map((review) => (
                  <li key={review._id} className="border-b pb-2">
                    <p className="text-sm">
                      <strong>{review.reviewer.username}</strong>: {review.rating}/5
                    </p>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No reputation data available.</p>
        )}
      </Card>
    </motion.div>
  );
};

export default LenderReputationTracker;
