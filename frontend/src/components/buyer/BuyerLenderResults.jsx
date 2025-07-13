// File: BuyerLenderResults.jsx
// Path: frontend/src/components/buyer/BuyerLenderResults.jsx
// Author: Cod2 New
// 👑 Crown Certified
// Purpose: Displays lender matches and integrates loyalty program UI with badge visuals and point tracking.
// Functions:
// - useEffect(loadMatches): Fetches AI lender match recommendations.
// - useEffect(loadLoyalty): Loads user loyalty stats (tier, points, badges).
// - handleTrack(): Tracks "Completed Financing Deal" activity and updates loyalty stats.
// - handleExport(): Exports match results as a PDF with loyalty metadata.

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BadgeAward } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PremiumFeature from '@components/common/PremiumFeature';
import { getTranslation } from '@components/common/MultiLanguageSupport';
import {
  fetchLoyaltyStats,
  trackActivity,
} from '@utils/LoyaltyProgramEngine';
import {
  getLenderMatches,
  getRecommendationTips,
} from '@utils/AILenderMatchRecommender';
import { exportLenderMatchPDF } from '@utils/lenderExportUtils';

const BuyerLenderResults = ({ userId }) => {
  const [matches, setMatches] = useState([]);
  const [loyalty, setLoyalty] = useState(null);

  // Load lender matches
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const results = await getLenderMatches(userId);
        setMatches(results);
      } catch {
        toast.error(getTranslation('errorLoadingMatches'));
      }
    };
    loadMatches();
  }, [userId]);

  // Load loyalty stats
  useEffect(() => {
    const loadLoyalty = async () => {
      try {
        const stats = await fetchLoyaltyStats(userId);
        setLoyalty(stats);
      } catch {
        toast.error(getTranslation('errorLoadingLoyalty'));
      }
    };
    loadLoyalty();
  }, [userId]);

  // Trigger activity and update loyalty
  const handleTrack = async () => {
    try {
      await trackActivity(userId, 'Completed Financing Deal');
      toast.success(getTranslation('activityTracked'));
      const updated = await fetchLoyaltyStats(userId);
      setLoyalty(updated);
    } catch {
      toast.error(getTranslation('activityFailed'));
    }
  };

  const handleExport = async () => {
    try {
      await exportLenderMatchPDF(matches, loyalty);
      toast.success(getTranslation('exportSuccess'));
    } catch {
      toast.error(getTranslation('exportFailed'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Lender Matches */}
      <section aria-label="Lender Matches">
        {matches.map((match, idx) => (
          <Card key={idx} className="p-4 border shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-800">
                {match.lender}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{getTranslation('interestRate')}: {match.rate}%</p>
              <p>{getTranslation('loanTerm')}: {match.term} months</p>
              <p>{getTranslation('monthlyPayment')}: ${match.monthlyPayment}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Loyalty Program Section */}
      <PremiumFeature feature="loyaltyProgram">
        <section aria-label="Loyalty Program">
          {loyalty ? (
            <Card className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 border rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800 text-xl">
                  <BadgeAward className="w-5 h-5" />
                  {getTranslation('loyaltyStatus')}: {loyalty.tier}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{getTranslation('points')}: <strong>{loyalty.points}</strong></p>
                <ul className="list-disc list-inside mt-2">
                  {loyalty.badges.map((b, i) => (
                    <li key={i} className="text-sm text-gray-600">{b}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-gray-500">{getTranslation('loadingLoyalty')}</p>
          )}
        </section>
      </PremiumFeature>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleTrack}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {getTranslation('completeDeal')}
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          {getTranslation('exportPDF')}
        </button>
      </div>
    </div>
  );
};

export default BuyerLenderResults;
