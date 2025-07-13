// File: SellerReputationDashboard.jsx
// Path: frontend/src/components/seller/SellerReputationDashboard.jsx
// Author: Cod2 New (with contributions from Cod1)
// 👑 Crown Certified
// Purpose: Display seller reputation details, including AI coaching tips, badge progress, social sharing tools, and loyalty program stats (tier, points, badges).
// Functions:
// - useEffect(loadReputation): Loads badge data and reputation level
// - useEffect(loadLoyaltyStats): Fetches and displays loyalty tier, points, and badges
// - handleCoachFeedback(): Displays AI-driven improvement suggestions
// - handleShare(): Triggers social post with badge snapshot
// - trackUserActivity(): Logs seller event (e.g., "Sold Car")

import React, { useEffect, useState } from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import { getUserId } from '@utils/authUtils';
import { fetchLoyaltyStats, trackActivity } from '@utils/LoyaltyProgramEngine';
import { getTranslation } from '@components/common/MultiLanguageSupport';
import { getSellerBadges, getAIImprovementTips } from '@utils/SellerBadgeEngine';
import { generateShareContent, shareToPlatform } from '@utils/SocialShareHelper';
import { Trophy, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SellerReputationDashboard = () => {
  const userId = getUserId();
  const [badges, setBadges] = useState<string[]>([]);
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [loyaltyTier, setLoyaltyTier] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [loyaltyBadges, setLoyaltyBadges] = useState<string[]>([]);

  // === Load Badge Info ===
  useEffect(() => {
    const loadReputation = async () => {
      const data = await getSellerBadges(userId);
      setBadges(data || []);
    };
    loadReputation();
  }, [userId]);

  // === Load Loyalty Info ===
  useEffect(() => {
    const loadLoyaltyStats = async () => {
      try {
        const stats = await fetchLoyaltyStats(userId);
        setLoyaltyTier(stats.tier);
        setPoints(stats.points);
        setLoyaltyBadges(stats.badges);
      } catch (error) {
        toast.error(getTranslation('loyaltyLoadError'));
      }
    };
    loadLoyaltyStats();
  }, [userId]);

  // === AI Coach Feedback ===
  const handleCoachFeedback = async () => {
    const tips = await getAIImprovementTips(userId);
    setAiTips(tips);
  };

  // === Share Button ===
  const handleShare = () => {
    const content = generateShareContent('badge', { badges });
    shareToPlatform('twitter', content);
  };

  // === Loyalty Trigger ===
  const trackUserActivity = async () => {
    await trackActivity(userId, 'Sold Car');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{getTranslation('sellerReputation')}</h2>

      <PremiumFeature feature="sellerAnalytics">
        {/* === Badge Display === */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-2">{getTranslation('badgesEarned')}</h3>
          <ul className="list-disc pl-5">
            {badges.map((badge, i) => (
              <li key={i} className="text-sm">🏅 {badge}</li>
            ))}
          </ul>
        </section>

        {/* === Loyalty Display === */}
        <section className="mb-6 bg-yellow-50 p-4 rounded shadow">
          <h3 className="text-lg font-bold text-yellow-800">{getTranslation('loyaltyProgram')}</h3>
          <p>{getTranslation('yourPoints')}: {points}</p>
          <p>{getTranslation('yourTier')}: {loyaltyTier}</p>
          <p>{getTranslation('yourBadges')}: {loyaltyBadges.join(', ')}</p>
        </section>

        {/* === AI Tips === */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-2">{getTranslation('improvementTips')}</h3>
          <button
            onClick={handleCoachFeedback}
            className="mb-2 bg-green-500 text-white px-3 py-1 rounded"
          >
            {getTranslation('showTips')}
          </button>
          <ul className="list-disc pl-5">
            {aiTips.map((tip, i) => (
              <li key={i} className="text-sm">{tip}</li>
            ))}
          </ul>
        </section>

        {/* === Share UI === */}
        <div className="text-center mt-4">
          <button
            onClick={handleShare}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            aria-label="Share reputation summary"
          >
            <Share2 className="w-4 h-4" /> {getTranslation('shareSummary')}
          </button>
        </div>
      </PremiumFeature>
    </div>
  );
};

export default SellerReputationDashboard;
