// File: AuctionListingForm.jsx
// Path: frontend/src/components/auction/core/AuctionListingForm.jsx
// Purpose: Auction listing form with premium AI bid suggestion, template library, and auto-relist scheduler
// Author: Rivers Auction Team
// Date: May 14, 2025
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getSuggestedBid } from '@services/auction/AIBidStarter';
import { saveTemplate, getTemplates } from '@services/auction/AuctionTemplateEngine';

const AuctionListingForm = ({ isPremium }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingBid: '',
    schedule: '',
  });

  const [templates, setTemplates] = useState([]);
  const [aiBid, setAiBid] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (isPremium) {
      getTemplates()
        .then(setTemplates)
        .catch((err) => {
          logger.error('Failed to fetch templates:', err);
          setTemplates([]);
        });
    }
  }, [isPremium]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAISuggestion = async () => {
    try {
      const bid = await getSuggestedBid(formData);
      setAiBid(bid);
    } catch (error) {
      logger.error('AI bid suggestion failed:', error);
    }
  };

  const handleTemplateSave = async () => {
    try {
      const id = await saveTemplate(formData);
      setStatusMsg(`Template saved as ID: ${id}`);
    } catch (error) {
      logger.error('Template save failed:', error);
      setStatusMsg('Failed to save template.');
    }
  };

  const renderLocked = (feature) => (
    <div className="text-sm text-gray-500 italic">
      {feature} is a premium feature. Upgrade to access.
    </div>
  );

  return (
    <form className="space-y-4">
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="border p-2 w-full" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full" />
      <input name="startingBid" value={formData.startingBid} onChange={handleChange} placeholder="Starting Bid" className="border p-2 w-full" />
      <input name="schedule" value={formData.schedule} onChange={handleChange} placeholder="Cron Schedule (Premium)" className="border p-2 w-full" />

      {isPremium ? (
        <>
          <button type="button" onClick={handleAISuggestion} className="bg-blue-600 text-white p-2 rounded">
            Suggest Starting Bid (AI)
          </button>
          {aiBid && <div className="text-green-600">AI Suggested Bid: ${aiBid}</div>}

          <button type="button" onClick={handleTemplateSave} className="bg-purple-600 text-white p-2 rounded">
            Save as Template
          </button>
          {statusMsg && <div className="text-xs text-gray-600">{statusMsg}</div>}

          <div>
            <label className="text-sm font-medium">Templates:</label>
            <ul className="list-disc ml-6 text-sm">
              {templates.map((tpl, idx) => (
                <li key={idx}>{tpl.title || 'Untitled Template'}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          {renderLocked('AI Bid Suggestion')}
          {renderLocked('Template Library')}
          {renderLocked('Auto-Relist Scheduler')}
        </>
      )}
    </form>
  );
};

AuctionListingForm.propTypes = {
  isPremium: PropTypes.bool.isRequired,
};

export default AuctionListingForm;

/*
Functions Summary:
- AuctionListingForm
  - Purpose: Renders auction form with premium tools (AI, templates, scheduler)
  - Props: isPremium (bool)
  - Features:
    - AI bid suggestion (AIBidStarter)
    - Template storage/retrieval (AuctionTemplateEngine)
    - Auto-relist via schedule string (premium only)
  - Gated UI: renderLocked() handles upgrade messaging for basic users
  - Dependencies: React, @utils/logger, @services/auction/*, PropTypes
*/
