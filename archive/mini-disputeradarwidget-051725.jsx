// Purpose: Visualize dispute clusters across auctions/roles for officer oversight.
// Author: Rivers Auction Team
// Date: May 17, 2025
// Cod2 Crown Certified

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import DisputeDisplay from '@components/common/DisputeDisplay'; // Assuming this component exists and takes dispute data
import DisputeService from '@services/dispute/DisputeService';
import logger from '@utils/logger';
import LiveUpdates from '@services/websocket/LiveUpdates'; // Assuming this handles WebSocket connections

const DisputeRadarWidget = ({ officerId, isPremium }) => {
  const [disputes, setDisputes] = useState([]);
  const [filteredDisputes, setFilteredDisputes] = useState([]);
  const [filters, setFilters] = useState({
    timeframe: 'all', // e.g., 'all', 'last24h', 'last7d', 'last30d'
    type: 'all',      // e.g., 'all', 'payment', 'item_condition', 'shipping'
    severity: 'all'   // e.g., 'all', 'low', 'medium', 'high'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hotspotAlerts, setHotspotAlerts] = useState([]); // Premium feature
  const [showHeatmap, setShowHeatmap] = useState(false); // Premium feature

  const websocketUrl = '/ws/disputes/updates';

  // Mock data fetching function
  const fetchDisputes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      logger.info(`[DisputeRadarWidget] Fetching disputes for officerId: ${officerId}`);
      const fetchedDisputes = await DisputeService.getDisputesForOfficer(officerId, filters);
      setDisputes(fetchedDisputes || []); // Ensure disputes is always an array
      if (isPremium) {
        const alerts = await DisputeService.getPredictiveHotspots(officerId, filters);
        setHotspotAlerts(alerts || []); // Ensure alerts is always an array
      }
    } catch (err) {
      logger.error('[DisputeRadarWidget] Error fetching disputes:', err);
      setError('Failed to load disputes. Please try again later.');
      setDisputes([]);
      setHotspotAlerts([]);
    } finally {
      setIsLoading(false);
    }
  }, [officerId, filters, isPremium]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    logger.info(`[DisputeRadarWidget] Attempting to connect to WebSocket: ${websocketUrl}`);
    const liveUpdatesInstance = new LiveUpdates(websocketUrl);

    const handleNewDispute = (newDispute) => {
      logger.info('[DisputeRadarWidget] Received new dispute via WebSocket:', newDispute);
      setDisputes(prevDisputes => {
        // Avoid duplicates and ensure it's an array
        const currentDisputes = Array.isArray(prevDisputes) ? prevDisputes : [];
        if (currentDisputes.find(d => d.id === newDispute.id)) {
          return currentDisputes.map(d => d.id === newDispute.id ? newDispute : d);
        }
        return [...currentDisputes, newDispute];
      });
      // Potentially update premium features too
      if (isPremium && newDispute.isHotspotCandidate) {
         setHotspotAlerts(prevAlerts => [...(Array.isArray(prevAlerts) ? prevAlerts : []), { message: `Potential new hotspot: ${newDispute.id}`, details: newDispute }]);
      }
    };

    const handleError = (wsError) => {
      logger.error('[DisputeRadarWidget] WebSocket error:', wsError);
      setError('Real-time updates are currently unavailable.');
    };

    liveUpdatesInstance.connect();
    liveUpdatesInstance.on('new_dispute', handleNewDispute);
    liveUpdatesInstance.on('dispute_update', handleNewDispute); // Assuming updates use the same handler
    liveUpdatesInstance.on('error', handleError);

    return () => {
      logger.info('[DisputeRadarWidget] Closing WebSocket connection.');
      liveUpdatesInstance.disconnect();
    };
  }, [websocketUrl, isPremium]);


  // Apply filters
  useEffect(() => {
    let currentDisputes = Array.isArray(disputes) ? [...disputes] : [];

    if (filters.timeframe !== 'all') {
      // This is a simplified filter. Real implementation would parse dates.
      // For now, assume disputes have a 'createdAt' timestamp (number) and 'timeframe' is in days/hours.
      const now = Date.now();
      const value = filters.timeframe.replace('last', '');
      let multiplier = 1;
      let amount;

      if (value.includes('h')) {
        multiplier = 60 * 60 * 1000;
        amount = parseInt(value.replace('h', ''), 10);
      } else if (value.includes('d')) {
        multiplier = 24 * 60 * 60 * 1000;
        amount = parseInt(value.replace('d', ''), 10);
      }

      if (!isNaN(amount)) {
        const threshold = now - (amount * multiplier);
        currentDisputes = currentDisputes.filter(d => d.createdAt && d.createdAt >= threshold);
      }
    }
    if (filters.type !== 'all') {
      currentDisputes = currentDisputes.filter(d => d.type === filters.type);
    }
    if (filters.severity !== 'all') {
      currentDisputes = currentDisputes.filter(d => d.severity === filters.severity);
    }
    setFilteredDisputes(currentDisputes);
  }, [disputes, filters]);


  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
    // Optionally, refetch data from backend if filters are server-side
    // fetchDisputes(); // Uncomment if filters should trigger a new API call
  };

  const memoizedFilteredDisputes = useMemo(() => filteredDisputes, [filteredDisputes]);

  // Mock heatmap data generation
  const heatmapData = useMemo(() => {
    if (!isPremium || !showHeatmap || !Array.isArray(memoizedFilteredDisputes)) return [];
    // Simplified heatmap: count disputes per type
    const counts = memoizedFilteredDisputes.reduce((acc, dispute) => {
      acc[dispute.type] = (acc[dispute.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([type, count]) => ({ x: type, y: count, category: 'Disputes' }));
  }, [isPremium, showHeatmap, memoizedFilteredDisputes]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-500">Loading disputes radar...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Dispute Radar</h2>
        {isPremium && (
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${showHeatmap ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
                                      : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400'}`}
          >
            {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-md shadow-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
        <div>
          <label htmlFor="timeframe-filter" className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
          <select
            id="timeframe-filter"
            value={filters.timeframe}
            onChange={(e) => handleFilterChange('timeframe', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          >
            <option value="all">All Time</option>
            <option value="last24h">Last 24 Hours</option>
            <option value="last7d">Last 7 Days</option>
            <option value="last30d">Last 30 Days</option>
          </select>
        </div>
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            id="type-filter"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          >
            <option value="all">All Types</option>
            <option value="payment">Payment</option>
            <option value="item_condition">Item Condition</option>
            <option value="shipping">Shipping</option>
            <option value="communication">Communication</option>
          </select>
        </div>
        <div>
          <label htmlFor="severity-filter" className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
          <select
            id="severity-filter"
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Premium Features */}
      {isPremium && (
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">Premium Insights</h3>
          {hotspotAlerts.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-4 shadow">
              <h4 className="font-semibold text-yellow-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.216 3.001-1.742 3.001H4.42c-1.526 0-2.492-1.667-1.742-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.5a1.75 1.75 0 00-3.5 0v.256c0 .4.2.764.524.976l.002.001.002.001.008.003c.038.017.08.028.124.032l.012.001c.04.003.08.003.12.003h5.9c.04 0 .08 0 .12-.003l.012-.001c.044-.004.086-.015.124-.032l.008-.003.002-.001.002-.001a1.255 1.255 0 00.524-.976V7.5a1.75 1.75 0 00-3.5 0v.5H8.25v-.5z" clipRule="evenodd" />
                </svg>
                Predictive Hotspot Alerts:
              </h4>
              <ul className="list-disc list-inside text-yellow-700 text-sm mt-2 space-y-1">
                {hotspotAlerts.map((alert, index) => (
                  <li key={index}>{alert.message} (Details: {JSON.stringify(alert.details)})</li>
                ))}
              </ul>
            </div>
          )}
          {hotspotAlerts.length === 0 && <p className="text-sm text-gray-600 italic">No active hotspot alerts at this time.</p>}

          {showHeatmap && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white shadow">
              <h4 className="font-semibold text-gray-700 mb-3">Dispute Heatmap (Conceptual)</h4>
              {heatmapData.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {heatmapData.map(item => (
                    <div key={item.x} className="p-3 bg-blue-50 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                      <div className="font-bold text-blue-700 capitalize">{item.x}</div>
                      <div className="text-sm text-blue-600">Count: {item.y}</div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500">Not enough data for heatmap or feature not active.</p>}
               <p className="text-xs text-gray-400 mt-3">Note: This is a conceptual representation. A real heatmap would involve a dedicated charting library for richer visuals.</p>
            </div>
          )}
           {isPremium && <p className="text-sm text-gray-600 mt-4 italic">Resolution timeline integration features would be displayed here.</p>}
        </div>
      )}

      {/* Dispute Clusters Visualization */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Dispute Clusters</h3>
        {isLoading && !memoizedFilteredDisputes.length ? (
            <p className="text-gray-500">Refreshing disputes...</p>
        ) : memoizedFilteredDisputes.length > 0 ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {memoizedFilteredDisputes.map(dispute => (
              <div key={dispute.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-200 ease-in-out">
                 <DisputeDisplay dispute={dispute} />
                 {/* Example of more details, assuming DisputeDisplay doesn't show them all */}
                 <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                    <p><span className="font-medium">Severity:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${dispute.severity === 'high' ? 'bg-red-100 text-red-700' : dispute.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{dispute.severity || 'N/A'}</span></p>
                    <p><span className="font-medium">Type:</span> {dispute.type || 'N/A'}</p>
                    <p><span className="font-medium">Created:</span> {new Date(dispute.createdAt).toLocaleDateString()} {new Date(dispute.createdAt).toLocaleTimeString()}</p>
                    {isPremium && dispute.resolutionTimeline && <p className="font-medium text-blue-600">Timeline: {dispute.resolutionTimeline}</p>}
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l4 4m0-4l-4 4" />
            </svg>
            <p className="mt-2 text-lg text-gray-500">No disputes match the current filters, or no disputes found.</p>
            <p className="text-sm text-gray-400">Try adjusting your filter criteria.</p>
          </div>
        )}
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

DisputeRadarWidget.propTypes = {
  officerId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

// Default export
export default DisputeRadarWidget;
