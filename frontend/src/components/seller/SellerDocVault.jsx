/**
 * SellerDocVault.jsx
 * Path: frontend/src/components/seller/SellerDocVault.jsx
 * Purpose: Provide a secure document vault for sellers to upload, view, download, and delete car-related files.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerDocVault = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/docs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(response.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)));
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load documents');
        setIsLoading(false);
        toast.error('Error loading documents');
      }
    };
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ['application/pdf', 'application/msword', 'image/jpeg'].includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      toast.error('Please select a PDF, DOC, or JPG file');
      setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/seller/docs/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setDocuments([response.data, ...documents]);
      setFile(null);
      e.target.reset();
      toast.success('Document uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/seller/docs/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Document downloaded successfully');
    } catch (err) {
      toast.error('Failed to download document');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/seller/docs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(documents.filter((doc) => doc.id !== id));
        toast.success('Document deleted successfully');
      } catch (err) {
        toast.error('Failed to delete document');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Vault</h1>
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <form onSubmit={handleUpload} className="space-y-4">
            <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
              Upload Document (PDF, DOC, JPG)
            </label>
            <input
              type="file"
              id="fileUpload"
              accept=".pdf,.doc,.jpg"
              onChange={handleFileChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Upload document file"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              aria-label="Upload selected document"
              disabled={!file}
            >
              Upload
            </button>
          </form>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <img
              src="/empty-vault.svg"
              alt="Empty document vault"
              className="mx-auto h-32 w-32 mb-4 opacity-50"
            />
            <p className="text-gray-500 text-lg">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow animate-fadeIn"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.type.toUpperCase()}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between gap-3">
                  <button
                    onClick={() => handleDownload(doc.id, doc.name)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    aria-label={`Download document ${doc.name}`}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    aria-label={`Delete document ${doc.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerDocVault;