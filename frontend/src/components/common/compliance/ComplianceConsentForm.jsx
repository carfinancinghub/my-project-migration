// File: ComplianceConsentForm.jsx
// Path: frontend/src/components/common/compliance/ComplianceConsentForm.jsx
// Purpose: Collect GDPR/data privacy consent from users
// Author: Cod2 👑
// Date: 2025-04-28
// Status: Cod2 Crown Certified 👑

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PropTypes from 'prop-types';

const ComplianceConsentForm = ({ userId }) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user consent status from localStorage or server
  useEffect(() => {
    const fetchConsentStatus = async () => {
      try {
        const localConsent = localStorage.getItem(`consent_${userId}`);
        if (localConsent === 'true') {
          setConsentGiven(true);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/user/${userId}/consent`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.consentGiven) {
          setConsentGiven(true);
          localStorage.setItem(`consent_${userId}`, 'true');
        } else {
          setShowModal(true);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch consent status');
        setLoading(false);
        toast.error('Error fetching consent status');
      }
    };

    fetchConsentStatus();
  }, [userId]);

  // Handle consent form submission
  const handleConsentSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.post(
        `/api/user/${userId}/consent`,
        { consentGiven: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConsentGiven(true);
      localStorage.setItem(`consent_${userId}`, 'true');
      setShowModal(false);
      toast.success('Consent recorded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record consent');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Data Privacy Consent</h2>
            <p className="text-sm text-gray-600 mb-4">
              We respect your privacy. Please review and accept our GDPR-compliant privacy policy to continue using our platform.
            </p>
            <form onSubmit={handleConsentSubmit} className="space-y-4">
              <div className="flex items-center">
                <input
                  id="consentCheckbox"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-label="Consent to data privacy policy"
                />
                <label htmlFor="consentCheckbox" className="ml-2 block text-sm text-gray-700">
                  I agree to the privacy policy and terms of service.
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  aria-label="Submit consent form"
                >
                  {saving ? 'Saving...' : 'Agree & Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* No visual component when consent already given */}
    </ErrorBoundary>
  );
};

ComplianceConsentForm.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ComplianceConsentForm;
