/**
 * File: MechanicJobStatusBadge.jsx
 * Path: frontend/src/components/mechanic/MechanicJobStatusBadge.jsx
 * Purpose: Display a dynamic badge for task/job status in the Mechanic role
 * Author: Cod1 (05060715)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * MechanicJobStatusBadge Component
 * Props:
 *   - status: string ("pending", "in_progress", "completed")
 * Returns:
 *   - Badge with appropriate color and label
 */
const MechanicJobStatusBadge = ({ status }) => {
  const statusMap = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-500 text-white',
    },
    in_progress: {
      label: 'In Progress',
      color: 'bg-blue-600 text-white',
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-600 text-white',
    },
  };

  const { label, color } = statusMap[status] || {
    label: 'Unknown',
    color: 'bg-gray-400 text-white',
  };

  return (
    <span
      className={classNames(
        'px-3 py-1 rounded-full text-sm font-semibold shadow-sm',
        color
      )}
    >
      {label}
    </span>
  );
};

MechanicJobStatusBadge.propTypes = {
  status: PropTypes.oneOf(['pending', 'in_progress', 'completed']).isRequired,
};

export default MechanicJobStatusBadge;
