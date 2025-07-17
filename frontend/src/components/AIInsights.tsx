/**
 * © 2025 CFH, All Rights Reserved
 * File: AIInsights.tsx
 * Path: frontend/src/components/AIInsights.tsx
 * Purpose: Displays AI-generated insights with titles, descriptions, and confidence scores.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-17 [1114]
 * Version: 1.0.1
 * Version ID: q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6
 * Crown Certified: Yes
 * Batch ID: Compliance-071725
 * Artifact ID: q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6
 * Save Location: frontend/src/components/AIInsights.tsx
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Strong typing for Insight interface
 * - Modular code, with side-effect hooks
 * - Suggest moving data-fetching logic to @services/ai
 * - Suggest validation in @validation/ai.validation.ts
 * - Suggest tests in frontend/src/components/__tests__/AIInsights.test.tsx
 */
import React, { useState, useEffect, FC } from 'react';
import axios from 'axios';
import Navbar from '@components/Navbar';

export interface Insight {
  _id: string;
  title: string;
  description: string;
  confidence: number;
}

const AIInsights: FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    axios
      .get<Insight[]>('/api/ai-insights')
      .then((res) => setInsights(res.data))
      .catch((err) => {
        // Could add error handling/logging
        console.error('Failed to fetch insights:', err);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <div className="grid gap-4">
          {insights.map((insight) => (
            <div key={insight._id} className="border p-4 rounded">
              <h2 className="text-lg">{insight.title}</h2>
              <p>{insight.description}</p>
              <p>Confidence: {insight.confidence}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
