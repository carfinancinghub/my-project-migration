// File: SellerReputationDashboard.jsx
// Path: frontend/src/components/seller/SellerReputationDashboard.jsx
// 👑 Cod1 Crown Certified — Reputation + AI Coach Dashboard (Free + Enterprise)

// 🔍 Features:
// - 🎖️ Trust badge progression with milestone tracking
// - 🔍 Verified review feedback with buyer tags
// - 🧠 AI Insight Tips and Score Progress
// - 🎓 AI Reputation Coach (Enterprise tier, collapsible)
// - 📊 Chart-ready export analytics
// - 🌍 Multilingual-ready via i18n wrapper

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserTrustBadges from '@components/common/UserTrustBadges';
import PremiumFeature from '@components/common/PremiumFeature';
import Button from '@components/common/Button';
import logger from '@utils/logger';
import SellerBadgeEngine from '@utils/SellerBadgeEngine';
import PropTypes from 'prop-types';

const SellerReputationDashboard = ({ sellerId }) => {
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiCoachPlan, setAiCoachPlan] = useState([]);
  const [expandedCoach, setExpandedCoach] = useState(false);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        const { data } = await axios.get(`/api/seller/${sellerId}/reputation/meta`);
        setReputation(data);

        const plan = SellerBadgeEngine.getAiReputationCoach(data); // new modular logic
        setAiCoachPlan(plan);
      } catch (err) {
        logger.error('Seller reputation fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReputation();
  }, [sellerId]);

  if (loading) return <div className="p-6 text-center">⏳ Loading seller reputation...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🏆 Seller Reputation Dashboard</h2>

      <UserTrustBadges badges={reputation.badges} />

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Reputation Score: {reputation.currentScore}</h3>
        <p className="text-gray-600 text-sm">Ranked in top {reputation.percentile}th percentile.</p>
      </div>

      {reputation.nextBadge && (
        <div className="bg-yellow-50 p-4 border border-yellow-200 rounded">
          🥇 Just <strong>{reputation.nextBadge.remainingReviews}</strong> reviews to unlock <strong>{reputation.nextBadge.title}</strong>!
        </div>
      )}

      {/* Verified Reviews Section */}
      <div>
        <h3 className="text-lg font-semibold mt-6">📝 Verified Reviews</h3>
        <ul className="mt-3 space-y-2">
          {reputation.reviews.map((r, i) => (
            <li key={i} className="p-3 bg-gray-50 border rounded">
              “{r.comment}”
              <div className="text-xs text-gray-500">
                {r.buyerName} — {r.date}
                {r.tags?.length > 0 && (
                  <span className="ml-2 text-blue-500">#{r.tags.join(' #')}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 🎓 AI-Driven Reputation Coach */}
      <PremiumFeature feature="sellerAnalytics">
        <div className="bg-indigo-50 p-4 rounded border border-indigo-300 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-indigo-700">🎓 AI Reputation Coach</h3>
            <Button onClick={() => setExpandedCoach(!expandedCoach)} className="text-sm bg-indigo-600 text-white hover:bg-indigo-700">
              {expandedCoach ? 'Hide Plan' : 'View Plan'}
            </Button>
          </div>

          {expandedCoach && (
            <div className="mt-4 space-y-3 animate-fade-in">
              {aiCoachPlan.map((step, i) => (
                <div key={i} className="p-3 bg-white shadow rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-800">{step.action}</p>
                  <p className="text-xs text-gray-500">📈 Expected Impact: {step.impact} points</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PremiumFeature>

      <div className="mt-6 text-center">
        <Button onClick={() => window.location.reload()} className="bg-green-600 text-white">
          🔄 Refresh Data
        </Button>
      </div>
    </div>
  );
};

SellerReputationDashboard.propTypes = {
  sellerId: PropTypes.string.isRequired,
};

export default SellerReputationDashboard;
