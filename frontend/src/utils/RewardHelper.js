// File: RewardHelper.js
// Path: frontend/src/utils/RewardHelper.js
// 👑 Cod1 Crown Certified — Runtime Confetti + Sound Reward Logic

import React from 'react';
import ReactDOM from 'react-dom/client';
import Confetti from 'react-confetti';

const RewardHelper = (() => {
  let activeRoot = null;

  /**
   * Dynamically render confetti into a target element
   * @param {string} milestoneType - 'minor' or 'major'
   * @param {string} elementId - DOM element ID to inject confetti
   */
  const triggerConfetti = (milestoneType = 'minor', elementId = 'confetti-container') => {
    const confettiProps = milestoneType === 'minor'
      ? { numberOfPieces: 60, recycle: false, gravity: 0.3 }
      : { numberOfPieces: 200, recycle: false, gravity: 0.25 };

    const target = document.getElementById(elementId);
    if (!target) {
      console.warn(`[RewardHelper] Target element "${elementId}" not found.`);
      return;
    }

    // Clean up old render if exists
    if (activeRoot) {
      activeRoot.unmount();
    }

    // Mount new confetti
    activeRoot = ReactDOM.createRoot(target);
    activeRoot.render(
      <Confetti width={window.innerWidth} height={window.innerHeight} {...confettiProps} />
    );
  };

  /**
   * Play a sound for major milestone celebrations
   * @param {string} milestoneType - Only plays for 'major'
   */
  const playSound = (milestoneType = 'minor') => {
    if (milestoneType === 'major') {
      const audio = new Audio('/sounds/celebration.mp3');
      audio.volume = 0.75;
      audio.play().catch((err) => {
        console.warn('[RewardHelper] Sound playback failed:', err.message);
      });
    }
  };

  return {
    triggerConfetti,
    playSound
  };
})();

export default RewardHelper;
