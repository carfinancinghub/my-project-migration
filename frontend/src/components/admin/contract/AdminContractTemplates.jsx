// File: AdminContractTemplates.js
// Path: frontend/src/components/admin/contracts/AdminContractTemplates.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Card from '../../common/Card';
import Button from '../../common/Button';

const AdminContractTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/contracts/templates`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTemplates(res.data);
      } catch (err) {
        console.error('Failed to load templates', err);
        setError('❌ Failed to fetch contract templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleDownload = async (id, name) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/contracts/templates/${id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Error downloading template', err);
      alert('❌ Error downloading template');
    }
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">📑 Contract Templates</h1>

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && templates.length === 0 && (
            <p className="text-gray-500">No templates available.</p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <Card key={tpl._id} className="hover:shadow-md">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <p className="font-semibold">{tpl.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Updated: {new Date(tpl.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <Button onClick={() => handleDownload(tpl._id, tpl.filename || tpl.name)}>
                      📥 Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminContractTemplates;
