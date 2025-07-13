/**
 * File: SmartVerdictHint.jsx
 * Path: frontend/src/components/judge/SmartVerdictHint.jsx
 * Purpose: Displays real-time AI-generated verdict hints for dispute resolution
 * Author: Cod1 (05290641)
 * Date: May 29, 2025
 * 👑 Cod1 Crown Certified
 *
 * Features:
 * - Listens to Socket.IO for live dispute verdict hints
 * - Displays AI-generated hint and confidence level
 * - Premium-only visibility with loading fallback
 * - Framer Motion animation for premium polish
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { Spinner } from '@/components/ui/Spinner'; // Optional loading spinner
import PremiumBadge from '@/components/global/PremiumBadge';

const socket = io('http://localhost:3000'); // Update to match backend config

/**
 * Props:
 * @param {string} disputeId - The current dispute's ID
 * @param {boolean} isPremium - Whether the viewer is a premium user
 */
const SmartVerdictHint = ({ disputeId, isPremium }) => {
  const [hintData, setHintData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!disputeId || !isPremium) return;

    // Listen for live verdict hint updates
    socket.emit('joinDisputeRoom', disputeId);
    socket.on('disputeUpdated', (data) => {
      if (data.hint) {
        setHintData(data.hint);
        setLoading(false);
      }
    });

    return () => {
      socket.emit('leaveDisputeRoom', disputeId);
      socket.off('disputeUpdated');
    };
  }, [disputeId, isPremium]);

  if (!isPremium) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg mt-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold">🧠 Smart Verdict Hint</h3>
        <PremiumBadge isPremium />
      </div>

      {loading ? (
        <div className="mt-2">
          <Spinner />
          <p className="text-sm text-gray-600">Fetching hint...</p>
        </div>
      ) : (
        <>
          <p className="mt-2">
            <strong>Hint:</strong> {hintData.message}
          </p>
          {hintData.confidence && (
            <p className="text-sm text-gray-700 italic">
              Confidence: {hintData.confidence}%
            </p>
          )}
        </>
      )}
    </motion.div>
  );
};

SmartVerdictHint.propTypes = {
  disputeId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default SmartVerdictHint;