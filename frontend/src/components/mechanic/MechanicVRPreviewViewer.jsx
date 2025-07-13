/**
 * File: MechanicVRPreviewViewer.jsx
 * Path: frontend/src/components/mechanic/MechanicVRPreviewViewer.jsx
 * Purpose: VR inspection viewer for mechanics to review 360-degree uploaded inspection photos
 * Author: Cod1 (05060829)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinner } from '@/components/ui/spinner';

/**
 * MechanicVRPreviewViewer Component
 * Purpose: Displays uploaded VR inspection photos using a simulated 360-degree viewer UI
 */
const MechanicVRPreviewViewer = ({ inspectionId }) => {
  const [photoUrls, setPhotoUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`/api/inspection/photos/${inspectionId}`);
        const data = await response.json();
        if (data.photoUrls) {
          setPhotoUrls(data.photoUrls);
        } else {
          toast.warning('No VR photos available for this inspection');
        }
      } catch (err) {
        toast.error('Failed to fetch VR photos');
      } finally {
        setLoading(false);
      }
    };

    if (inspectionId) fetchPhotos();
  }, [inspectionId]);

  if (loading) return <Spinner message="Loading VR Inspection Photos..." />;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">VR Inspection Preview</h3>
      {photoUrls.length === 0 ? (
        <p className="text-gray-500">No VR images available.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photoUrls.map((url, index) => (
            <div key={index} className="rounded overflow-hidden border">
              <img
                src={url}
                alt={`VR View ${index + 1}`}
                className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300"
              />
              <p className="text-center text-xs mt-1 text-gray-500">View {index + 1}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MechanicVRPreviewViewer;
