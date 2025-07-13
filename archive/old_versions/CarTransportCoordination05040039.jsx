// File: CarTransportCoordination.jsx
// Path: frontend/src/components/hauler/CarTransportCoordination.jsx
// Author: Cod2 New (with contributions from SG and Cod5)
// 👑 Crown Certified
// Purpose: Manage and coordinate vehicle transport tasks with AI features, route optimization, analytics, real-time chat, and now includes loyalty program tracking and badge UI.
// Functions:
// - useEffect(getCurrentLocation): Gets user's geolocation for routing and marker display
// - handleStrategyCoach(): AI transport suggestion based on user preference
// - handleOptimizeRoute(): Uses AI to compute optimized transport route
// - fetchCostForecast(): Displays forecast chart from AI model
// - handleBookTransport(): Books selected transport, adds XP, awards badge
// - useEffect(handleKeyDown): Enables escape-to-close chat modal
// - useEffect(fetchLoyaltyStats): Loads user tier, badges, and points
// - trackLoyaltyActivity(): Logs hauler activity to backend loyalty engine

import React, { useEffect, useState, useCallback } from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import { trackActivity, calculateTier } from '@utils/LoyaltyProgramEngine';
import { getUserId } from '@utils/authUtils';
import { fetchLenderMatches } from '@utils/LenderMatchEngine';
import { generateRecommendations } from '@utils/AILenderMatchRecommender';
import { exportLenderMatchPDF } from '@utils/lenderExportUtils';
import { Toaster, toast } from 'react-hot-toast';

// === Interfaces ===
interface BorrowerData {
  creditScore: number;
  loanAmount: number;
}

interface LenderMatch {
  name: string;
  rate: number;
  term: number;
}

interface Recommendation {
  text: string;
}

interface Props {
  borrowerData: BorrowerData;
}

// === Component ===
const BuyerLenderResults: React.FC<Props> = ({ borrowerData }) => {
  const userId = getUserId();
  const [matches, setMatches] = useState<LenderMatch[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [tier, setTier] = useState<string>('');
  const [badges, setBadges] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // === Fetch Matches and Update Loyalty ===
  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchLenderMatches(borrowerData);
      const recs = await generateRecommendations(borrowerData);
      setMatches(result);
      setRecommendations(recs);

      // Track activity and update points
      const newPoints = await trackActivity(userId, 'Completed Financing Deal', 50);
      setPoints((prev) => prev + newPoints);

      // Update loyalty stats
      const totalPoints = points + newPoints;
      const userTier = calculateTier(totalPoints);
      setTier(userTier);
      setBadges([`${userTier} Marketplace Member`]);

      toast.success('Lender matches loaded successfully!');
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load lender matches.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, borrowerData, points]);

  // === Export PDF ===
  const handleExport = useCallback(async () => {
    setIsLoading(true);
    try {
      await exportLenderMatchPDF(borrowerData, matches, recommendations);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF.');
    } finally {
      setIsLoading(false);
    }
  }, [borrowerData, matches, recommendations]);

  // === Initial Fetch ===
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h2 className="text-xl font-semibold mb-4">Lender Match Results</h2>

      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          <section aria-labelledby="matches-heading">
            <h3 id="matches-heading" className="text-lg font-medium mb-2">
              Available Lenders
            </h3>
            <ul className="mb-4 list-disc pl-5">
              {matches.length > 0 ? (
                matches.map((match, index) => (
                  <li key={index} className="text-sm mb-2">
                    ✅ {match.name} - {match.rate}% for {match.term} months
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No matches found.</li>
              )}
            </ul>
          </section>

          <section aria-labelledby="recommendations-heading">
            <h3 id="recommendations-heading" className="text-lg font-medium mb-2">
              Recommendations
            </h3>
            <ul className="mb-4 list-disc pl-5">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <li key={index} className="text-sm mb-2">{rec.text}</li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No recommendations available.</li>
              )}
            </ul>
          </section>

          <PremiumFeature feature="lenderAnalytics">
            <div className="bg-yellow-50 p-4 rounded shadow mb-4 transition duration-300">
              <h3 className="text-lg font-bold text-yellow-800">Loyalty Program</h3>
              <p>Your Points: {points}</p>
              <p>Tier: {tier || 'N/A'}</p>
              <p>Badges: {badges.length > 0 ? badges.join(', ') : 'None'}</p>
            </div>
            <button
              onClick={handleExport}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={isLoading}
              aria-label="Export lender matches as PDF"
            >
              {isLoading ? 'Exporting...' : 'Export PDF'}
            </button>
          </PremiumFeature>
        </>
      )}
    </div>
  );
};

export default BuyerLenderResults;
