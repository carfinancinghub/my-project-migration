// File: LenderOnboardingForm.js
// Path: frontend/src/components/lender/LenderOnboardingForm.js
// 👑 Cod1 Crown Certified — Smart Lender Identity & Compliance Intake w/ Bonus Disruption Enhancements

import React, { useState } from 'react';
import axios from 'axios';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const LenderOnboardingForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    licenseNumber: '',
    interestRateRange: '',
    maxLoanAmount: '',
    documents: null,
    acceptedTerms: false,
    autoMatch: false,
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = new FormData();
      for (const key in formData) {
        payload.append(key, formData[key]);
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/api/lender/onboarding`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
    } catch (err) {
      console.error('Onboarding failed:', err);
      setError('❌ Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <p className="text-green-600 font-semibold">✅ Onboarding submitted successfully!</p>;
  }

  return (
    <Card className="p-6 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold">Lender Onboarding Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Company Name</label>
          <input name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">License Number</label>
          <input name="licenseNumber" required value={formData.licenseNumber} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Interest Rate Range (%)</label>
          <input name="interestRateRange" required value={formData.interestRateRange} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Max Loan Amount ($)</label>
          <input name="maxLoanAmount" required type="number" value={formData.maxLoanAmount} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Upload License Document</label>
          <input name="documents" type="file" accept="application/pdf" required onChange={handleChange} className="block w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium">Specialty Tags (comma-separated)</label>
          <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Auto, Classic, High-Risk, Commercial..." className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex items-center">
          <input name="autoMatch" type="checkbox" checked={formData.autoMatch} onChange={handleChange} className="mr-2" />
          <label className="text-sm">Enable auto-match for future financing requests</label>
        </div>

        <div className="flex items-center">
          <input name="acceptedTerms" type="checkbox" required onChange={handleChange} className="mr-2" />
          <label className="text-sm">I agree to the compliance and lending policies.</label>
        </div>

        {error && <p className={theme.errorText}>{error}</p>}

        {submitting ? <LoadingSpinner /> : <Button type="submit">🚀 Submit Onboarding</Button>}
      </form>
    </Card>
  );
};

export default LenderOnboardingForm;
