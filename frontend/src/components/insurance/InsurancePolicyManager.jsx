/**
 * @file InsurancePolicyManager.jsx
 * @path frontend/src/components/insurance/InsurancePolicyManager.jsx
 * @description Manages the lifecycle of insurance quotes and policies with real-time scoring, collaborative editing, and premium features. Includes auto-underwriting AI, SellerDocVault integration, and WebSocket collaboration.
 * @author Cod2
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PremiumFeature } from '@components/common/PremiumFeature';
import ToastManager from '@components/common/ToastManager';
import InsuranceUnderwritingChecklist from '@components/insurance/InsuranceUnderwritingChecklist';
import CollaborationChat from '@components/chat/CollaborationChat';
import SellerDocVault from '@components/seller/SellerDocVault';
import { useSocket } from '@backend/socket';
import '@styles/InsurancePolicyManager.css';

/**
 * @component InsurancePolicyManager
 * @description Component for creating, editing, and archiving insurance policies with premium analytics and collaborative features.
 */
const InsurancePolicyManager = () => {
  const [policy, setPolicy] = useState({ id: null, form: {}, status: 'draft' });
  const [policies, setPolicies] = useState([]);
  const socket = useSocket();

  const fetchPolicyStatus = async (id) => {
    try {
      const response = await axios.get(`/api/insurance/policies/${id}`);
      setPolicy(prev => ({ ...prev, status: response.data.status }));
      ToastManager.success('Policy status fetched');
    } catch (err) {
      ToastManager.error('Failed to fetch policy status');
    }
  };

  const submitNewPolicy = async (form) => {
    try {
      const response = await axios.post('/api/insurance/policies', form);
      setPolicies(prev => [...prev, response.data]);
      setPolicy({ ...policy, id: response.data.id, form });
      ToastManager.success('Policy submitted successfully');
    } catch (err) {
      ToastManager.error('Failed to submit policy');
    }
  };

  const editPolicy = async (id, data) => {
    try {
      const response = await axios.patch(`/api/insurance/policies/${id}`, data);
      setPolicies(prev => prev.map(p => p.id === id ? response.data : p));
      setPolicy(prev => ({ ...prev, form: data }));
      socket.emit('policyUpdate', { id, data });
      ToastManager.success('Policy updated successfully');
    } catch (err) {
      ToastManager.error('Failed to update policy');
    }
  };

  const archivePolicy = async (id) => {
    try {
      await axios.delete(`/api/insurance/policies/${id}`);
      setPolicies(prev => prev.filter(p => p.id !== id));
      setPolicy({ id: null, form: {}, status: 'draft' });
      ToastManager.success('Policy archived successfully');
    } catch (err) {
      ToastManager.error('Failed to archive policy');
    }
  };

  const generatePolicySummary = async (id) => {
    try {
      const response = await axios.get(`/api/insurance/policies/${id}/summary`);
      await axios.post('/api/seller/doc-vault', { policyId: id, summary: response.data });
      ToastManager.success('Policy summary shared to SellerDocVault');
    } catch (err) {
      ToastManager.error('Failed to share policy summary');
    }
  };

  const triggerAutoUnderwriting = async (id) => {
    try {
      const response = await axios.post(`/api/insurance/underwriting/${id}/auto`);
      setPolicy(prev => ({ ...prev, checklist: response.data.checklist }));
      ToastManager.success('Auto-underwriting completed');
    } catch (err) {
      ToastManager.error('Auto-underwriting failed');
    }
  };

  useEffect(() => {
    socket.on('policyUpdate', ({ id, data }) => {
      setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    });
    return () => socket.off('policyUpdate');
  }, [socket]);

  return (
    <div className="insurance-policy-manager" data-testid="policy-manager">
      <h1 role="heading" aria-level="1">Insurance Policy Manager</h1>

      <section data-testid="policy-form">
        <h2 role="heading" aria-level="2">Create/Edit Policy</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            policy.id ? editPolicy(policy.id, policy.form) : submitNewPolicy(policy.form);
          }}
          aria-label="Policy form"
        >
          <input
            type="text"
            value={policy.form.vehicleId || ''}
            onChange={(e) => setPolicy(prev => ({ ...prev, form: { ...prev.form, vehicleId: e.target.value } }))}
            placeholder="Vehicle ID"
            aria-label="Vehicle ID"
            data-testid="vehicle-id-input"
          />
          <input
            type="number"
            value={policy.form.quoteAmount || ''}
            onChange={(e) => setPolicy(prev => ({ ...prev, form: { ...prev.form, quoteAmount: e.target.value } }))}
            placeholder="Quote Amount"
            aria-label="Quote Amount"
            data-testid="quote-amount-input"
          />
          <button type="submit" aria-label="Save policy" data-testid="save-policy">
            {policy.id ? 'Update Policy' : 'Submit Policy'}
          </button>
        </form>
      </section>

      <section data-testid="policy-list">
        <h2 role="heading" aria-level="2">Policies</h2>
        {policies.map(p => (
          <div key={p.id} className="policy-item" data-testid={`policy-${p.id}`}>
            <p>Policy #{p.id} - {p.vehicleId} (Status: {p.status})</p>
            <PremiumFeature flag="insurancePremium">
              <button onClick={() => generatePolicySummary(p.id)} aria-label={`Share summary for policy ${p.id}`} data-testid={`share-${p.id}`}>
                Share Summary
              </button>
              <button onClick={() => triggerAutoUnderwriting(p.id)} aria-label={`Auto-underwrite policy ${p.id}`} data-testid={`auto-underwrite-${p.id}`}>
                Auto-Underwrite
              </button>
            </PremiumFeature>
            <button onClick={() => archivePolicy(p.id)} aria-label={`Archive policy ${p.id}`} data-testid={`archive-${p.id}`}>
              Archive
            </button>
          </div>
        ))}
      </section>

      <PremiumFeature flag="insuranceEnterprise">
        <section data-testid="competitor-comparison">
          <h2 role="heading" aria-level="2">Competitor Comparison</h2>
          <p>Comparing quotes with market benchmarks...</p>
        </section>
      </PremiumFeature>

      <PremiumFeature flag="insurancePremium">
        <section data-testid="milestone-tracker">
          <h2 role="heading" aria-level="2">Policy Milestones</h2>
          <div className="milestone-tracker">
            <span className={policy.status === 'draft' ? 'active' : ''}>Draft</span>
            <span className={policy.status === 'pending' ? 'active' : ''}>Pending</span>
            <span className={policy.status === 'approved' ? 'active' : ''}>Approved</span>
          </div>
        </section>
      </PremiumFeature>

      {policy.id && (
        <InsuranceUnderwritingChecklist policyId={policy.id} data-testid="underwriting-checklist" />
      )}

      <PremiumFeature flag="insurancePremium">
        <CollaborationChat policyId={policy.id} data-testid="collaboration-chat" />
      </PremiumFeature>
    </div>
  );
};

export default InsurancePolicyManager;
