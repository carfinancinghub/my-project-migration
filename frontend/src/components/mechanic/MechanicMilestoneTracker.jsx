/**
 * File: MechanicMilestoneTracker.jsx
 * Path: frontend/src/components/mechanic/MechanicMilestoneTracker.jsx
 * Purpose: Displays a visual tracker for mechanic milestone achievements, integrates with reward effects
 * Author: Cod1 (05060829)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState, useEffect } from 'react';
import MechanicRewardConfetti from '@/components/mechanic/MechanicRewardConfetti';

// --- Component Definition ---
/**
 * MechanicMilestoneTracker Component
 * Purpose: Visually track milestone progress and trigger rewards
 * Props:
 *   - milestones (array): Array of milestone objects with fields: id, title, completed
 * Returns: JSX element for milestone progress display
 */
const MechanicMilestoneTracker = ({ milestones = [] }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- Effect to auto-update progress bar ---
  useEffect(() => {
    const completed = milestones.filter(m => m.completed).length;
    const total = milestones.length || 1;
    setProgress(Math.round((completed / total) * 100));
  }, [milestones]);

  // --- Effect to show confetti when 100% reached ---
  useEffect(() => {
    if (progress === 100) {
      setShowConfetti(true);
      const timeout = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Milestone Progress</h3>
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="bg-green-500 h-4 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-1">{progress}% complete</p>

      <ul className="mt-4 space-y-2">
        {milestones.map(m => (
          <li
            key={m.id}
            className={`p-2 border rounded ${m.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
          >
            {m.completed ? '✅' : '⬜'} {m.title}
          </li>
        ))}
      </ul>

      {/* Confetti reward */}
      {showConfetti && <MechanicRewardConfetti />}
    </div>
  );
};

export default MechanicMilestoneTracker;
