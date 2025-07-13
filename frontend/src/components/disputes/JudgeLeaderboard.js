// File: JudgeLeaderboard.js
// Path: frontend/src/components/disputes/JudgeLeaderboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JudgeLeaderboard = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const res = await axios.get('/api/users/arbitrators'); // Assume custom backend route
        const sorted = res.data.sort((a, b) => b.arbitrationStats.reputation - a.arbitrationStats.reputation);
        setJudges(sorted);
      } catch (err) {
        console.error('Error fetching judges:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchJudges();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!judges.length) return <p>No arbitrators found.</p>;

  return (
    <div className="mt-6 border p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">🏆 Top Arbitrators</h2>
      <ul className="divide-y divide-gray-200">
        {judges.map((judge, index) => (
          <li key={judge._id} className="py-2 flex justify-between items-center">
            <div>
              <p className="font-semibold">
                #{index + 1} {judge.username || judge.email}
              </p>
              <p className="text-xs text-gray-500">{judge.arbitrationStats.badges?.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Cases: {judge.arbitrationStats.resolvedCases}</p>
              <p className="text-sm font-medium text-blue-600">Reputation: {judge.arbitrationStats.reputation}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JudgeLeaderboard;
