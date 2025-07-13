/**
 * @file ValuationDisplay.tsx
 * @path C:\CFH\frontend\src\components\common\ValuationDisplay.tsx
 * @author Mini Team
 * @created 2025-06-11 [2318]
 * @purpose Displays AI-driven valuation and pricing recommendations.
 * @user_impact Helps sellers price their vehicles competitively using AI insights.
 * @version 1.0.0
 */
import React from 'react';

interface ValuationDisplayProps {
  valuation: number;
  confidence: 'high' | 'medium' | 'low';
}

export const ValuationDisplay: React.FC<ValuationDisplayProps> = ({ valuation, confidence }) => {
  return (
    <section>
      <h4>AI Recommended Valuation</h4>
      <p>
        <strong>${valuation.toLocaleString()}</strong> (Confidence: {confidence})
      </p>
    </section>
  );
};