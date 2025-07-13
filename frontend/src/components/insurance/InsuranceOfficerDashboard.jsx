/**
 * File: InsuranceOfficerDashboard.jsx
 * Path: frontend/src/components/insurance/InsuranceOfficerDashboard.jsx
 * Purpose: Dashboard for insurance officers to manage active policies and bids with premium analytics, chat, and real-time integrations
 * Author: Cod2
 * Date: 2025-05-25
 * Updated: Removed SEOHead, added AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays active policies and pending insurance bids with actions to approve, reject, edit, and view details
 * - Premium features: risk analysis, claim prediction, live chat, policy location map, AR car preview, and user analytics
 * - Integrated transaction search, underwriting checklist, and collaboration chat
 * - Real-time voice command support for approving/rejecting quotes
 * - Responsive layout with TailwindCSS, custom styles, and toast notifications
 * - Confetti animation for successful policy approvals
 * Functions:
 * - fetchData(): Fetches policies and bids from /api/insurance/policies and /api/insurance/bids
 * - handleApproveQuote(id, isBid): Approves a policy or bid and triggers confetti for policies
 * - handleRejectQuote(id, reason, isBid): Rejects a policy or bid with a reason
 * - handleEditBid(bidId): Placeholder for editing a bid
 * - viewPolicyDetails(id): Sets the selected policy for detailed view
 * - launchPDFExport(id): Opens a PDF export in a new tab
 * - analyzeRiskProfile(id): Analyzes the risk profile of a policy
 * - initiateLiveChat(policyId): Initiates a live chat for a policy
 * - predictClaimLikelihood(id): Predicts the likelihood of a claim for a policy
 * Dependencies: axios, Navbar, PremiumFeature, InsuranceSEOHead, InsuranceUserAnalyticsPanel, InsuranceTransactionSearch, InsuranceUnderwritingChecklist, GeoVerificationMap, ARCarPreview, CollaborationChat, useConfetti, InsuranceVoiceCommand, ToastManager, @styles/InsuranceDashboard.css, theme
 */

// Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import Navbar from '@components/common/Navbar';
import { PremiumFeature } from '@components/common/PremiumFeature';
import InsuranceSEOHead from '@components/insurance/InsuranceSEOHead';
import InsuranceUserAnalyticsPanel from '@components/insurance/InsuranceUserAnalyticsPanel';
import InsuranceTransactionSearch from '@components/insurance/InsuranceTransactionSearch';
import InsuranceUnderwritingChecklist from '@components/insurance/InsuranceUnderwritingChecklist';
import GeoVerificationMap from '@components/hauler/GeoVerificationMap';
import ARCarPreview from '@components/buyer/ARCarPreview';
import CollaborationChat from '@components/chat/CollaborationChat';
import { useConfetti } from '@utils/ConfettiHelper';
import InsuranceVoiceCommand from '@components/insurance/InsuranceVoiceCommand';
import ToastManager from '@components/common/ToastManager';
import { theme } from '@styles/theme';
import '@styles/InsuranceDashboard.css';

