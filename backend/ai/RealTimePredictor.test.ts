/**
 * © 2025 CFH, All Rights Reserved
 * File: RealTimePredictor.test.ts
 * Path: backend/tests/ai/RealTimePredictor.test.ts
 * Purpose: Unit tests for RealTimePredictor AI service
 * Author: Cod1 Team
 * Date: 2025-07-19 [0015]
 * Version: 1.0.1
 * Version ID: n1m2b3v4c5x6z7a8s9d0f1g2h3j4k5l6
 * Crown Certified: Yes
 * Batch ID: Compliance-071925
 * Artifact ID: n1m2b3v4c5x6z7a8s9d0f1g2h3j4k5l6
 * Save Location: backend/tests/ai/RealTimePredictor.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed mocks and inputs
 * - Added tests for socket connect/disconnect, prediction latency
 * - Suggest extracting repeated mock logic to test utils
 * - Suggest integration/E2E test with real WebSocket
 * - Improved: Typed emit/receive, latency tracking
 * - Free: Basic prediction tests
 * - Premium: Real-time updates, bulk prediction
 * - Wow++: Live AI drift detection, latency heatmap
 * - Suggestions: Simulate high load, test failover, user session recovery
 */

import RealTimePredictor from '@services/ai/RealTimePredictor';
import * as socket from '@utils/socket';
import * as logger from '@utils/logger';

jest.mock('@utils/socket');
jest.mock('@utils/logger');

describe('RealTimePredictor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('connects and emits prediction event', async () => {
    const mockEmit = jest.fn();
    const mockOn = jest.fn();
    (socket.connect as jest.Mock).mockReturnValue({ emit: mockEmit, on: mockOn });

    await RealTimePredictor.connectAndPredict({ input: 'auctionData' });
    expect(socket.connect).toHaveBeenCalled();
    expect(mockEmit).toHaveBeenCalledWith('predict', { input: 'auctionData' });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Prediction event emitted'));
  });

  it('receives prediction results', async () => {
    const mockOn = jest.fn((event, cb) => {
      if (event === 'predictionResult') cb({ result: 'win', probability: 0.78 });
    });
    (socket.connect as jest.Mock).mockReturnValue({ emit: jest.fn(), on: mockOn });

    const result = await RealTimePredictor.connectAndPredict({ input: 'auctionData' });
    expect(result).toEqual({ result: 'win', probability: 0.78 });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Prediction result received'));
  });

  it('logs latency for prediction', async () => {
    const mockEmit = jest.fn();
    const mockOn = jest.fn();
    (socket.connect as jest.Mock).mockReturnValue({ emit: mockEmit, on: mockOn });
    const startTime = Date.now();
    await RealTimePredictor.connectAndPredict({ input: 'auctionData' });
    const latency = Date.now() - startTime;
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Prediction latency'));
  });

  it('handles socket disconnect', async () => {
    const mockOn = jest.fn((event, cb) => {
      if (event === 'disconnect') cb();
    });
    (socket.connect as jest.Mock).mockReturnValue({ emit: jest.fn(), on: mockOn });

    await RealTimePredictor.connectAndPredict({ input: 'auctionData' });
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Socket disconnected'));
  });

  it('handles prediction errors', async () => {
    (socket.connect as jest.Mock).mockImplementation(() => {
      throw new Error('Socket error');
    });

    await expect(RealTimePredictor.connectAndPredict({ input: 'auctionData' }))
      .rejects.toThrow('Socket error');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Prediction connection failed'));
  });
});
