// File: ARVehicleView.test.js
// Path: C:\CFH\backend\tests\premium\ARVehicleView.test.js
// Purpose: Unit tests for ARVehicleView service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const ARVehicleView = require('@services/premium/ARVehicleView');
const db = require('@services/db');
const ar = require('@services/ar');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/ar');
jest.mock('@utils/logger');

describe('ARVehicleView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getARModel', () => {
    it('generates AR model successfully', async () => {
      const mockVehicle = { model: 'Toyota Camry', color: 'Red', dimensions: { length: 4.8, width: 1.8, height: 1.4 } };
      db.getVehicle.mockResolvedValueOnce(mockVehicle);
      ar.generateARModel.mockResolvedValueOnce({ url: 'ar://toyota-camry-red' });

      const result = await ARVehicleView.getARModel('789');
      expect(result).toEqual({ vehicleId: '789', arModelUrl: 'ar://toyota-camry-red' });
      expect(ar.generateARModel).toHaveBeenCalledWith('Toyota Camry', 'Red', { length: 4.8, width: 1.8, height: 1.4 });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated AR model'));
    });

    it('throws error when vehicle is not found', async () => {
      db.getVehicle.mockResolvedValueOnce(null);
      await expect(ARVehicleView.getARModel('789')).rejects.toThrow('Vehicle not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Vehicle not found'));
    });
  });

  describe('renderARView', () => {
    it('renders AR view successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockVehicle = { model: 'Toyota Camry', color: 'Red', dimensions: { length: 4.8, width: 1.8, height: 1.4 } };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getVehicle.mockResolvedValueOnce(mockVehicle);
      ar.generateARModel.mockResolvedValueOnce({ url: 'ar://toyota-camry-red' });
      ar.startARSession.mockResolvedValueOnce({ id: 'ar-session-123' });

      const result = await ARVehicleView.renderARView('123', '789');
      expect(result).toEqual({ sessionId: 'ar-session-123', arModelUrl: 'ar://toyota-camry-red' });
      expect(ar.startARSession).toHaveBeenCalledWith('123', 'ar://toyota-camry-red');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Rendered AR view'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(ARVehicleView.renderARView('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(ARVehicleView.renderARView('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });
  });
});

