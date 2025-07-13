// File: MLModel.test.js
// Path: C:\CFH\backend\tests\services\ai\MLModel.test.js
// Purpose: Unit tests for MLModel.js, covering model loading, predictions, analytics, and sample inspection
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\backend\tests\services\ai\MLModel.test.js to test the MLModel.js utility.

import MLModel from '@services/ai/MLModel';
import logger from '@utils/logger';
import { cacheManager } from '@utils/cacheManager';
import validateInput from '@utils/validateInput';
import Papa from 'papaparse';

jest.mock('@utils/logger');
jest.mock('@utils/cacheManager');
jest.mock('@utils/validateInput');
jest.mock('papaparse');

describe('MLModel', () => {
  let model;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    model = new MLModel({ modelPath: 'test_model', version: '1.0.0' });
    cacheManager.get.mockReturnValue(null);
    cacheManager.set.mockReturnValue(true);
    validateInput.mockResolvedValue(true);
    Papa.unparse.mockReturnValue('risk,confidence\n0.9,0.85');
  });

  it('loads model successfully', async () => {
    await model.loadModel();
    expect(logger.info).toHaveBeenCalledWith('Mock model loaded: test_model@1.0.0');
    expect(model.model).toBeDefined();
  });

  it('validates input using validateInput.js', async () => {
    const input = { value: 1000, type: 'dispute' };
    await model.validateInput(input);
    expect(validateInput).toHaveBeenCalledWith(input, ['value', 'type']);
  });

  it('performs single prediction with caching', async () => {
    await model.loadModel();
    const input = { value: 1000, type: 'dispute' };
    const result = await model.predict(input, 0.8);
    expect(result.risk).toBe(0.9);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Prediction successful'));
    expect(cacheManager.set).toHaveBeenCalled();
  });

  it('performs batch predictions', async () => {
    await model.loadModel();
    const inputs = [{ value: 1000, type: 'dispute' }, { value: 2000, type: 'fraud' }];
    const results = await model.batchPredict(inputs, 0.8);
    expect(results.length).toBe(2);
    expect(logger.info).toHaveBeenCalledWith('Batch prediction completed: 2 results');
  });

  it('disables model after max timeouts', async () => {
    await model.loadModel();
    model.timeoutCount = 3;
    await expect(model.predict({ value: 1000, type: 'dispute' })).rejects.toThrow('Model disabled due to repeated timeouts');
  });

  it('retrieves model analytics', async () => {
    await model.loadModel();
    const analytics = await model.getAnalytics();
    expect(analytics.accuracy).toBe(0.95);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Analytics retrieved'));
  });

  it('exports predictions to CSV', async () => {
    const predictions = [{ risk: 0.9, confidence: 0.85 }];
    const result = await model.exportPredictions(predictions);
    expect(result.success).toBe(true);
    expect(Papa.unparse).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Predictions exported to CSV'));
  });

  it('performs health check', async () => {
    await model.loadModel();
    const status = await model.healthCheck();
    expect(status.available).toBe(true);
    expect(status.version).toBe('1.0.0');
  });

  it('inspects training sample quality', async () => {
    const sample = { value: 1000, type: 'dispute' };
    const quality = await model.inspectSample(sample);
    expect(quality.completeness).toBe(1.0);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Sample inspection'));
  });

  it('handles invalid input', async () => {
    validateInput.mockRejectedValueOnce(new Error('Invalid input'));
    await expect(model.validateInput({})).rejects.toThrow('Invalid input');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Input validation failed'));
  });
});

MLModel.test.propTypes = {};