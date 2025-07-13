/**
 * File: MechanicMilestoneTracker.jsx
 * Path: frontend/src/components/mechanic/MechanicMilestoneTracker.jsx
 * Purpose: Tracks mechanic milestone progress and triggers visual celebrations using MechanicRewardConfetti
 * Author: Cod1 (05060822)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MechanicRewardConfetti from './MechanicRewardConfetti';
import classNames from 'classnames';

/**
 * MechanicMilestoneTracker Component
 * Purpose: Displays mechanic achievement progress and triggers confetti when a milestone is achieved
 * Props:
 *   - completedTasks (number): Number of mechanic tasks completed
 *   - milestones (array): Array of milestone thresholds (e.g., [5, 10, 20])
 *   - onMilestoneAchieved (function): Optional callback when a new milestone is hit
 */
const MechanicMilestoneTracker = ({ completedTasks, milestones, onMilestoneAchieved }) => {
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [achievedMilestones, setAchievedMilestones] = useState([]);

  useEffect(() => {
    // Check for newly achieved milestones
    const newAchievements = milestones.filter(
      (threshold) => completedTasks >= threshold && !achievedMilestones.includes(threshold)
    );

    if (newAchievements.length > 0) {
      setAchievedMilestones([...achievedMilestones, ...newAchievements]);
      setTriggerConfetti(true);
      if (onMilestoneAchieved) onMilestoneAchieved(newAchievements);

      const timer = setTimeout(() => setTriggerConfetti(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [completedTasks, milestones, achievedMilestones, onMilestoneAchieved]);

  // --- UI Rendering ---
  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-2">Achievement Progress</h3>
      <ul className="space-y-2">
        {milestones.map((threshold) => (
          <li
            key={threshold}
            className={classNames(
              'p-2 rounded-lg border transition-all duration-300',
              {
                'bg-green-100 border-green-400 text-green-700': completedTasks >= threshold,
                'bg-gray-50 border-gray-300 text-gray-600': completedTasks < threshold,
              }
            )}
          >
            {`Complete ${threshold} tasks`}
          </li>
        ))}
      </ul>
      <MechanicRewardConfetti trigger={triggerConfetti} />
    </div>
  );
};

MechanicMilestoneTracker.propTypes = {
  completedTasks: PropTypes.number.isRequired,
  milestones: PropTypes.arrayOf(PropTypes.number).isRequired,
  onMilestoneAchieved: PropTypes.func,
};

export default MechanicMilestoneTracker;
