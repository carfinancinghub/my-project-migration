// File: VRVehicleTour.test.js
// Path: C:\CFH\backend\tests\premium\VRVehicleTour.test.js
// Purpose: Unit tests for VRVehicleTour service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const VRVehicleTour = require('@services/premium/VRVehicleTour');
const db = require('@services/db');
const vr = require('@services/vr');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/vr');
jest.mock('@utils/logger');

describe('VRVehicleTour', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createVRTour', () => {
    it('creates VR tour successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockVehicle = { id: '789', model: 'Toyota Camry', interiorImages: ['image1.jpg'] };
      const mockTour = { id: 'vr-tour-123', url: 'vr://tour-123' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getVehicle.mockResolvedValueOnce(mockVehicle);
      vr.createVehicleTour.mockResolvedValueOnce(mockTour);

      const result = await VRVehicleTour.createVRTour('123', '789');
      expect(result).toEqual({ tourId: 'vr-tour-123', vrTourUrl: 'vr://tour-123' });
      expect(vr.createVehicleTour).toHaveBeenCalledWith('789', 'Toyota Camry', ['image1.jpg']);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Created VR tour'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(VRVehicleTour.createVRTour('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when vehicle is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getVehicle.mockResolvedValueOnce(null);
      await expect(VRVehicleTour.createVRTour('123', '789')).rejects.toThrow('Vehicle not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Vehicle not found'));
    });
  });

  describe('startVRTour', () => {
    it('starts VR tour session successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockTour = { id: 'vr-tour-123', url: 'vr://tour-123' };
      const mockSession = { id: 'vr-session-123' };
      db.getUser.mockResolvedValueOnce(mockUser);
      vr.getTour.mockResolvedValueOnce(mockTour);
      vr.startTourSession.mockResolvedValueOnce(mockSession);

      const result = await VRVehicleTour.startVRTour('123', 'vr-tour-123');
      expect(result).toEqual({ sessionId: 'vr-session-123', vrTourUrl: 'vr://tour-123' });
      expect(vr.startTourSession).toHaveBeenCalledWith('123', 'vr-tour-123');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Started VR tour session'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(VRVehicleTour.startVRTour('123', 'vr-tour-123')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when tour is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      vr.getTour.mockResolvedValueOnce(null);
      await expect(VRVehicleTour.startVRTour('123', 'vr-tour-123')).rejects.toThrow('VR tour not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('VR tour not found'));
    });
  });
});

