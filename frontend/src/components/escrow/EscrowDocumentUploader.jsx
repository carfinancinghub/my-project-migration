/**
 * EscrowDocumentUploader.jsx
 * Path: frontend/src/components/escrow/EscrowDocumentUploader.jsx
 * Purpose: Allow officers to upload documents (images, PDFs) for an escrow transaction with previews and feedback.
 * 👑 Crown Pyramid Escrow System
 */

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const EscrowDocumentUploader = ({ escrowId }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File ${file.name} is not a valid type (jpg, png, pdf allowed)`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File ${file.name} exceeds 10MB limit`;
    }
    return null;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = files.length + selectedFiles.length;

    if (totalFiles > MAX_FILES) {
      toast.error(`Cannot upload more than ${MAX_FILES} files`);
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of selectedFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        continue;
      }
      validFiles.push(file);
      newPreviews.push({
        name: file.name,
        url: ALLOWED_TYPES.includes(file.type) && file.type !== 'application/pdf' ? URL.createObjectURL(file) : null,
        type: file.type,
      });
    }

    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = null; // Reset input
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('No files selected');
      return;
    }

    setIsUploading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to upload documents');
      setIsUploading(false);
      toast.error('Authentication required');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('documents', file));

    try {
      const response = await axios.post(`/api/escrow/${escrowId}/upload-doc`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedDocs((prev) => [
        ...prev,
        ...files.map((file) => ({
          name: file.name,
          url: response.data.urls?.[file.name] || null, // Assuming API returns URLs
          type: file.type,
        })),
      ]);
      setFiles([]);
      setPreviews([]);
      toast.success('Documents uploaded successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to upload documents';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Escrow Documents</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* File Input */}
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              disabled={isUploading}
            >
              Upload Documents
            </button>
            {isUploading && <LoadingSpinner />}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          {/* File Previews */}
          {previews.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Selected Files</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative bg-gray-100 rounded-lg p-4 flex items-center animate-fadeIn"
                  >
                    {preview.url ? (
                      <img
                        src={preview.url}
                        alt={preview.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded mr-4">
                        <span className="text-gray-500">PDF</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 truncate">{preview.name}</p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      disabled={isUploading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpload}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                disabled={isUploading || files.length === 0}
              >
                Submit Uploads
              </button>
            </div>
          )}

          {/* Uploaded Documents */}
          {uploadedDocs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-lg p-4 flex items-center animate-fadeIn"
                  >
                    {doc.url && doc.type !== 'application/pdf' ? (
                      <img
                        src={doc.url}
                        alt={doc.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded mr-4">
                        <span className="text-gray-500">PDF</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 truncate">{doc.name}</p>
                    </div>
                  </div>
                ))}
              </div>
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

EscrowDocumentUploader.propTypes = {
  escrowId: PropTypes.string.isRequired,
};

export default EscrowDocumentUploader;