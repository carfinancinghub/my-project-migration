/**
 * File: MechanicBadgeImpactTracker.jsx
 * Path: frontend/src/components/mechanic/MechanicBadgeImpactTracker.jsx
 * Purpose: Visual tracker showing mechanic badge achievements and XP progression
 * Author: Cod1 (05060759)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getBadgeProgress } from '@/utils/coach/SellerBadgeEngine'; // Reused logic for XP tiers

/**
 * MechanicBadgeImpactTracker Component
 * Purpose: Displays progress toward badge milestones for mechanics
 */
const MechanicBadgeImpactTracker = ({ mechanicId }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // Simulate API or coach logic fetch
    const fetchProgress = async () => {
      const result = await getBadgeProgress(mechanicId, 'mechanic');
      setBadges(result);
    };

    fetchProgress();
  }, [mechanicId]);

  return (
    <div className="space-y-4 p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold">Badge Progress Tracker</h2>
      {badges.length === 0 ? (
        <p className="text-gray-500">No badge progress available.</p>
      ) : (
        <ul className="space-y-2">
          {badges.map((badge, index) => (
            <li key={index} className="p-3 border rounded bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">{badge.name}</div>
                <Badge>{badge.level}</Badge>
              </div>
              <Progress value={badge.progress} className="mt-2" />
              <div className="text-xs text-gray-500 mt-1">
                {badge.progress}% toward next milestone ({badge.points} XP)
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MechanicBadgeImpactTracker;
