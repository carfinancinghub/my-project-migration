// File: AISuggestionEngine.js
// Path: frontend/src/components/seller/AISuggestionEngine.js
// 👑 Cod1 Crown Certified — Smart Assistant for Car Title, Description, and Tag Enhancement

import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../common/Button';

const AISuggestionEngine = ({ form, setForm }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  const handleImprove = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai/listing-suggestions`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error('AI Suggestion failed:', err);
      alert('AI failed to suggest improvements.');
    } finally {
      setLoading(false);
    }
  };

  const applySuggestions = () => {
    if (!suggestions) return;
    setForm((prev) => ({
      ...prev,
      title: suggestions.title || prev.title,
      description: suggestions.description || prev.description,
      tags: suggestions.tags || prev.tags,
    }));
  };

  return (
    <div className="mt-6 border p-4 rounded bg-sky-50">
      <h3 className="text-md font-semibold mb-2">🤖 AI Listing Assistant</h3>
      <Button onClick={handleImprove} disabled={loading}>
        {loading ? 'Analyzing...' : 'Suggest Improvements'}
      </Button>

      {suggestions && (
        <div className="mt-4 space-y-2 text-sm">
          <p><strong>Suggested Title:</strong> {suggestions.title}</p>
          <p><strong>Suggested Description:</strong> {suggestions.description}</p>
          <p><strong>Tags:</strong> {suggestions.tags?.join(', ')}</p>
          <Button variant="secondary" onClick={applySuggestions}>Apply Suggestions</Button>
        </div>
      )}
    </div>
  );
};

export default AISuggestionEngine;
