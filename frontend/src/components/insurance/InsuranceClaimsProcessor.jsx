/**
 * @file InsuranceClaimsProcessor.jsx
 * @path frontend/src/components/insurance/InsuranceClaimsProcessor.jsx
 * @description Insurance claims management UI with real-time updates, AI risk scoring, and gamified approval feedback for CFH platform. Crown Certified for Rivers Auction Live Test Prep - May 07, 2025, 12:00 PST.
 * @component
 * @wow Real-time status updates, AI-driven claim insights, and gamified feedback
 * @author Cod2 - May 07, 2025, 12:00 PST
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PremiumFeature from '@components/common/PremiumFeature';
import ToastManager from '@components/common/ToastManager';
import ConfettiHelper from '@utils/ConfettiHelper';
import styles from '@styles/InsuranceClaimsProcessor.css';

const InsuranceClaimsProcessor = () => {
  const [claims, setClaims] = useState([]);
  const [form, setForm] = useState({ policyId: '', amount: '', description: '' });
  const [loading, setLoading] = useState(false);

  const fetchClaims = async () => {
    try {
      const res = await fetch('/api/claims');
      const data = await res.json();

      const enrichedClaims = await Promise.all(
        data.map(async (claim) => {
          try {
            // Assumes backend maps claim ID to policyId for predictClaimLikelihood
            const riskRes = await fetch(`/api/claims/${claim._id}/risk`);
            const riskData = await riskRes.json();
            return { ...claim, risk: riskData?.score || null };
          } catch (err) {
            console.error(`Failed to fetch risk score for claim ${claim._id}`, err.message);
            ToastManager.error(`Failed to fetch risk score for claim ${claim._id}`);
            return { ...claim, risk: null };
          }
        })
      );

      setClaims(enrichedClaims);
    } catch (err) {
      ToastManager.error('Failed to fetch claims.');
      console.error('fetchClaims error:', err.message);
    }
  };

  useEffect(() => {
    fetchClaims();
    const interval = setInterval(() => {
      if (!document.hidden) fetchClaims();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { policyId, amount, description } = form;
    if (!policyId || !amount || !description || description.length < 10 || parseFloat(amount) <= 0) {
      return ToastManager.error('Please enter valid claim details.');
    }

    try {
      setLoading(true);
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Submission failed');
      ToastManager.success('Claim submitted successfully');
      setForm({ policyId: '', amount: '', description: '' });
      fetchClaims();
    } catch (err) {
      ToastManager.error('Failed to submit claim.');
      console.error('handleSubmit error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/claims/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Status update failed');
      ToastManager.success(`Claim ${status}`);
      if (status === 'approved') ConfettiHelper.trigger();
      fetchClaims();
    } catch (err) {
      ToastManager.error('Failed to update claim status.');
      console.error('updateStatus error:', err.message);
    }
  };

  return (
    <section className={styles.container} aria-label="Claims Processor" role="region" data-testid="claims-processor">
      <h2>Insurance Claims</h2>

      <form className={styles.claimForm} aria-label="New Claim Form" role="form" onSubmit={handleSubmit}>
        <input type="text" name="policyId" value={form.policyId} placeholder="Policy ID" onChange={handleChange} className={styles.input} required />
        <input type="number" name="amount" value={form.amount} placeholder="Amount" onChange={handleChange} className={styles.input} min="0.01" step="0.01" required />
        <textarea name="description" value={form.description} placeholder="Description" onChange={handleChange} className={styles.textarea} required minLength={10} />
        <button type="submit" disabled={loading}>Submit Claim</button>
      </form>

      <ul className={styles.claimList} aria-label="Claim List" role="list">
        {claims.map((claim) => (
          <li key={claim._id} className={styles.claimItem} role="listitem" data-testid={`claim-${claim._id}`}>
            <strong>Claim ID:</strong> {claim._id} | <strong>Policy:</strong> {claim.policyId} | <strong>Status:</strong> {claim.status} | <strong>Amount:</strong> ${claim.amount}
            <br />
            <PremiumFeature>
              {claim.risk !== null && <span><strong>Risk Score:</strong> {(claim.risk * 100).toFixed(2)}%</span>}
            </PremiumFeature>
            <div>
              <button onClick={() => updateStatus(claim._id, 'approved')}>Approve</button>
              <button onClick={() => updateStatus(claim._id, 'denied')}>Deny</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

InsuranceClaimsProcessor.propTypes = {};

export default InsuranceClaimsProcessor;
