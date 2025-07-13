// File: HaulerCollaboration.jsx
// Path: frontend/src/components/mechanic/HaulerCollaboration.jsx
// Author: Cod1 (05051115)
// Purpose: Allow mechanics to notify haulers about non-roadworthy vehicles and coordinate logistics
// Functions:
// - Display hauler notification form
// - Send hauler alert via backend (mocked)
// - Gate AI-driven detection under mechanicPro

import React, { useState } from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import { useLanguage } from '@components/common/MultiLanguageSupport';
import Button from '@components/common/Button';
import Card from '@components/common/Card';

const HaulerCollaboration = () => {
  const { getTranslation } = useLanguage();
  const [vehicleId, setVehicleId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [alertSent, setAlertSent] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(null);

  const sendHaulerAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 3000);
  };

  const handleAISuggestion = () => {
    setAiSuggested({
      issue: 'Brake failure detected from last inspection',
      severity: 'High',
      action: 'Vehicle blocked from transport. Notify hauler immediately.'
    });
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">{getTranslation('haulerCollaboration')}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{getTranslation('vehicleId')}</label>
          <input
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g., CAR123456"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{getTranslation('issueDescription')}</label>
          <textarea
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            rows={4}
            className="w-full border p-2 rounded"
            placeholder={getTranslation('describeIssue')}
          ></textarea>
        </div>

        <Button onClick={sendHaulerAlert} variant="danger">
          {getTranslation('notifyHauler')}
        </Button>

        {alertSent && <p className="text-green-600 text-sm mt-2">{getTranslation('alertSent')}</p>}

        <PremiumFeature feature="mechanicPro">
          <div className="mt-6 border-t pt-4">
            <h3 className="text-md font-semibold mb-2">{getTranslation('aiDetection')}</h3>
            <Button onClick={handleAISuggestion} variant="secondary">
              {getTranslation('runAiDetection')}
            </Button>
            {aiSuggested && (
              <div className="mt-3 text-sm text-gray-700">
                <p><strong>{getTranslation('detectedIssue')}:</strong> {aiSuggested.issue}</p>
                <p><strong>{getTranslation('severity')}:</strong> {aiSuggested.severity}</p>
                <p><strong>{getTranslation('recommendedAction')}:</strong> {aiSuggested.action}</p>
              </div>
            )}
          </div>
        </PremiumFeature>
      </div>
    </Card>
  );
};

export default HaulerCollaboration;
