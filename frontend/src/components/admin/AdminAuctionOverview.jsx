// File: AdminAuctionOverview.jsx
// Path: frontend/src/components/admin/AdminAuctionOverview.jsx
// Purpose: Admin overview dashboard with auction stats, anomaly detection, and dispute resolution daemon
// Author: Cod1 (05111357 - PDT)
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@components/ui/button';
import logger from '@utils/logger';
import { detectAuctionAnomaliesInRealTime } from '@services/anomaly/AnomalyEngine';
import { launchAutoDisputeResolutionDaemon } from '@services/disputes/DisputeDaemon';

/**
 * Functions Summary:
 * - detectAuctionAnomaliesInRealTime(): Loads anomaly flags from backend (paid section)
 * - launchAutoDisputeResolutionDaemon(): Initiates dispute daemon on click (paid section)
 * Inputs: auctions (array of auction objects)
 * Outputs: JSX panel of admin auction data + anomaly warnings
 * Dependencies: React, @components/ui/button, @services/anomaly/AnomalyEngine, @services/disputes/DisputeDaemon, @utils/logger
 */
const AdminAuctionOverview = ({ auctions }) => {
  const [anomalies, setAnomalies] = useState([]);
  const [disputeDaemonStatus, setDisputeDaemonStatus] = useState('Not Started');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDetectAnomalies = async () => {
    setLoading(true);
    setError(null);
    try {
      const anomalyData = await detectAuctionAnomaliesInRealTime('someAuctionId');
      setAnomalies(anomalyData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to detect anomalies';
      setError(errorMessage);
      logger.error('Failed to detect anomalies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchDisputeDaemon = async () => {
    setLoading(true);
    setError(null);
    try {
      const daemonStatus = await launchAutoDisputeResolutionDaemon();
      setDisputeDaemonStatus(daemonStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to launch dispute daemon';
      setError(errorMessage);
      logger.error('Failed to launch dispute daemon:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Auction Overview</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      <ul className="space-y-2">
        {auctions.map((auction) => (
          <li key={auction.id}>
            <div>Auction ID: {auction.id}</div>
            <div>Title: {auction.title}</div>
            <div>Bids: {auction.bids}</div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Anomaly Detection</h3>
        <Button onClick={handleDetectAnomalies}>Detect Anomalies</Button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Dispute Resolution</h3>
        <Button onClick={handleLaunchDisputeDaemon}>Launch Dispute Daemon</Button>
        <div>Dispute Daemon Status: {disputeDaemonStatus}</div>
      </div>
      {anomalies.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Detected Anomalies</h3>
          <ul className="space-y-1">
            {anomalies.map((a, idx) => (
              <li key={idx} className="text-gray-700">{a.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

AdminAuctionOverview.propTypes = {
  auctions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      bids: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default AdminAuctionOverview;