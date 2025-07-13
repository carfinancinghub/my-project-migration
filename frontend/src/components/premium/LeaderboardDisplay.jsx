// File: LeaderboardDisplay.jsx
// Path: C:\CFH\frontend\src\components\premium\LeaderboardDisplay.jsx
// Purpose: Display leaderboard for social gamification
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/premium

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getLeaderboard } from '@services/api/premium';

const LeaderboardDisplay = ({ userId, type }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getLeaderboard(userId, type);
        setLeaderboard(data);
        logger.info(`[LeaderboardDisplay] Fetched ${type} leaderboard for userId: ${userId}`);
      } catch (err) {
        logger.error(`[LeaderboardDisplay] Failed to fetch leaderboard for userId ${userId}: ${err.message}`, err);
        setError('Failed to load leaderboard. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [userId, type]);

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading leaderboard...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">{type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard</h3>
      {leaderboard.length > 0 ? (
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-gray-600 font-medium">#{entry.rank}</span>
              <span className="text-gray-800">User {entry.userId}</span>
              <span className="text-gray-600">Score: {entry.score}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No leaderboard data available.</p>
      )}
    </div>
  );
};

LeaderboardDisplay.propTypes = {
  userId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default LeaderboardDisplay;