/**
 * File: MechanicBadgeConfettiPanel.jsx
 * Path: frontend/src/components/mechanic/MechanicBadgeConfettiPanel.jsx
 * Purpose: Display animated confetti effects when mechanics earn badges or milestones
 * Author: Cod1 (05060857)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@hooks/useWindowSize';

// --- Component Definition ---
/**
 * MechanicBadgeConfettiPanel
 * Purpose: Triggers celebratory confetti effect on new badge unlock
 * Props:
 *   - trigger (boolean): If true, activates the confetti animation
 * Returns:
 *   - JSX component with confetti effect overlay
 */
const MechanicBadgeConfettiPanel = ({ trigger }) => {
  const { width, height } = useWindowSize();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timeout = setTimeout(() => setIsActive(false), 5000); // Confetti duration
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  if (!isActive) return null;

  return <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />;
};

export default MechanicBadgeConfettiPanel;
