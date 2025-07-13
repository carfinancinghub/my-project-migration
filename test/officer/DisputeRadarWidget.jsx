import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import DisputeDisplay from '@components/common/DisputeDisplay';
import DisputeService from '@services/dispute/DisputeService';
import LiveUpdates from '@services/websocket/LiveUpdates';
import logger from '@utils/logger';

// 👑 Crown Certified Component
// Path: frontend/src/components/officer/DisputeRadarWidget.jsx
// Purpose: Visualize dispute clusters across auctions/roles for officer oversight
// Author: Rivers Auction Team
// Date: May 18, 2025
// Cod2 Crown Certified
// @aliases: @components/common/DisputeDisplay, @services/dispute/DisputeService, @services/websocket/LiveUpdates, @utils/logger

const DisputeRadarWidget = ({ officerId, isPremium, filters }) => {
  const [disputes, setDisputes] = useState([]);
  const [filteredDisputes, setFilteredDisputes] = useState([]);
  const [activeFilters, setActiveFilters] = useState(filters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hotspotAlerts, setHotspotAlerts] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchDisputes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await DisputeService.getDisputeClusters(officerId, activeFilters);
      setDisputes(response.data || []);
      if (isPremium) {
        const hotspotData = await DisputeService.getHotspots(officerId, activeFilters);
        setHotspotAlerts(hotspotData.slice(-5) || []);
      }
    } catch (err) {
      logger.error(`Error fetching disputes for officer ${officerId}: ${err.message}`);
      setError('Failed to load disputes. Please try again.');
      setDisputes([]);
      setHotspotAlerts([]);
    } finally {
      setIsLoading(false);
    }
  }, [officerId, activeFilters, isPremium]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  useEffect(() => {
    const socket = LiveUpdates.connect('/ws/disputes/updates');
    socket.on('disputeUpdate', (data) => {
      if (data.officerId === officerId) {
        setDisputes((prev) => {
          const updated = prev.filter((d) => d.id !== data.dispute.id);
          return [...updated, data.dispute].slice(-100);
        });
        if (isPremium && data.isHotspot) {
          setHotspotAlerts((prev) => [...prev, data.hotspot].slice(-5));
        }
      }
    });

    socket.on('error', (err) => {
      logger.error(`WebSocket error for officer ${officerId}: ${err.message}`);
      if (retryCount < maxRetries) {
        setError(`WebSocket connection failed. Retrying (${retryCount + 1}/${maxRetries})...`);
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          socket.connect();
        }, 3000);
      } else {
        setError('Real-time updates unavailable. Retry manually?');
      }
    });

    return () => socket.disconnect();
  }, [officerId, isPremium, retryCount]);

  const handleRetryWebSocket = () => {
    setRetryCount(0);
    setError(null);
    fetchDisputes();
  };

  useEffect(() => {
    const applyFilters = () => {
      let result = [...disputes];
      if (activeFilters.timeframe !== 'all') {
        const now = Date.now();
        const value = activeFilters.timeframe.replace('last', '');
        let multiplier = value.includes('h') ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const amount = parseInt(value.replace(/[hd]/, ''), 10);
        if (!isNaN(amount)) {
          const threshold = now - amount * multiplier;
          result = result.filter((d) => d.createdAt >= threshold);
        }
      }
      if (activeFilters.type !== 'all') result = result.filter((d) => d.type === activeFilters.type);
      if (activeFilters.severity !== 'all') result = result.filter((d) => d.severity === activeFilters.severity);
      setFilteredDisputes(result);
    };
    applyFilters();
  }, [disputes, activeFilters]);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const heatmapData = useMemo(() => {
    if (!isPremium || !showHeatmap) return [];
    const counts = filteredDisputes.reduce((acc, dispute) => {
      acc[dispute.type] = (acc[dispute.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [isPremium, showHeatmap, filteredDisputes]);

  const renderHeatmap = () => {
    if (!heatmapData.length) return <p>No data for heatmap.</p>;
    return (
      <canvas id="dispute-heatmap" width="400" height="200" aria-label="Dispute Heatmap">
        <script>
          {(() => {
            const canvas = document.getElementById('dispute-heatmap');
            if (canvas) {
              const ctx = canvas.getContext('2d');
              const barWidth = 60;
              const maxCount = Math.max(...heatmapData.map((d) => d.count));
              heatmapData.forEach((data, index) => {
                const height = (data.count / maxCount) * 150;
                ctx.fillStyle = data.count > 5 ? '#ff4444' : '#4682b4';
                ctx.fillRect(index * barWidth + 10, 200 - height, barWidth - 10, height);
                ctx.fillStyle = '#000';
                ctx.fillText(data.type, index * barWidth + 10, 190);
                ctx.fillText(data.count, index * barWidth + 20, 180 - height);
              });
            }
          })()}
        </script>
      </canvas>
    );
  };

  if (isLoading && !disputes.length) {
    return <div>Loading disputes...</div>;
  }

  return (
    <div className="dispute-radar-widget">
      <h2>Dispute Radar</h2>
      {error && (
        <div className="error">
          {error}
          {retryCount >= maxRetries && (
            <button onClick={handleRetryWebSocket} className="retry-button">
              Retry Connection
            </button>
          )}
        </div>
      )}
      <DisputeDisplay
        disputes={filteredDisputes}
        filters={activeFilters}
        onFilterChange={handleFilterChange}
      />
      {isPremium && hotspotAlerts.length > 0 && (
        <div className="hotspot-alerts">
          <h3>Hotspot Alerts</h3>
          {hotspotAlerts.map((alert, index) => (
            <div key={index} className="alert">
              {alert.severity} Dispute Cluster: {alert.auctionId} ({alert.role})
            </div>
          ))}
        </div>
      )}
      {isPremium && (
        <div className="heatmap">
          <button onClick={() => setShowHeatmap(!showHeatmap)}>
            {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
          </button>
          {showHeatmap && renderHeatmap()}
        </div>
      )}
    </div>
  );
};

DisputeRadarWidget.propTypes = {
  officerId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
  filters: PropTypes.shape({
    timeframe: PropTypes.string,
    type: PropTypes.string,
    severity: PropTypes.string,
  }).isRequired,
};

export default DisputeRadarWidget;