// File: PhotoProofUpload.js
// Path: frontend/src/components/common/PhotoProofUpload.js
// 👑 Cod1 Crown Certified — Universal Photo Upload Component for Verification, Evidence & Inspection

import React, { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { theme } from '../../styles/theme';

const PhotoProofUpload = ({ onUploadSuccess, contextLabel = 'Upload Photo Proof' }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return setError('Please select a photo.');

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', caption);

    try {
      setUploading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload/photo`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (onUploadSuccess) onUploadSuccess(res.data);
      setFile(null);
      setCaption('');
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded bg-white shadow">
      <h3 className="text-lg font-semibold">📸 {contextLabel}</h3>

      <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />

      {file && (
        <div className="text-sm text-gray-600">Selected: {file.name}</div>
      )}

      <textarea
        placeholder="Optional caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />

      {error && <p className={theme.errorText}>{error}</p>}
      {uploading ? (
        <LoadingSpinner />
      ) : (
        <Button onClick={handleUpload} disabled={!file}>
          🚀 Upload Photo
        </Button>
      )}
    </div>
  );
};

export default PhotoProofUpload;
