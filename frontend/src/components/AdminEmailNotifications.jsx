/**
 * AdminEmailNotifications.jsx
 * Path: frontend/src/components/admin/AdminEmailNotifications.jsx
 * Purpose: Manage admin email templates (e.g., user bans, system alerts) with table view.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const AdminEmailNotifications = ({ adminId }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch email templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view email templates');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get(`/api/admin/email-templates`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTemplates(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load email templates');
        setLoading(false);
        toast.error('Error loading templates');
      }
    };

    fetchTemplates();
  }, [adminId]);

  // Handle template update
  const handleUpdate = async (templateId, updatedContent) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.post(
        `/api/admin/email-templates`,
        { templateId, content: updatedContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Template updated successfully');
      setTemplates((prev) =>
        prev.map((tpl) => (tpl.id === templateId ? { ...tpl, content: updatedContent } : tpl))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update template');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Email Notifications</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {templates.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No email templates available. 🚀
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-gray-600">Type</th>
                    <th className="px-4 py-2 text-left text-gray-600">Content</th>
                    <th className="px-4 py-2 text-left text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((tpl) => (
                    <tr key={tpl.id} className="border-b hover:bg-gray-50 animate-fadeIn">
                      <td className="px-4 py-2 text-gray-700">{tpl.type}</td>
                      <td className="px-4 py-2">
                        <textarea
                          value={tpl.content}
                          onChange={(e) =>
                            setTemplates((prev) =>
                              prev.map((t) =>
                                t.id === tpl.id ? { ...t, content: e.target.value } : t
                              )
                            )
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm"
                          aria-label={`Edit template ${tpl.type}`}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleUpdate(tpl.id, tpl.content)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                          aria-label={`Save template ${tpl.type}`}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

export default AdminEmailNotifications;
