/**
 * File: MissionCompletionLeaderboard.jsx
 * Path: frontend/src/components/hauler/MissionCompletionLeaderboard.jsx
 * Purpose: Leaderboard UI to gamify Hauler engagement by displaying rankings based on completed missions
 * Author: Cod3 (05051730)
 * Date: May 05, 2025
 * 👑 Cod3 Crown Certified
 */

// --- Dependencies ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Component Definition ---
/**
 * MissionCompletionLeaderboard Component
 * Purpose: Displays a leaderboard of Haulers ranked by completed missions
 * Props: None
 * Returns: JSX element for leaderboard display
 */
const MissionCompletionLeaderboard = () => {
  // --- State Management ---
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- API Integration ---
  /**
   * fetchMissionData
   * Purpose: Fetch mission data and calculate rankings
   */
  const fetchMissionData = async () => {
    setLoading(true);
    try {
      // Placeholder fetch for aggregated leaderboard-style data
      const haulerData = [
        { username: 'Hauler123', completedMissions: 10, totalXP: 500 },
        { username: 'Hauler456', completedMissions: 8, totalXP: 400 },
        { username: 'Hauler789', completedMissions: 5, totalXP: 250 }
      ];
      const sorted = sortRankings(haulerData);
      setRankings(sorted);
    } catch (error) {
      toast.error('Failed to fetch leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  // --- Modular Functions ---
  /**
   * sortRankings
   * Purpose: Sort haulers by completed missions for leaderboard ranking
   * @param {Array} haulerData - list of haulers and their metrics
   * @returns sorted array with rank added
   */
  const sortRankings = (haulerData) => {
    return haulerData
      .sort((a, b) => b.completedMissions - a.completedMissions)
      .map((hauler, index) => ({ ...hauler, rank: index + 1 }));
  };

  /**
   * renderBadge
   * Purpose: Conditionally render a "Top Hauler" badge for rank 1
   * @param {number} rank
   * @returns JSX element or null
   */
  const renderBadge = (rank) => {
    return rank === 1 ? <span className="ml-2 text-yellow-500">🏆 Top Hauler</span> : null;
  };

  // --- Lifecycle Hooks ---
  useEffect(() => {
    fetchMissionData();
  }, []);

  // --- UI Rendering ---
  return (
    <div className="bg-white rounded shadow p-4 w-full max-w-2xl">
      <h3 className="text-lg font-semibold mb-3">Mission Completion Leaderboard</h3>
      <button onClick={fetchMissionData} className="mb-3 px-4 py-1 bg-blue-600 text-white rounded">Refresh</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Rank</th>
              <th className="p-2 text-left">Hauler</th>
              <th className="p-2 text-left">Completed</th>
              <th className="p-2 text-left">XP</th>
              <th className="p-2 text-left">Badge</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((hauler) => (
              <tr key={hauler.username} className="border-t">
                <td className="p-2">{hauler.rank}</td>
                <td className="p-2">{hauler.username}</td>
                <td className="p-2">{hauler.completedMissions}</td>
                <td className="p-2">{hauler.totalXP}</td>
                <td className="p-2">{renderBadge(hauler.rank)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default MissionCompletionLeaderboard;
