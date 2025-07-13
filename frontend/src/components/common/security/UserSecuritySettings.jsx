// File: UserSecuritySettings.jsx
// Path: frontend/src/components/common/security/UserSecuritySettings.jsx
// Purpose: Manage user security settings (2FA toggle, password reset)
// Author: Cod2 👑
// Date: 2025-04-28
// Status: Cod2 Crown Certified 👑

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PropTypes from 'prop-types';

const UserSecuritySettings = ({ userId }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user security settings on mount
  useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/user/${userId}/security`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTwoFactorEnabled(response.data?.twoFactorEnabled || false);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load security settings');
        setLoading(false);
        toast.error('Error loading security settings');
      }
    };

    fetchSecuritySettings();
  }, [userId]);

  // Handle toggle 2FA setting
  const handleToggle2FA = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.post(
        `/api/user/${userId}/security`,
        { twoFactorEnabled: !twoFactorEnabled },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTwoFactorEnabled((prev) => !prev);
      toast.success(`Two-Factor Authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update 2FA setting');
    } finally {
      setSaving(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.post(
        `/api/user/${userId}/security`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Security Settings</h2>
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          {/* Two-Factor Authentication Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Two-Factor Authentication (2FA)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Two-Factor Authentication provides an extra layer of security for your account.
            </p>
            <button
              onClick={handleToggle2FA}
              disabled={saving}
              className={`px-4 py-2 rounded-lg ${
                twoFactorEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white transition-colors`}
              aria-label="Toggle Two-Factor Authentication"
            >
              {saving ? 'Saving...' : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          {/* Password Reset Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Change Password</h3>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                  aria-label="New password input"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                  aria-label="Confirm new password input"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                aria-label="Submit password reset"
              >
                {saving ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

UserSecuritySettings.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserSecuritySettings;
