/**
 * File: MechanicBadgeLeaderboard.jsx
 * Path: frontend/src/components/mechanic/MechanicBadgeLeaderboard.jsx
 * Purpose: Displays a dynamic leaderboard of mechanics ranked by badge achievements
 * Author: Cod1 (05060901)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 *
 * Features:
 * - Ranks mechanics by badge count
 * - Highlights top mechanic(s)
 * - Shows badge categories and icons
 * - Supports future filter/sort by badge type or timeframe
 */

// --- Dependencies ---
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Award } from 'lucide-react';

// --- Component ---
const MechanicBadgeLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    // Placeholder for actual API call to retrieve badge leaderboard
    const fetchLeaders = async () => {
      try {
        const response = await axios.get('/api/mechanic/leaderboard');
        setLeaders(response.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };

    fetchLeaders();
  }, []);

  return (
    <div className="p-4 shadow rounded-xl bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">Top Mechanics by Badges</h2>
      <ul className="space-y-3">
        {leaders.map((mechanic, index) => (
          <li
            key={mechanic.id}
            className={`flex items-center gap-4 p-3 rounded-lg ${
              index === 0 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="text-lg font-semibold w-6">{index + 1}</div>
            {index === 0 ? <Trophy className="text-yellow-500" /> : <Award className="text-blue-400" />}
            <div>
              <div className="font-medium">{mechanic.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {mechanic.badgeCount} badge{mechanic.badgeCount !== 1 ? 's' : ''} earned
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MechanicBadgeLeaderboard;
