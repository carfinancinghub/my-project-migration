/**
 * © 2025 CFH, All Rights Reserved
 * File: AIRecommendations.tsx
 * Path: frontend/src/components/AIRecommendations.tsx
 * Purpose: Displays AI-generated recommendations with titles, descriptions, and confidence scores.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-17 [1114]
 * Version: 1.0.1
 * Version ID: p0o9i8u7y6t5r4e3w2l1-k2j3h4g5f6d7c8b9z0x1
 * Crown Certified: Yes
 * Batch ID: Compliance-071725
 * Artifact ID: p0o9i8u7y6t5r4e3w2l1-k2j3h4g5e6d7c8b9v0m1
 * Save Location: frontend/src/components/AIRecommendations.tsx
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Strong interface typing
 * - Modular, fetches recommendations on mount
 * - Suggest data logic in @services/ai
 * - Suggest validation in @validation/ai.validation.ts
 * - Suggest tests in __tests__/AIRecommendations.test.tsx
 */
import React, { useState, useEffect, FC } from 'react';
import axios from 'axios';
import Navbar from '@components/Navbar';

export interface Recommendation {
  _id: string;
  title: string;
  description: string;
  confidence: number;
}

const AIRecommendations: FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    axios
      .get<Recommendation[]>('/api/ai-recommendations')
      .then((res) => setRecommendations(res.data))
      .catch((err) => {
        // Error handling/logging could be improved
        console.error('Failed to fetch recommendations:', err);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">AI Recommendations</h1>
        <div className="grid gap-4">
          {recommendations.map((rec) => (
            <div key={rec._id} className="border p-4 rounded">
              <h2 className="text-lg">{rec.title}</h2>
              <p>{rec.description}</p>
              <p>Confidence: {rec.confidence}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
