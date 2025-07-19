/**
 * © 2025 CFH, All Rights Reserved
 * File: SustainabilityScoring.tsx
 * Path: frontend/src/components/SustainabilityScoring.tsx
 * Purpose: Component to display sustainability scores for vehicles
 * Author: Cod1 Team
 * Date: 2025-07-18 [0815]
 * Version: 1.0.1
 * Version ID: r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9
 * Save Location: frontend/src/components/SustainabilityScoring.tsx
 */

import React, { useState, useEffect } from 'react';
import Navbar from '@layout/Navbar';
import { sustainabilityScoresSchema } from '@validation/sustainability.validation';
import { getSustainabilityScores } from '@services/sustainability';

interface Score {
  _id: string;
  vehicle: string;
  score: number;
  details: string;
}

const SustainabilityScoring: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await getSustainabilityScores();
        await sustainabilityScoresSchema.validateAsync(data);
        setScores(data);
      } catch (err: any) {
        setError('Failed to load scores.');
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Sustainability Scoring</h1>
        <div className="grid gap-4">
          {scores.map(score => (
            <div key={score._id} className="border p-4 rounded">
              <h2 className="text-lg">Vehicle: {score.vehicle}</h2>
              <p>Score: {score.score}/100</p>
              <p>Details: {score.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SustainabilityScoring;
