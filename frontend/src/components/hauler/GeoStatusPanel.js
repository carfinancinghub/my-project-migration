// File: GeoStatusPanel.js
// Path: frontend/src/components/hauler/GeoStatusPanel.js
// 👑 Cod1 Certified — Real-Time Location Panel for Hauler GPS Validation

import React, { useEffect, useState } from 'react';

const GeoStatusPanel = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Failed to retrieve location');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <div className="bg-white border rounded p-4 shadow-sm text-sm">
      <h3 className="font-semibold text-md mb-1">📍 Current Location</h3>
      {error && <p className="text-red-500">{error}</p>}
      {coords ? (
        <p className="text-gray-700">
          Latitude: <strong>{coords.latitude.toFixed(5)}</strong>
          <br />
          Longitude: <strong>{coords.longitude.toFixed(5)}</strong>
        </p>
      ) : (
        !error && <p className="text-gray-400">Fetching location...</p>
      )}
    </div>
  );
};

export default GeoStatusPanel;
