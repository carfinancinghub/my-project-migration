// File: VRTourLauncher.jsx
// Path: C:\CFH\frontend\src\components\premium\VRTourLauncher.jsx
// Purpose: Launch VR vehicle tours for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/premium

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { createVRTour, startVRTour } from '@services/api/premium';

const VRTourLauncher = ({ userId, vehicleId }) => {
  const [tourUrl, setTourUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLaunchTour = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { tourId } = await createVRTour(userId, vehicleId);
      const { vrTourUrl } = await startVRTour(userId, tourId);
      setTourUrl(vrTourUrl);
      logger.info(`[VRTourLauncher] Launched VR tour for userId: ${userId}, vehicleId: ${vehicleId}`);
    } catch (err) {
      logger.error(`[VRTourLauncher] Failed to launch VR tour for userId ${userId}: ${err.message}`, err);
      setError('Failed to launch VR tour. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">VR Vehicle Tour</h2>
      {isLoading ? (
        <div className="text-center text-gray-500" aria-live="polite">Launching VR tour...</div>
      ) : error ? (
        <div className="text-center text-red-600 bg-red-100 border border-red-300 rounded-md p-2" role="alert">{error}</div>
      ) : tourUrl ? (
        <a
          href={tourUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Enter VR Tour
        </a>
      ) : (
        <button
          onClick={handleLaunchTour}
          className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Launch VR Tour
        </button>
      )}
    </div>
  );
};

VRTourLauncher.propTypes = {
  userId: PropTypes.string.isRequired,
  vehicleId: PropTypes.string.isRequired
};

export default VRTourLauncher;