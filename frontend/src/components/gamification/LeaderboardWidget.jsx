// File: LeaderboardWidget.jsx
// Path: frontend/src/components/gamification
// Purpose: Display a gamified leaderboard for buyers and service providers with real-time ranking
// Author: Rivers Auction Dev Team
// Date: 2025-05-20
// Cod2 Crown Certified: Yes

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { fetchLeaderboardData } from '@services/api/gamification';
import './LeaderboardWidget.css';

const LeaderboardWidget = ({ userType, maxRows }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboardData(userType, maxRows);
        setLeaderboardData(data);
      } catch (err) {
        logger.error(`Failed to fetch leaderboard for ${userType}: ${err.message}`);
        setError('Unable to load leaderboard. Please try again later.');
      }
    };
    loadLeaderboard();
  }, [userType, maxRows]);

  if (error) {
    return <div className="error-message" role="alert">{error}</div>;
  }

  return (
    <div className="leaderboard-widget">
      <h2>{userType} Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Score</th>
            <th>Badges</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={entry.userId}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
              <td>{entry.badges.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

LeaderboardWidget.propTypes = {
  userType: PropTypes.oneOf(['buyer', 'serviceProvider']).isRequired,
  maxRows: PropTypes.number,
};

LeaderboardWidget.defaultProps = {
  maxRows: 10,
};

export default LeaderboardWidget;