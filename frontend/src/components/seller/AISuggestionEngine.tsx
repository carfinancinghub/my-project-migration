/**
 * © 2025 CFH, All Rights Reserved
 * File: AISuggestionEngine.tsx
 * Path: frontend/src/components/seller/AISuggestionEngine.tsx
 * Purpose: Provides AI suggestions for enhancing car listing titles, descriptions, and tags.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-17 [1114]
 * Version: 1.0.1
 * Version ID: a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6
 * Crown Certified: Yes
 * Batch ID: Compliance-071725
 * Artifact ID: a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6
 * Save Location: frontend/src/components/seller/AISuggestionEngine.tsx
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Strong interface typing for FormData and component props
 * - Explicit error handling and authentication in API calls
 * - Modular structure (suggest moving logic to @services/ai)
 * - Suggest validation schema in @validation/ai.validation.ts
 * - Suggest adding tests in frontend/src/components/seller/__tests__/AISuggestionEngine.test.tsx
 */
import React, { useState, FC } from 'react';
import axios from 'axios';
import Button from '@common/Button';

export interface FormData {
  title: string;
  description: string;
  tags: string[];
}

export interface AISuggestionEngineProps {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}

const AISuggestionEngine: FC<AISuggestionEngineProps> = ({ form, setForm }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<FormData | null>(null);

  // Free Feature: AI Suggestion API Call
  const handleImprove = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to use AI Suggestions.');
        return;
      }
      const res = await axios.post<FormData>(
        `${process.env.REACT_APP_API_URL}/api/ai/listing-suggestions`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuggestions(res.data);
    } catch (err) {
      console.error('AI Suggestion failed:', err);
      alert('AI failed to suggest improvements.');
    } finally {
      setLoading(false);
    }
  };

  // Premium Feature: Apply Suggestions
  const applySuggestions = () => {
    if (!suggestions) return;
    setForm((prev: FormData) => ({
      ...prev,
      title: suggestions.title || prev.title,
      description: suggestions.description || prev.description,
      tags: suggestions.tags || prev.tags,
    }));
  };

  return (
    <div className="mt-6 border p-4 rounded bg-sky-50">
      <h3 className="text-md font-semibold mb-2">🤖 AI Listing Assistant</h3>
      <button onClick={handleImprove} disabled={loading}>
        {loading ? 'Analyzing...' : 'Suggest Improvements'}
      </button>
      {suggestions && (
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <strong>Suggested Title:</strong> {suggestions.title}
          </p>
          <p>
            <strong>Suggested Description:</strong> {suggestions.description}
          </p>
          <p>
            <strong>Tags:</strong> {suggestions.tags?.join(', ')}
          </p>
          <button className="secondary" onClick={applySuggestions}>
            Apply Suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default AISuggestionEngine;
