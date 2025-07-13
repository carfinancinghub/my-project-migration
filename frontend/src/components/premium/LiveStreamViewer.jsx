// File: LiveStreamViewer.jsx
// Path: C:\CFH\frontend\src\components\premium\LiveStreamViewer.jsx
// Purpose: Display live auction stream for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/premium

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { startStream } from '@services/api/premium';

const LiveStreamViewer = ({ userId, auctionId }) => {
  const [streamId, setStreamId] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initiateStream = async () => {
      try {
        const { streamId } = await startStream(auctionId);
        setStreamId(streamId);
        logger.info(`[LiveStreamViewer] Started live stream for userId: ${userId}, auctionId: ${auctionId}`);

        // Simulate WebSocket connection
        const ws = new WebSocket(`ws://api.riversauction.com/stream/${streamId}`);
        ws.onmessage = (event) => {
          const update = JSON.parse(event.data);
          setUpdates(prev => [...prev, update]);
        };
        ws.onerror = (err) => {
          logger.error(`[LiveStreamViewer] WebSocket error for userId ${userId}: ${err.message}`, err);
          setError('Failed to connect to live stream.');
        };
        return () => ws.close();
      } catch (err) {
        logger.error(`[LiveStreamViewer] Failed to start live stream for userId ${userId}: ${err.message}`, err);
        setError('Failed to start live stream. Please try again.');
      }
    };
    initiateStream();
  }, [userId, auctionId]);

  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Live Auction Stream</h3>
      {streamId ? (
        <div className="space-y-2">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600">Stream ID: <span className="font-medium">{streamId}</span></p>
            <p className="text-gray-600">Stream Status: <span className="font-medium text-green-600">Live</span></p>
          </div>
          <div className="h-40 overflow-y-auto">
            {updates.map((update, index) => (
              <p key={index} className="text-gray-600">{JSON.stringify(update)}</p>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Connecting to live stream...</p>
      )}
    </div>
  );
};

LiveStreamViewer.propTypes = {
  userId: PropTypes.string.isRequired,
  auctionId: PropTypes.string.isRequired
};

export default LiveStreamViewer;