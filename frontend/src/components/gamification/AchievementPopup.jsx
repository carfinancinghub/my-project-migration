// File: AchievementPopup.jsx
// Path: C:\CFH\frontend\src\components\gamification\AchievementPopup.jsx
// Purpose: Display a celebratory pop-up for badge achievements
// Author: Rivers Auction Dev Team
// Date: 2025-05-21
// Cod2 Crown Certified: Yes

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import './AchievementPopup.css';

const AchievementPopup = ({ badgeId, badgeName, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000); // Auto-close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  try {
    return (
      <div className="achievement-popup">
        <div className="popup-content">
          <h2>Congratulations!</h2>
          <p>You earned the <strong>{badgeName}</strong> badge!</p>
          <button onClick={() => {
            setIsVisible(false);
            onClose();
          }}>Close</button>
        </div>
      </div>
    );
  } catch (err) {
    logger.error(`Failed to render AchievementPopup for badge ${badgeId}: ${err.message}`);
    return <div className="error-message">Error displaying achievement. Please try again.</div>;
  }
};

AchievementPopup.propTypes = {
  badgeId: PropTypes.string.isRequired,
  badgeName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

AchievementPopup.defaultProps = {};

export default AchievementPopup;