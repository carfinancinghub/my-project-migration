/**
 * EscrowDocumentGallery.jsx
 * Path: frontend/src/components/escrow/EscrowDocumentGallery.jsx
 * Purpose: Display a responsive gallery of uploaded escrow documents with previews and download options.
 * 👑 Crown Pyramid Escrow System
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const EscrowDocumentGallery = ({ documents, escrowId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleImageClick = (doc) => {
    if (doc.type !== 'application/pdf') {
      setSelectedImage(doc);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to download documents');
      setIsDownloadingAll(false);
      return;
    }

    try {
      const response = await axios.get(`/api/escrow/${escrowId}/download-all`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `escrow-${escrowId}-documents.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Documents downloaded successfully');
    } catch (err) {
      toast.error('Failed to download documents');
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Document Gallery</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {documents.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No documents uploaded yet
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                  <div
                    key={doc.name}
                    className="group bg-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow animate-fadeIn"
                    role="button"
                    aria-label={`View or download ${doc.name}`}
                  >
                    {doc.type === 'application/pdf' ? (
                      <a
                        href={doc.url}
                        download
                        className="flex items-center gap-3 text-blue-500 hover:text-blue-700"
                        aria-label={`Download ${doc.name}`}
                      >
                        <span className="text-2xl">📄</span>
                        <span className="text-sm truncate">{doc.name}</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => handleImageClick(doc)}
                        className="w-full text-left"
                        aria-label={`View ${doc.name}`}
                      >
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="w-full h-32 object-cover rounded group-hover:scale-105 transition-transform"
                        />
                        <p className="text-sm text-gray-700 mt-2 truncate">{doc.name}</p>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleDownloadAll}
                className={`mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors ${
                  isDownloadingAll ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isDownloadingAll}
                aria-label="Download all documents as zip"
              >
                {isDownloadingAll ? 'Downloading...' : 'Download All'}
              </button>
            </>
          )}
        </div>

        {/* Modal for Image Zoom */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn"
            role="dialog"
            aria-label={`Full-size view of ${selectedImage.name}`}
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-3xl w-full">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-auto rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200"
                aria-label="Close image modal"
              >
                ✕
              </button>
            </div>
          </div>
        )}
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

EscrowDocumentGallery.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  escrowId: PropTypes.string.isRequired,
};

export default EscrowDocumentGallery;