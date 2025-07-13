/**
 * File: SellerReputationDashboard.jsx
 * Path: frontend/src/components/seller/SellerReputationDashboard.jsx
 * 👑 Cod1 Crown Certified — Dynamic Seller Trust Scoreboard + AI Reputation Coach + Visual Timeline
 *
 * 🔓 Free Features:
 * - Dynamic badge tracker + progress-to-next-level
 * - Verified reviews + percentile + rank
 *
 * 🔐 Premium (Pro/Enterprise) Features:
 * - Blockchain-verified badges UI
 * - AI Insight Banner (tip suggestions)
 * - Social sharing (Pro tier)
 * - AI Reputation Coach Panel (Enterprise)
 * - Visual Timeline Coach Tracker (Enterprise)
 * - Animated milestone effects (TailwindCSS confetti)
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserTrustBadges from '@components/common/UserTrustBadges';
import PremiumFeature from '@components/common/PremiumFeature';
import Button from '@components/common/Button';
import logger from '@utils/logger';
import { generateConfetti } from '@utils/animationUtils'; // Optional animation helper
import PropTypes from 'prop-types';

const SellerReputationDashboard = ({ sellerId }) => {
  const [reputation, setReputation] = useState(null);
  const [coachPlan, setCoachPlan] = useState([]);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCoachPanel, setShowCoachPanel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, coachRes] = await Promise.all([
          axios.get(`/api/seller/${sellerId}/reputation/meta`),
          axios.get(`/api/seller/${sellerId}/coach-plan`),
        ]);
        setReputation(repRes.data);
        setCoachPlan(coachRes.data.plan || []);
        setTimelineSteps(coachRes.data.timeline || []);
      } catch (err) {
        logger.error('Failed to load reputation dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sellerId]);

  const handleStepComplete = (stepId) => {
    generateConfetti();
    setCoachPlan((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  if (loading) return <div className="text-center p-8">⏳ Loading reputation...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow rounded p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🏆 Seller Reputation Dashboard</h2>

      {/* Blockchain-Verified Badges UI */}
      <UserTrustBadges badges={reputation.badges} />

      {/* Score & Percentile */}
      <div className="text-gray-700 text-sm space-y-1">
        <p>Reputation Score: <span className="font-semibold">{reputation.currentScore}</span> / 100</p>
        <p>Percentile Rank: Top <span className="font-semibold">{reputation.percentile}%</span></p>
        <p>Platform Ranking: <span className="font-semibold">#{reputation.ranking}</span></p>
      </div>

      {/* Gamified Progress */}
      {reputation.nextBadge && (
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-700">
          🥇 Only {reputation.nextBadge.remainingReviews} more review(s) to unlock
          <strong> {reputation.nextBadge.title}</strong>!
        </div>
      )}

      {/* AI Insight Banner */}
      {reputation.aiTips?.length > 0 && (
        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400 mt-4 text-blue-700">
          💡 AI Insight: {reputation.aiTips[0]}
        </div>
      )}

      {/* Verified Reviews */}
      <div>
        <h3 className="font-semibold mb-2 text-lg text-gray-700">📝 Verified Reviews</h3>
        <div className="grid gap-3">
          {reputation.reviews.map((review, i) => (
            <div key={i} className="bg-gray-50 p-3 border rounded shadow-sm">
              <p className="text-sm mb-1">“{review.comment}”</p>
              <p className="text-xs text-gray-500">By {review.buyerName} on {review.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Premium: Social Sharing */}
      <PremiumFeature feature="sellerSocial">
        <div className="mt-6">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => alert('🔗 Badge shared!')}
          >
            🚀 Share My Badge on Social Media
          </Button>
        </div>
      </PremiumFeature>

      {/* Premium: AI Reputation Coach Panel */}
      <PremiumFeature feature="sellerAnalytics">
        <div className="mt-8">
          <button
            onClick={() => setShowCoachPanel(!showCoachPanel)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showCoachPanel ? 'Hide AI Reputation Coach' : 'Show AI Reputation Coach'}
          </button>

          {showCoachPanel && (
            <div className="mt-4 bg-slate-50 p-4 rounded border border-slate-200 space-y-4">
              <h4 className="text-lg font-semibold text-slate-700">🧠 AI Reputation Coach</h4>
              {coachPlan.map((step) => (
                <div key={step.id} className="bg-white border p-3 rounded shadow-sm">
                  <p className="text-sm font-medium">{step.description}</p>
                  <div className="w-full bg-gray-200 h-3 rounded mt-2">
                    <div
                      className="bg-green-500 h-3 rounded"
                      style={{ width: `${step.progress}%` }}
                    ></div>
                  </div>
                  <Button
                    className="mt-2 bg-green-600 text-white hover:bg-green-700"
                    onClick={() => handleStepComplete(step.id)}
                  >
                    ✅ Mark as Complete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PremiumFeature>

      {/* Premium: Visual Timeline */}
      <PremiumFeature feature="sellerAnalytics">
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📍 Reputation Milestone Tracker</h3>
          <ol className="relative border-l-2 border-blue-500 space-y-6">
            {timelineSteps.map((step, i) => (
              <li key={i} className="ml-4">
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2.5 border-2 border-white"></div>
                <h4 className="font-medium text-gray-800">{step.title}</h4>
                <p className="text-sm text-gray-500">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </PremiumFeature>
    </div>
  );
};

SellerReputationDashboard.propTypes = {
  sellerId: PropTypes.string.isRequired,
};

export default SellerReputationDashboard;
