/**
 * File: MechanicBadgeProgressTracker.jsx
 * Path: frontend/src/components/mechanic/MechanicBadgeProgressTracker.jsx
 * Purpose: UI component to display badge progress and celebrate milestones for mechanics
 * Author: Cod1 (05060918)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import { toast } from 'react-toastify';

// --- Component Definition ---
/**
 * MechanicBadgeProgressTracker Component
 * Displays badge progression and triggers celebration on milestone unlock
 */
const MechanicBadgeProgressTracker = ({ mechanicId }) => {
  // --- State Management ---
  const [badges, setBadges] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- Fetch Badge Progress ---
  useEffect(() => {
    const fetchBadgeProgress = async () => {
      try {
        const res = await axios.get(`/api/mechanic/badges/progress?mechanicId=${mechanicId}`);
        setBadges(res.data.unlocked);

        // Trigger confetti if new milestone unlocked
        if (res.data.newUnlocked && res.data.newUnlocked.length > 0) {
          toast.success('🎉 New Badge Unlocked!');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } catch (err) {
        toast.error('Failed to load badge progress.');
      }
    };

    if (mechanicId) fetchBadgeProgress();
  }, [mechanicId]);

  // --- UI Rendering ---
  return (
    <div className="badge-progress-tracker p-4 border rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Badge Progress</h3>
      <ul className="list-disc pl-5">
        {badges.map((badge, idx) => (
          <li key={idx} className="text-green-700 font-medium">{badge}</li>
        ))}
      </ul>
      {showConfetti && <Confetti numberOfPieces={250} recycle={false} />} 
    </div>
  );
};

export default MechanicBadgeProgressTracker;
