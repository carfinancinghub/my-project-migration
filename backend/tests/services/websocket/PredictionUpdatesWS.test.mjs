// File: PredictionUpdatesWS.test.js
// Path: C:\CFH\backend\tests\services\websocket\PredictionUpdatesWS.test.js
// Purpose: Unit tests for PredictionUpdatesWS.js, covering WebSocket connections and updates
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\backend\tests\services\websocket\PredictionUpdatesWS.test.js to test the PredictionUpdatesWS.js utility.

import PredictionUpdatesWS from '@services/websocket/PredictionUpdatesWS';
import WebSocket from 'ws';
import logger from '@utils/logger';
import MLModel from '@services/ai/MLModel';

jest.mock('ws');
jest.mock('@utils/logger');
jest.mock('@services/ai/MLModel');

describe('PredictionUpdatesWS', () => {
  let wsService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    MLModel.mockImplementation(() => ({
      loadModel: jest.fn().mockResolvedValue(),
      getAnalytics: jest.fn().mockResolvedValue({ accuracy: 0.95, latency: 100, predictions: 1000 }),
    }));
    wsService = new PredictionUpdatesWS({ port: 8081 });
  });

  it('starts WebSocket server in mock mode', async () => {
    await wsService.start();
    expect(logger.info).toHaveBeenCalledWith('Mock WebSocket server started on port 8081');
  });

  it('fetches prediction data', async () => {
    const data = await wsService.fetchPredictionData();
    expect(data.accuracy).toBe(0.95);
    expect(logger.info).not.toHaveBeenCalledWith(expect.stringContaining('Broadcasted update'));
  });

  it('handles model loading failure', async () => {
    MLModel.mockImplementationOnce(() => ({
      loadModel: jest.fn().mockRejectedValue(new Error('Model load failed')),
    }));
    wsService = new PredictionUpdatesWS({ port: 8081 });
    await expect(wsService.start()).rejects.toThrow('Cannot start WebSocket server');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('WebSocket server start failed'));
  });
});

PredictionUpdatesWS.test.propTypes = {};