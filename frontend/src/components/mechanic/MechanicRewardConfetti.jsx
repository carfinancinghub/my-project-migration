/**
 * File: MechanicRewardConfetti.jsx
 * Path: frontend/src/components/mechanic/MechanicRewardConfetti.jsx
 * Purpose: Confetti animation trigger component for celebrating mechanic milestones or badge achievements
 * Author: Cod1 (05060857)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 *
 * Enhancements:
 * - Added optional `duration` prop
 * - Added `badgeName` prop for future banner/sound integration
 * - Upgraded to support optional sound effects (placeholder only)
 */

// --- Dependencies ---
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@hooks/useWindowSize';

/**
 * MechanicRewardConfetti Component
 * Purpose: Trigger celebratory confetti animation when a badge or milestone is achieved
 * Props:
 *   - trigger (boolean): Controls when the confetti appears
 *   - duration (number): Optional, confetti duration in ms (default: 5000)
 *   - badgeName (string): Optional, used for future sound/banner association
 * Returns: JSX Element
 */
const MechanicRewardConfetti = ({ trigger, duration = 5000, badgeName }) => {
  const { width, height } = useWindowSize();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setActive(true);
      const timeout = setTimeout(() => setActive(false), duration);

      // Placeholder for optional sound effect logic
      if (badgeName) {
        console.log(`🎉 Confetti for badge: ${badgeName}`);
        // Future: play celebratory sound tied to badge
      }

      return () => clearTimeout(timeout);
    }
  }, [trigger, duration, badgeName]);

  return active ? <Confetti width={width} height={height} /> : null;
};

export default MechanicRewardConfetti;
