/**
 * File: InspectionPhotoPreviewer.jsx
 * Path: frontend/src/components/mechanic/InspectionPhotoPreviewer.jsx
 * Purpose: Frontend component for uploading and previewing inspection photos,
 *          integrating with /api/inspection/photos endpoint
 * Author: Cod1 (05051515)
 * Date: May 05, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Component Definition ---
/**
 * InspectionPhotoPreviewer Component
 * Purpose:
 *   - Allows mechanics to upload and preview inspection photos
 *   - Integrates with the backend photoRoutes.js mock endpoint
 * Props: None
 * Returns: JSX element for form input, upload, and preview
 */
const InspectionPhotoPreviewer = () => {
  // --- State Management ---
  const [inspectionId, setInspectionId] = useState('');
  const [photos, setPhotos] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [photoUrls, setPhotoUrls] = useState([]);

  // --- Event Handlers ---

  /**
   * handlePhotoChange
   * Purpose:
   *   - Stores the selected file objects in component state
   * Parameters:
   *   - event: React change event from <input type="file" />
   */
  const handlePhotoChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setPhotos(selectedFiles);
  };

  /**
   * handleSubmit
   * Purpose:
   *   - Sends a POST request to upload simulated photos for an inspection
   *   - Handles success and error responses
   * Parameters:
   *   - event: React submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate required inputs
    if (!inspectionId || photos.length === 0) {
      toast.error('Inspection ID and at least one photo are required');
      return;
    }

    try {
      // Generate mock photo names for upload simulation
      const mockPhotoData = photos.map((_, index) => `photo${index + 1}.jpg`);

      const response = await axios.post('/api/inspection/photos', {
        inspectionId,
        photos: mockPhotoData,
      });

      setUploadStatus(response.data.message);
      setPhotoUrls(response.data.photoUrls || []);
      toast.success('Photos uploaded successfully');
    } catch (error) {
      setUploadStatus('Failed');
      toast.error(error.response?.data?.error || 'Upload failed');
    }
  };

  // --- UI Rendering ---
  return (
    <div className="bg-white rounded shadow p-6 max-w-lg mx-auto">
      <h3 className="text-xl font-semibold mb-4">📸 Upload Inspection Photos</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Inspection ID
          </label>
          <input
            type="text"
            value={inspectionId}
            onChange={(e) => setInspectionId(e.target.value)}
            placeholder="Enter Inspection ID"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Photos
          </label>
          <input
            type="file"
            multiple
            onChange={handlePhotoChange}
            accept="image/*"
            className="block w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Photos
        </button>
      </form>

      {uploadStatus && (
        <p className="mt-4 text-sm font-medium text-gray-700">
          Upload Status: <span className="text-indigo-600">{uploadStatus}</span>
        </p>
      )}

      {photoUrls.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold">Uploaded Photos:</h4>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {photoUrls.map((url, index) => (
              <li key={index}>{url}</li>
            ))}
          </ul>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default InspectionPhotoPreviewer;
