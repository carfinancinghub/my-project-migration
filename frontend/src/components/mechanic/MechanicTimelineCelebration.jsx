/**
 * File: MechanicTimelineCelebration.jsx
 * Path: frontend/src/components/mechanic/MechanicTimelineCelebration.jsx
 * Purpose: Visual timeline component with animated badge celebration markers for mechanics
 * Author: Cod1 (05060857)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 *
 * Features:
 * - Badge milestone timeline tracker
 * - Animated marker when badge is unlocked
 * - Confetti + sound trigger (integrates MechanicRewardConfetti)
 * - Premium-only celebration effects via isPremium prop
 */

// --- Dependencies ---
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MechanicRewardConfetti from './MechanicRewardConfetti';

// --- Props Type ---
/**
 * Props:
 * @param {Array} milestones - [{ id, label, achieved }]
 * @param {boolean} isPremium - Toggles premium celebration effects
 */
const MechanicTimelineCelebration = ({ milestones = [], isPremium = false }) => {
  const [activeBadge, setActiveBadge] = useState(null);

  useEffect(() => {
    const lastUnlocked = milestones.find(m => m.achieved);
    if (lastUnlocked) {
      setActiveBadge(lastUnlocked.label);
    }
  }, [milestones]);

  return (
    <div className="w-full py-4 px-6">
      <h3 className="text-xl font-bold mb-4">Badge Timeline</h3>
      <div className="relative flex items-center justify-between border-t border-gray-300 py-4">
        {milestones.map((m, index) => (
          <div
            key={m.id}
            className="flex flex-col items-center relative"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: m.achieved ? 1.2 : 0.8 }}
              transition={{ duration: 0.5 }}
              className={`w-6 h-6 rounded-full z-10 ${
                m.achieved ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-xs mt-2 text-center w-24">{m.label}</span>
          </div>
        ))}
      </div>

      {isPremium && (
        <MechanicRewardConfetti
          trigger={!!activeBadge}
          badgeName={activeBadge}
          duration={4000}
        />
      )}
    </div>
  );
};

export default MechanicTimelineCelebration;
