import React, { useState } from 'react';
import axios from 'axios';
import './BulkUpload.css';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
    setUploadError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a CSV file.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/listings/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setUploadStatus(res.data.message);
      setFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      const msg =
        err.response?.data?.error || 'Upload failed. Please try again.';
      setUploadError(msg);
    }
  };

  return (
    <div className="bulk-upload-container bg-white p-4 rounded shadow-md max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Bulk Upload Listings (CSV)</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 block w-full"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full"
      >
        Upload
      </button>

      {uploadStatus && (
        <p className="text-green-600 mt-4 font-medium">{uploadStatus}</p>
      )}
      {uploadError && (
        <p className="text-red-600 mt-4 font-medium">{uploadError}</p>
      )}
    </div>
  );
};

export default BulkUpload;