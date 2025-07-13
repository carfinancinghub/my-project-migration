/**
 * File: MechanicVRPhotoUploader.jsx
 * Path: frontend/src/components/mechanic/MechanicVRPhotoUploader.jsx
 * Purpose: Upload and preview 360° inspection photos for VR inspection experiences
 * Author: Cod1 (05060812)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * MechanicVRPhotoUploader Component
 * Purpose: Enables mechanics to upload 360° inspection photos and preview them in a simple viewer
 * Props: inspectionId (string)
 */
const MechanicVRPhotoUploader = ({ inspectionId }) => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handlePhotoChange = (event) => {
    setPhotos(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    if (!inspectionId || photos.length === 0) {
      toast.error('Inspection ID and photo files are required.');
      return;
    }

    setUploading(true);
    try {
      // Mock upload request
      const response = await axios.post('/api/inspection/photos', {
        inspectionId,
        photos: photos.map((_, i) => `vr_photo_${i + 1}.jpg`),
      });

      setUploadedUrls(response.data.photoUrls || []);
      toast.success('VR photos uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h3 className="text-lg font-semibold">Upload VR Inspection Photos</h3>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoChange}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Photos'}
      </button>

      {uploadedUrls.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Uploaded Photos:</h4>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {uploadedUrls.map((url, idx) => (
              <li key={idx} className="border rounded p-1">
                <img src={url} alt={`VR Photo ${idx + 1}`} className="w-full h-auto" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MechanicVRPhotoUploader;
