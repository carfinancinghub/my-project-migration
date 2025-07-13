// File: SustainabilityMetrics.jsx
// Path: C:\CFH\frontend\src\components\premium\SustainabilityMetrics.jsx
// Purpose: Display sustainability metrics for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/sustainability

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getSustainabilityMetrics } from '@services/api/sustainability';

const SustainabilityMetrics = ({ userId, vehicleId }) => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSustainabilityMetrics(userId, vehicleId);
        setMetrics(data);
        logger.info(`[SustainabilityMetrics] Fetched sustainability metrics for userId: ${userId}, vehicleId: ${vehicleId}`);
      } catch (err) {
        logger.error(`[SustainabilityMetrics] Failed to fetch sustainability metrics for userId ${userId}: ${err.message}`, err);
        setError('Failed to load sustainability metrics. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, [userId, vehicleId]);

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading sustainability metrics...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;
  if (!metrics) return <div className="p-4 text-center text-gray-500">No sustainability metrics available.</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-md mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sustainability Metrics</h2>
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-green-700">Carbon Footprint (Transport)</h3>
          <p className="text-3xl font-bold text-green-600">{metrics.carbonFootprintTransport} kg CO₂</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-blue-700">Fuel Efficiency</h3>
          <p className="text-3xl font-bold text-blue-600">{metrics.fuelEfficiency} MPG</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-yellow-700">Emission Rating</h3>
          <p className="text-3xl font-bold text-yellow-600">{metrics.emissionRating}/10</p>
        </div>
      </div>
    </div>
  );
};

SustainabilityMetrics.propTypes = {
  userId: PropTypes.string.isRequired,
  vehicleId: PropTypes.string.isRequired
};

export default SustainabilityMetrics;