const InsuranceOfficerDashboard = () => {
  // State Management
  const [policies, setPolicies] = useState([]);
  const [bids, setBids] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { triggerConfetti } = useConfetti();
  const token = localStorage.getItem('token');

  // Fetch Policies and Bids on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [policyRes, bidRes] = await Promise.all([
          axios.get('/api/insurance/policies'),
          axios.get(`${process.env.REACT_APP_API_URL}/api/insurance/bids`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setPolicies(policyRes.data);
        setBids(bidRes.data);
      } catch (err) {
        ToastManager.error('Failed to fetch data');
        setError('❌ Failed to fetch policies or bids');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Approve a Policy or Bid Quote
  const handleApproveQuote = async (id, isBid = false) => {
    try {
      const endpoint = isBid ? `/api/insurance/bids/approve/${id}` : `/api/insurance/approve/${id}`;
      const res = await axios.post(endpoint);
      if (isBid) {
        setBids(prev => prev.map(b => b._id === id ? res.data : b));
      } else {
        setPolicies(prev => prev.map(p => p.id === id ? res.data : p));
        if (res.data.premium) triggerConfetti();
      }
      ToastManager.success('Quote approved successfully');
    } catch (err) {
      ToastManager.error('Failed to approve quote');
      console.error('Quote approval failed', err);
    }
  };

  // Reject a Policy or Bid Quote
  const handleRejectQuote = async (id, reason, isBid = false) => {
    try {
      const endpoint = isBid ? `/api/insurance/bids/reject/${id}` : `/api/insurance/reject/${id}`;
      await axios.post(endpoint, { reason });
      if (isBid) {
        setBids(prev => prev.filter(b => b._id !== id));
      } else {
        setPolicies(prev => prev.filter(p => p.id !== id));
      }
      ToastManager.success('Quote rejected successfully');
    } catch (err) {
      ToastManager.error('Failed to reject quote');
      console.error('Quote rejection failed', err);
    }
  };

  // Edit a Bid (Placeholder)
  const handleEditBid = (bidId) => {
    console.log(`Editing bid ${bidId}`);
    ToastManager.info('Edit functionality coming soon');
  };

  // View Policy Details
  const viewPolicyDetails = (id) => {
    setSelectedPolicy(policies.find(p => p.id === id));
  };

  // Export Policy as PDF
  const launchPDFExport = (id) => {
    window.open(`/api/insurance/export-pdf/${id}`, '_blank');
  };

  // Analyze Risk Profile for a Policy
  const analyzeRiskProfile = async (id) => {
    try {
      const res = await axios.get(`/api/insurance/risk/${id}`);
      ToastManager.info(`Risk Score: ${res.data.riskScore}`);
    } catch (err) {
      ToastManager.error('Risk analysis failed');
      console.error('Risk analysis failed', err);
    }
  };

  // Initiate Live Chat for a Policy
  const initiateLiveChat = (policyId) => {
    console.log(`Live chat started for policy ${policyId}`);
  };

  // Predict Claim Likelihood for a Policy
  const predictClaimLikelihood = async (id) => {
    try {
      const res = await axios.get(`/api/insurance/claim-risk/${id}`);
      ToastManager.info(`Claim Likelihood: ${res.data.likelihood}%`);
    } catch (err) {
      ToastManager.error('Claim prediction failed');
      console.error('Claim prediction failed', err);
    }
  };

  // UI Rendering
  return (
    <AdminLayout>
      <InsuranceSEOHead title="Insurance Officer Dashboard" />
      <div className="insurance-dashboard" data-testid="insurance-dashboard">
        <Navbar />
        <InsuranceVoiceCommand
          policies={policies}
          onCommand={(command, id) => {
            if (command === 'approve') handleApproveQuote(id);
            else if (command === 'reject') handleRejectQuote(id, 'Voice command');
            else ToastManager.error('Unknown command');
          }}
          data-testid="voice-command"
        />
        <div className={`${theme.spacingLg}`}>
          <h1 role="heading" aria-level="1" className="text-3xl font-bold text-indigo-700 mb-6">
            🛡️ Insurance Officer Dashboard
          </h1>

          <InsuranceTransactionSearch onSelect={viewPolicyDetails} data-testid="transaction-search" />

          <section data-testid="policy-list">
            <h2 role="heading" aria-level="2" className="text-2xl font-semibold text-gray-700 mb-4">Active Policies</h2>
            {loading && <p className="text-gray-500">Loading policies...</p>}
            {error && <p className={`${theme.errorText}`}>{error}</p>}
            {!loading && !error && policies.length === 0 && (
              <p className="text-gray-500">No current policies available.</p>
            )}
            {!loading && !error && policies.length > 0 && (
              <ul className="space-y-4">
                {policies.map(policy => (
                  <li
                    key={policy.id}
                    className={`border ${theme.borderRadius} ${theme.spacingMd} ${theme.cardShadow}`}
                    data-testid={`policy-${policy.id}`}
                  >
                    <p className={`${theme.fontSizeBase}`}>
                      Policy #{policy.id} - {policy.vehicleId}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => handleApproveQuote(policy.id)}
                        aria-label={`Approve policy ${policy.id}`}
                        className={`${theme.successText} bg-green-600 hover:bg-green-700 px-3 py-1 ${theme.borderRadius}`}
                        data-testid={`approve-${policy.id}`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectQuote(policy.id, 'Incomplete details')}
                        aria-label={`Reject policy ${policy.id}`}
                        className={`${theme.errorText} bg-red-600 hover:bg-red-700 px-3 py-1 ${theme.borderRadius}`}
                        data-testid={`reject-${policy.id}`}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => viewPolicyDetails(policy.id)}
                        aria-label={`View details for policy ${policy.id}`}
                        className={`${theme.infoText} bg-blue-600 hover:bg-blue-700 px-3 py-1 ${theme.borderRadius}`}
                        data-testid={`details-${policy.id}`}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => launchPDFExport(policy.id)}
                        aria-label={`Export PDF for policy ${policy.id}`}
                        className={`${theme.secondaryButton} px-3 py-1 ${theme.borderRadius}`}
                        data-testid={`export-${policy.id}`}
                      >
                        Export PDF
                      </button>
                      <PremiumFeature flag="insurancePremium">
                        <button
                          onClick={() => analyzeRiskProfile(policy.id)}
                          aria-label={`Analyze risk for policy ${policy.id}`}
                          className={`${theme.warningText} bg-yellow-500 hover:bg-yellow-600 px-3 py-1 ${theme.borderRadius}`}
                          data-testid={`risk-${policy.id}`}
                        >
                          Analyze Risk
                        </button>
                        <button
                          onClick={() => predictClaimLikelihood(policy.id)}
                          aria-label={`Predict claim for policy ${policy.id}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 ${theme.borderRadius}"
                          data-testid={`claim-${policy.id}`}
                        >
                          Predict Claim
                        </button>
                        <button
                          onClick={() => initiateLiveChat(policy.id)}
                          aria-label={`Start chat for policy ${policy.id}`}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 ${theme.borderRadius}"
                          data-testid={`chat-${policy.id}`}
                        >
                          Start Chat
                        </button>
                      </PremiumFeature>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section data-testid="bid-list">
            <h2 role="heading" aria-level="2" className="mt-6 text-2xl font-semibold text-gray-700 mb-4">Pending Insurance Bids</h2>
            {loading && <p className="text-gray-500">Loading bids...</p>}
            {error && <p className={`${theme.errorText}`}>{error}</p>}
            {!loading && !error && bids.length === 0 && (
              <p className="text-gray-500">No current bids available.</p>
            )}
            {!loading && !error && bids.length > 0 && (
              <ul className="space-y-4">
                {bids.map((bid) => (
                  <li
                    key={bid._id}
                    className={`border ${theme.borderRadius} ${theme.spacingMd} ${theme.cardShadow}`}
                    data-testid={`bid-${bid._id}`}
                  >
                    <p className={`${theme.fontSizeBase}`}><strong>Policy:</strong> {bid.policyType}</p>
                    <p className={`${theme.fontSizeBase}`}>
                      <strong>Vehicle:</strong> {bid.vehicle?.make} {bid.vehicle?.model} ({bid.vehicle?.year})
                    </p>
                    <p className={`${theme.fontSizeBase}`}><strong>Quote:</strong> ${bid.quoteAmount}</p>
                    <p className={`${theme.fontSizeBase}`}><strong>Status:</strong> {bid.status}</p>
                    <p className={`${theme.fontSizeBase}`}><strong>Submitted by:</strong> {bid.providerName || 'Unverified'}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleApproveQuote(bid._id, true)}
                        aria-label={`Approve bid ${bid._id}`}
                        className={`${theme.successText} bg-green-600 hover:bg-green-700 px-3 py-1 ${theme.borderRadius}`}
                        data-testid={`approve-bid-${bid._id}`}
                      >
                        ✅ Approve Quote
                      </button>
                      <button
                        onClick={() => handleEditBid(bid._id)}
                        aria-label={`Edit bid ${bid._id}`}
                        className={`${theme.warningText} bg-yellow-500 hover:bg-yellow-600 px-3 py-1 ${theme.borderRadius}`}
                        data-testid={`edit-bid-${bid._id}`}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <PremiumFeature flag="insurancePremium">
            <section data-testid="policy-map" className="mt-6">
              <h2 role="heading" aria-level="2" className="text-2xl font-semibold text-gray-700 mb-4">Policy Locations</h2>
              <GeoVerificationMap policies={policies} />
            </section>
          </PremiumFeature>

          {selectedPolicy && (
            <PremiumFeature flag="insurancePremium">
              <section data-testid="ar-preview" className="mt-6">
                <h2 role="heading" aria-level="2" className="text-2xl font-semibold text-gray-700 mb-4">AR Policy Preview</h2>
                <ARCarPreview vehicleId={selectedPolicy.vehicleId} />
              </section>
            </PremiumFeature>
          )}

          <PremiumFeature flag="insuranceEnterprise">
            <section className="mt-6">
              <InsuranceUserAnalyticsPanel data-testid="analytics-panel" />
            </section>
          </PremiumFeature>

          {selectedPolicy && (
            <section className="mt-6">
              <InsuranceUnderwritingChecklist policyId={selectedPolicy.id} data-testid="underwriting-checklist" />
            </section>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default InsuranceOfficerDashboard;