/**
 * File: PremiumBadgeHintCard.jsx
 * Path: frontend/src/components/mechanic/PremiumBadgeHintCard.jsx
 * Purpose: Displays AI badge predictions and hints for premium mechanics
 * Author: Cod1 (05060912)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 *
 * Features:
 * - Displays next predicted badge based on AI logic
 * - Shows confidence level and reason behind prediction
 * - Premium-only UI panel using isPremium flag
 * - Framer-motion animation for premium user delight
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

// --- Props Type ---
/**
 * Props:
 * @param {string} mechanicId - ID of the current mechanic
 * @param {boolean} isPremium - Determines if badge prediction is shown
 */
const PremiumBadgeHintCard = ({ mechanicId, isPremium }) => {
  const [prediction, setPrediction] = useState(null);

  /**
   * fetchBadgePrediction
   * Purpose: Call AI predictor API to fetch next badge prediction
   */
  const fetchBadgePrediction = async () => {
    try {
      const res = await axios.get(`/api/mechanic/ai-badge-predict/${mechanicId}`);
      setPrediction(res.data);
    } catch (err) {
      toast.error('Unable to fetch badge prediction.');
    }
  };

  // Fetch prediction when component mounts
  useEffect(() => {
    if (isPremium && mechanicId) {
      fetchBadgePrediction();
    }
  }, [mechanicId, isPremium]);

  // If not premium or no prediction, hide the panel
  if (!isPremium || !prediction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-xl rounded-2xl p-4 w-full max-w-md mx-auto my-4 border border-blue-200"
    >
      <h4 className="text-lg font-semibold text-blue-700 mb-2">🔮 Your Next Badge Hint</h4>
      <p className="text-gray-700">
        <strong>Badge:</strong> {prediction.nextBadge}
      </p>
      <p className="text-gray-600">
        <strong>Confidence:</strong> {prediction.confidence}%
      </p>
      <p className="text-sm text-gray-500 mt-2 italic">
        Reason: {prediction.reason}
      </p>
    </motion.div>
  );
};

export default PremiumBadgeHintCard;
