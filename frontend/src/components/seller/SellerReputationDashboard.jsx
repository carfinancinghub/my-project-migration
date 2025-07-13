/**
 * File: SellerReputationDashboard.jsx
 * Path: frontend/src/components/seller/SellerReputationDashboard.jsx
 * Purpose: Dynamic seller trust scoreboard with AI reputation coach and visual timeline
 * Author: Cod1
 * Date: May 25, 2025
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Dynamic badge tracker with progress to next level
 * - Verified reviews with percentile and rank
 * - Blockchain-verified badges UI (Premium: sellerAnalytics)
 * - AI insight banner with tip suggestions (Premium: sellerAnalytics)
 * - Social sharing of badges (Premium: sellerSocial)
 * - AI Reputation Coach panel with progress tracking (Premium: sellerAnalytics)
 * - Visual timeline for milestone tracking (Premium: sellerAnalytics)
 * - Animated milestone effects with TailwindCSS confetti
 * - Language selector with translations
 * - SellerDeepAnalytics and AISellerNegotiationCoach integration (Premium: sellerAnalytics)
 * - Export panel for reputation data
 * Functions:
 * - fetchData(): Fetches reputation data, coach plan, analytics, and negotiation tips
 * - handleStepComplete(stepId): Marks a coach step as complete and triggers confetti animation
 * Dependencies: axios, UserTrustBadges, PremiumFeature, Button, logger, generateConfetti, SellerDeepAnalytics, AISellerNegotiationCoach, SellerExportPanel, useLanguage, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import UserTrustBadges from '@components/common/UserTrustBadges';
import PremiumFeature from '@components/common/PremiumFeature';
import Button from '@components/common/Button';
import logger from '@utils/logger';
import { generateConfetti } from '@utils/animationUtils';
import { SellerDeepAnalytics, AISellerNegotiationCoach } from '@services/sellerAnalytics';
import SellerExportPanel from '@components/seller/SellerExportPanel';
import { useLanguage } from '@hooks/useLanguage';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

const SellerReputationDashboard = ({ sellerId }) => {
  // State Management
  const [reputation, setReputation] = useState(null);
  const [coachPlan, setCoachPlan] = useState([]);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [negotiationTips, setNegotiationTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCoachPanel, setShowCoachPanel] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Fetch Data on Component Mount or SellerId Change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [repRes, coachRes, analyticsRes, negotiationRes] = await Promise.all([
          axios.get(`/api/seller/${sellerId}/reputation/meta`),
          axios.get(`/api/seller/${sellerId}/coach-plan`),
          SellerDeepAnalytics(sellerId),
          AISellerNegotiationCoach(sellerId),
        ]);
        setReputation(repRes.data);
        setCoachPlan(coachRes.data.plan || []);
        setTimelineSteps(coachRes.data.timeline || []);
        setAnalytics(analyticsRes);
        setNegotiationTips(negotiationRes);
      } catch (err) {
        logger.error('Failed to load reputation dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sellerId]);

  // Handle Coach Step Completion
  const handleStepComplete = (stepId) => {
    generateConfetti();
    setCoachPlan((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  // Render Loading State
  if (loading) return <div className={`text-center ${theme.spacingLg}`}>{t('loading_reputation', '⏳ Loading reputation...')}</div>;

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Seller Reputation Dashboard - CFH Auction Platform" />
      <div className={`max-w-5xl mx-auto bg-white ${theme.cardShadow} ${theme.borderRadius} ${theme.spacingLg} space-y-6`}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{t('seller_reputation_dashboard', '🏆 Seller Reputation Dashboard')}</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`border border-gray-300 ${theme.borderRadius} ${theme.spacingSm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        {/* Blockchain-Verified Badges UI */}
        <UserTrustBadges badges={reputation.badges} />

        {/* Score & Percentile */}
        <div className={`${theme.fontSizeSm} text-gray-700 space-y-1`}>
          <p>{t('reputation_score', 'Reputation Score')}: <span className="font-semibold">{reputation.currentScore}</span> / 100</p>
          <p>{t('percentile_rank', 'Percentile Rank')}: {t('top', 'Top')} <span className="font-semibold">{reputation.percentile}%</span></p>
          <p>{t('platform_ranking', 'Platform Ranking')}: <span className="font-semibold">#{reputation.ranking}</span></p>
        </div>

        {/* Gamified Progress */}
        {reputation.nextBadge && (
          <div className={`bg-yellow-50 ${theme.spacingSm} ${theme.borderRadius} border border-yellow-200 text-yellow-700`}>
            🥇 {t('next_badge_progress', 'Only {remaining} more review(s) to unlock', { remaining: reputation.nextBadge.remainingReviews })} <strong>{reputation.nextBadge.title}</strong>!
          </div>
        )}

        {/* AI Insight Banner */}
        {reputation.aiTips?.length > 0 && (
          <div className={`bg-blue-50 ${theme.spacingSm} ${theme.borderRadius} border-l-4 border-blue-400 mt-4 text-blue-700`}>
            💡 {t('ai_insight', 'AI Insight')}: {reputation.aiTips[0]}
          </div>
        )}

        {/* Verified Reviews */}
        <div>
          <h3 className="font-semibold mb-2 text-lg text-gray-700">{t('verified_reviews', '📝 Verified Reviews')}</h3>
          <div className="grid gap-3">
            {reputation.reviews.map((review, i) => (
              <div key={i} className={`bg-gray-50 ${theme.spacingSm} border ${theme.borderRadius} ${theme.cardShadow}`}>
                <p className={`${theme.fontSizeSm} mb-1`}>“{review.comment}”</p>
                <p className={`${theme.fontSizeSm} text-gray-500`}>{t('by_buyer_on_date', 'By {buyer} on {date}', { buyer: review.buyerName, date: review.date })}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <div className={`bg-gray-50 ${theme.spacingMd} ${theme.borderRadius} border border-gray-200`}>
            <h3 className="font-semibold mb-2 text-lg text-gray-700">{t('analytics_summary', '📊 Analytics Summary')}</h3>
            <p className="text-gray-600">{t('total_sales', 'Total Sales')}: {analytics.totalSales}</p>
            <p className="text-gray-600">{t('average_rating', 'Average Rating')}: {analytics.averageRating}/5</p>
          </div>
        )}

        {/* Negotiation Tips */}
        {negotiationTips.length > 0 && (
          <div className={`${theme.successText} bg-green-50 ${theme.spacingSm} ${theme.borderRadius} border-l-4 border-green-400 mt-4`}>
            💡 {t('negotiation_tip', 'Negotiation Tip')}: {negotiationTips[0]}
          </div>
        )}

        {/* Premium: Social Sharing */}
        <PremiumFeature feature="sellerSocial">
          <div className="mt-6">
            <Button
              className={`${theme.primaryButton}`}
              onClick={() => alert(t('badge_shared', '🔗 Badge shared!'))}
              aria-label="Share badge on social media"
            >
              {t('share_badge', '🚀 Share My Badge on Social Media')}
            </Button>
          </div>
        </PremiumFeature>

        {/* Premium: AI Reputation Coach Panel */}
        <PremiumFeature feature="sellerAnalytics">
          <div className="mt-8">
            <button
              onClick={() => setShowCoachPanel(!showCoachPanel)}
              className={`${theme.fontSizeSm} text-blue-600 hover:underline`}
              aria-label={showCoachPanel ? "Hide AI Reputation Coach panel" : "Show AI Reputation Coach panel"}
            >
              {showCoachPanel ? t('hide_coach', 'Hide AI Reputation Coach') : t('show_coach', 'Show AI Reputation Coach')}
            </button>

            {showCoachPanel && (
              <div className={`mt-4 bg-slate-50 ${theme.spacingMd} ${theme.borderRadius} border border-slate-200 space-y-4`}>
                <h4 className="text-lg font-semibold text-slate-700">{t('ai_reputation_coach', '🧠 AI Reputation Coach')}</h4>
                {coachPlan.map((step) => (
                  <div key={step.id} className={`bg-white border ${theme.spacingSm} ${theme.borderRadius} ${theme.cardShadow}`}>
                    <p className={`${theme.fontSizeSm} font-medium`}>{step.description}</p>
                    <div className="w-full bg-gray-200 h-3 rounded mt-2">
                      <div
                        className="bg-green-500 h-3 rounded"
                        style={{ width: `${step.progress}%` }}
                        role="progressbar"
                        aria-valuenow={step.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`Progress for ${step.description}`}
                      ></div>
                    </div>
                    <Button
                      className={`${theme.successText} bg-green-600 hover:bg-green-700 mt-2`}
                      onClick={() => handleStepComplete(step.id)}
                      aria-label="Mark coach step as complete"
                    >
                      {t('mark_complete', '✅ Mark as Complete')}
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
            <h3 className="text-lg font-semibold text-gray-700 mb-3">{t('milestone_tracker', '📍 Reputation Milestone Tracker')}</h3>
            <ol className="relative border-l-2 border-blue-500 space-y-6">
              {timelineSteps.map((step, i) => (
                <li key={i} className="ml-4">
                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2.5 border-2 border-white"></div>
                  <h4 className="font-medium text-gray-800">{step.title}</h4>
                  <p className={`${theme.fontSizeSm} text-gray-500`}>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </PremiumFeature>

        {/* Export Panel */}
        <SellerExportPanel data={reputation} />
      </div>
    </AdminLayout>
  );
};

// Prop Type Validation
SellerReputationDashboard.propTypes = {
  sellerId: PropTypes.string.isRequired,
};

export default SellerReputationDashboard;