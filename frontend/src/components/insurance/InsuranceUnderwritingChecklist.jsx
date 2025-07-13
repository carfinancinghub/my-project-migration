/**
 * @file InsuranceUnderwritingChecklist.jsx
 * @path frontend/src/components/insurance/InsuranceUnderwritingChecklist.jsx
 * @description Displays and validates underwriting checklist items with AI smart suggestions, gamified UI, and role-based locking for insurance policies.
 * @author Cod2
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PremiumFeature } from '@components/common/PremiumFeature';
import ToastManager from '@components/common/ToastManager';
import OnboardingGuide from '@components/onboarding/OnboardingGuide';
import { useConfetti } from '@utils/ConfettiHelper';
import InsuranceRoleGuard from '@components/insurance/InsuranceRoleGuard';
import '@styles/InsuranceUnderwritingChecklist.css';

/**
 * @component InsuranceUnderwritingChecklist
 * @description Manages policy-specific underwriting checklist with AI validation and gamified features.
 * @param {string} policyId - Insurance policy ID
 */
const InsuranceUnderwritingChecklist = ({ policyId }) => {
  const [checklist, setChecklist] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { triggerConfetti } = useConfetti();

  /**
   * @function loadChecklist
   * @description Loads checklist items for the given policy.
   */
  const loadChecklist = async () => {
    try {
      const res = await axios.get(`/api/insurance/underwriting/${policyId}/checklist`);
      setChecklist(res.data);
    } catch (err) {
      ToastManager.error('Failed to load checklist');
      console.error('Checklist load error:', err);
    }
  };

  /**
   * @function toggleChecklistItem
   * @description Toggles completion of a checklist item and triggers confetti on full completion.
   * @param {number} index - Index of the checklist item
   * @wow Confetti on 100% completion
   */
  const toggleChecklistItem = async (index) => {
    const updated = [...checklist];
    updated[index].completed = !updated[index].completed;
    setChecklist(updated);

    try {
      await axios.post(`/api/insurance/underwriting/${policyId}/checklist`, updated);
      ToastManager.success('Checklist updated');
      if (updated.every(item => item.completed)) triggerConfetti();
    } catch (err) {
      ToastManager.error('Checklist update failed');
      console.error('Checklist update error:', err);
    }
  };

  /**
   * @function validateChecklistAI
   * @description Uses AI to validate checklist and suggest high-risk item completions (premium).
   * @wow AI-based underwriting validation and smart suggestions
   */
  const validateChecklistAI = async () => {
    try {
      const res = await axios.post(`/api/insurance/underwriting/${policyId}/validate`);
      setChecklist(res.data.checklist);
      setSuggestions(res.data.suggestions || []);
      ToastManager.success('Checklist validated with AI');
    } catch (err) {
      ToastManager.error('AI validation failed');
      console.error('AI checklist validation error:', err);
    }
  };

  useEffect(() => {
    if (policyId) loadChecklist();
  }, [policyId]);

  return (
    <InsuranceRoleGuard role="insuranceOfficer">
      <div className="insurance-underwriting-checklist" data-testid="underwriting-checklist">
        <OnboardingGuide
          steps={[{ element: '.checklist-list', intro: 'Complete underwriting checklist items here' }]}
          data-testid="onboarding-guide"
        />
        <h3 role="heading" aria-level="3">Underwriting Checklist</h3>
        <ul className="checklist-list" data-testid="checklist-items">
          {checklist.map((item, index) => (
            <li
              key={index}
              className={`checklist-item ${item.completed ? 'completed' : ''} ${suggestions.includes(index) ? 'high-risk' : ''}`}
              data-testid={`checklist-item-${index}`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(index)}
                  aria-label={`Checklist item ${item.description}`}
                  data-testid={`checkbox-${index}`}
                />
                {item.description}
                {suggestions.includes(index) && (
                  <span className="high-risk-indicator" aria-label="High-risk item"⚠️ High Risk</span>
                )}
              </label>
            </li>
          ))}
        </ul>

        <PremiumFeature flag="insurancePremium">
          <button
            onClick={validateChecklistAI}
            className="btn-validate-ai"
            aria-label="Validate checklist with AI"
            data-testid="validate-checklist"
          >
            🤖 Validate with AI
          </button>
        </PremiumFeature>
      </div>
    </InsuranceRoleGuard>
  );
};

export default InsuranceUnderwritingChecklist;