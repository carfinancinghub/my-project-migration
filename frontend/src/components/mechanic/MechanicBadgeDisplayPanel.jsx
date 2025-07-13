/**
 * File: MechanicBadgeDisplayPanel.jsx
 * Path: frontend/src/components/mechanic/MechanicBadgeDisplayPanel.jsx
 * Purpose: Visual panel to showcase earned mechanic badges and achievement metadata
 * Author: Cod1 (05060855)
 * Date: May 06, 2025 (Corrected to California time)
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

/**
 * MechanicBadgeDisplayPanel Component
 * Purpose: Display mechanic's earned badges with animation and detail overlay
 * Props:
 *   - badges (Array): List of earned badge objects (id, name, description, icon, dateEarned)
 */
const MechanicBadgeDisplayPanel = ({ badges = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {badges.map((badge) => (
        <motion.div
          key={badge.id}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl shadow-md">
            <CardContent className="flex items-center space-x-4 p-4">
              <img src={badge.icon} alt={badge.name} className="w-12 h-12" />
              <div>
                <h4 className="font-semibold text-lg">{badge.name}</h4>
                <p className="text-sm text-gray-600">{badge.description}</p>
                <p className="text-xs text-gray-400 mt-1">Earned on: {badge.dateEarned}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

MechanicBadgeDisplayPanel.propTypes = {
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      dateEarned: PropTypes.string.isRequired
    })
  ).isRequired
};

export default MechanicBadgeDisplayPanel;
