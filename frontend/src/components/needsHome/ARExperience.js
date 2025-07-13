// File: ARExperience.js
// Path: frontend/src/components/needsHome/ARExperience.js
// Purpose: AR visualization for car listings using WebXR and Three.js
// Author: Cod2
// Date: 2025-04-29
// 👑 Cod2 Crown Certified

import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import axios from 'axios';
import PropTypes from 'prop-types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const ARExperience = ({ listingId }) => {
  const [carModelUrl, setCarModelUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef();

  // ---------------- Fetch 3D model URL from listing ----------------
  useEffect(() => {
    const fetchModel = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/listings/${listingId}/model`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCarModelUrl(response.data.modelUrl);
        setLoading(false);
      } catch (err) {
        setError('Failed to load 3D model');
        toast.error('Unable to load AR model');
        setLoading(false);
      }
    };

    if (listingId) fetchModel();
  }, [listingId]);

  // ---------------- Load 3D Model ----------------
  const render3DModel = () => {
    // Placeholder for dynamic loading logic (GLTFLoader, etc.)
    return (
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AR Experience Viewer</h2>
        <div
          ref={canvasRef}
          className="relative w-full h-[500px] bg-gray-200 rounded-lg shadow-md"
          role="region"
          aria-label="3D car AR viewer"
        >
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />
            {render3DModel()}
          </Canvas>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Use your mouse to explore the car in 3D. Mobile AR view coming soon!
        </p>
      </div>
    </ErrorBoundary>
  );
};

ARExperience.propTypes = {
  listingId: PropTypes.string.isRequired,
};

export default ARExperience;
