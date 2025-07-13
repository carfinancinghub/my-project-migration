// File: BadgeStorefront.jsx
// Path: frontend/src/components/gamification/BadgeStorefront.jsx
// Purpose: Display a storefront for users to browse and purchase premium badges
// Author: Rivers Auction Dev Team
// Date: 2025-05-20
// Cod2 Crown Certified: Yes

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { fetchBadges, purchaseBadge } from '@services/api/gamification';
import './BadgeStorefront.css';

const BadgeStorefront = ({ userId }) => {
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        setLoading(true);
        const badgeList = await fetchBadges();
        setBadges(badgeList);
      } catch (err) {
        logger.error(`Failed to fetch badges for user ${userId}: ${err.message}`);
        setError('Unable to load badge storefront. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadBadges();
  }, [userId]);

  const handlePurchase = async (badgeId) => {
    try {
      setLoading(true);
      await purchaseBadge(userId, badgeId);
      setBadges(badges.map(badge =>
        badge.id === badgeId ? { ...badge, owned: true } : badge
      ));
    } catch (err) {
      logger.error(`Badge purchase failed for user ${userId}, badge ${badgeId}: ${err.message}`);
      setError('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error-message" role="alert">{error}</div>;
  }

  return (
    <div className="badge-storefront">
      <h2>Badge Storefront</h2>
      {loading && <div className="loading">Loading...</div>}
      <div className="badge-grid">
        {badges.map(badge => (
          <div key={badge.id} className="badge-card">
            <img src={badge.image} alt={badge.name} />
            <h3>{badge.name}</h3>
            <p>{badge.description}</p>
            <button
              onClick={() => handlePurchase(badge.id)}
              disabled={badge.owned || loading}
            >
              {badge.owned ? 'Owned' : `Buy for ${badge.price}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

BadgeStorefront.propTypes = {
  userId: PropTypes.string.isRequired,
};

BadgeStorefront.defaultProps = {};

export default BadgeStorefront;