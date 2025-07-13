/**
 * File: MechanicProgressReviewBoard.jsx
 * Path: frontend/src/components/mechanic/MechanicProgressReviewBoard.jsx
 * Purpose: Premium UI board for reviewing mechanic badge progress, tips, and trends
 * Author: Cod1 (05060827)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 *
 * Features:
 * - Displays earned vs. remaining badges in categorized sections
 * - Offers premium AI tips on how to achieve the next milestones
 * - Hooks into backend milestone tracker (via props or fetch)
 * - Modular structure for future enhancements (e.g., score heatmap, comparison)
 */

// --- Dependencies ---
import React from 'react';
import PropTypes from 'prop-types';
import { BadgeCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Component ---
const MechanicProgressReviewBoard = ({ badges = [], aiTips = [] }) => {
  const earned = badges.filter(b => b.achieved);
  const remaining = badges.filter(b => !b.achieved);

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Progress Review Board</h3>

      {/* Earned Badges Section */}
      <section className="mb-6">
        <h4 className="text-lg font-bold mb-2 text-green-600">Earned Badges</h4>
        <div className="flex flex-wrap gap-3">
          {earned.map(b => (
            <motion.div
              key={b.id}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-xl text-sm text-green-800"
            >
              <BadgeCheck size={16} />
              {b.label}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Remaining Badges Section */}
      <section className="mb-6">
        <h4 className="text-lg font-bold mb-2 text-yellow-600">Remaining Badges</h4>
        <div className="flex flex-wrap gap-3">
          {remaining.map(b => (
            <div
              key={b.id}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-xl text-sm text-yellow-800 border border-yellow-300"
            >
              <AlertCircle size={16} />
              {b.label}
            </div>
          ))}
        </div>
      </section>

      {/* AI Coach Tips Section */}
      {aiTips.length > 0 && (
        <section>
          <h4 className="text-lg font-bold mb-2 text-blue-600">AI Coach Tips</h4>
          <ul className="list-disc list-inside text-sm text-gray-800">
            {aiTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

// --- Prop Types ---
MechanicProgressReviewBoard.propTypes = {
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      achieved: PropTypes.bool.isRequired,
    })
  ),
  aiTips: PropTypes.arrayOf(PropTypes.string),
};

export default MechanicProgressReviewBoard;
