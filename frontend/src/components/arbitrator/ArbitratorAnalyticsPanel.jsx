// 👑 Crown Certified Component — ArbitratorAnalyticsPanel.jsx
// Path: frontend/src/components/arbitrator/ArbitratorAnalyticsPanel.jsx
// Purpose: Visual analytics for arbitrators with resolution rates and premium insights.
// Author: Rivers Auction Team — May 15, 2025

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart2, TrendingUp } from 'lucide-react';
import logger from '@/utils/logger';

const ArbitratorAnalyticsPanel = ({ stats, isPremium }) => {
  try {
    if (!stats) {
      return (
        <Card className="p-4 text-center border-dashed">
          <CardContent>No analytics available.</CardContent>
        </Card>
      );
    }

    const {
      totalDisputes = 0,
      resolvedCases = 0,
      avgResolutionTime = 0,
      agreementRate = 0,
      premiumInsights = [],
    } = stats;

    return (
      <div data-testid="arbitrator-analytics" className="space-y-4">
        <Card>
          <CardContent>
            <p className="text-gray-600">📁 Total Cases</p>
            <h3 className="text-xl font-bold">{totalDisputes}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-gray-600">✅ Resolved Cases</p>
            <h3 className="text-xl font-bold">{resolvedCases}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-gray-600">⏱️ Avg. Resolution Time</p>
            <h3 className="text-xl font-bold">{avgResolutionTime} hrs</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-gray-600">📊 Agreement Rate</p>
            <h3 className="text-xl font-bold">{agreementRate}%</h3>
          </CardContent>
        </Card>

        {isPremium && premiumInsights.length > 0 && (
          <Card className="border border-blue-400 bg-blue-50">
            <CardContent>
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Premium Performance Insights
              </h4>
              <ul className="mt-2 list-disc list-inside text-sm text-blue-700">
                {premiumInsights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    logger.error('ArbitratorAnalyticsPanel failed to render', error);
    return null;
  }
};

ArbitratorAnalyticsPanel.propTypes = {
  stats: PropTypes.shape({
    totalDisputes: PropTypes.number,
    resolvedCases: PropTypes.number,
    avgResolutionTime: PropTypes.number,
    agreementRate: PropTypes.number,
    premiumInsights: PropTypes.arrayOf(PropTypes.string),
  }),
  isPremium: PropTypes.bool.isRequired,
};

export default ArbitratorAnalyticsPanel;