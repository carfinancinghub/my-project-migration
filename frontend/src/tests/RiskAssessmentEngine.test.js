// File: RiskAssessmentEngine.test.js
// Path: backend/utils/RiskAssessmentEngine.test.js
// Author: Cod5 (05051016, May 5, 2025, 10:16 PDT)
// Purpose: Unit tests and snapshot tests for RiskAssessmentEngine.js to ensure reliable vehicle risk prediction and output consistency

import { analyzeVehicleRisk, integrateDisputeHistory, subscribeToRealTimeUpdates } from '@utils/RiskAssessmentEngine';
import { fetchVehicleHistory } from '@utils/vehicleUtils';
import { fetchDisputeHistory } from '@utils/disputeUtils';
import { subscribeToWebSocket } from '@lib/websocket';

// Mock utilities
jest.mock('@utils/vehicleUtils', () => ({
  fetchVehicleHistory: jest.fn(),
}));
jest.mock('@utils/disputeUtils', () => ({
  fetchDisputeHistory: jest.fn(),
}));
jest.mock('@lib/websocket', () => ({
  subscribeToWebSocket: jest.fn(),
}));

describe('RiskAssessmentEngine', () => {
  const mockVehicleData = {
    vehicleId: 'VIN123',
    mileage: 50000,
    age: 5,
    accidentCount: 0,
  };
  const mockDisputeData = {
    vehicleId: 'VIN123',
    disputeCount: 1,
    severity: 'Medium',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchVehicleHistory as jest.Mock).mockResolvedValue(mockVehicleData);
    (fetchDisputeHistory as jest.Mock).mockResolvedValue(mockDisputeData);
    (subscribeToWebSocket as jest.Mock).mockReturnValue(jest.fn());
  });

  it('predicts low risk for new vehicle with no accidents', async () => {
    const result = await analyzeVehicleRisk(mockVehicleData, false);

    expect(result).toEqual({
      vehicleId: 'VIN123',
      riskScore: 'Low',
      riskFactors: [],
    });
  });

  it('predicts high risk for old vehicle with accidents', async () => {
    const highRiskData = { ...mockVehicleData, mileage: 150000, age: 10, accidentCount: 2 };
    const result = await analyzeVehicleRisk(highRiskData, false);

    expect(result).toEqual({
      vehicleId: 'VIN123',
      riskScore: 'High',
      riskFactors: ['High mileage', 'Old vehicle', '2 accident(s)'],
    });
  });

  it('integrates dispute history for Enterprise users', async () => {
    const result = await analyzeVehicleRisk(mockVehicleData, true);

    expect(fetchDisputeHistory).toHaveBeenCalledWith('VIN123');
    expect(result).toEqual({
      vehicleId: 'VIN123',
      riskScore: 'Medium',
      riskFactors: ['1 dispute(s) with Medium severity'],
    });
  });

  it('subscribes to real-time updates for Enterprise users', () => {
    const callback = jest.fn();
    const unsubscribe = subscribeToRealTimeUpdates('VIN123', callback);

    expect(subscribeToWebSocket).toHaveBeenCalledWith('risk-updates/VIN123', expect.any(Function));
    expect(unsubscribe).toBeInstanceOf(Function);
  });

  it('handles errors in risk analysis', async () => {
    (fetchVehicleHistory as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
    await expect(analyzeVehicleRisk(mockVehicleData, false)).rejects.toThrow('Failed to analyze vehicle risk.');
  });

  // Snapshot Tests
  it('matches snapshot for free risk prediction', async () => {
    const result = await analyzeVehicleRisk(mockVehicleData, false);
    expect(result).toMatchSnapshot();
  });

  it('matches snapshot for Enterprise risk prediction with dispute history', async () => {
    const result = await analyzeVehicleRisk(mockVehicleData, true);
    expect(result).toMatchSnapshot();
  });
});