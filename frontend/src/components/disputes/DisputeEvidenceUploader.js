// File: DisputeEvidenceUploader.js
// Path: frontend/src/components/disputes/DisputeEvidenceUploader.js

import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';

const DisputeEvidenceUploader = ({ disputeId }) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('evidence', file);

    setUploading(true);
    try {
      const response = await fetch(`/api/disputes/${disputeId}/evidence`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      toast.success('📤 Evidence uploaded successfully');
    } catch (err) {
      console.error('Evidence upload error:', err);
      toast.error('❌ Failed to upload evidence');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,audio/*,video/*,application/pdf"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
        aria-label="Upload dispute evidence"
      >
        {uploading ? 'Uploading...' : 'Upload Evidence'}
      </button>
    </div>
  );
};

export default DisputeEvidenceUploader;
