// File: CrossBorderCommerce.test.js
// Path: C:\CFH\backend\tests\premium\CrossBorderCommerce.test.js
// Purpose: Unit tests for CrossBorderCommerce service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const CrossBorderCommerce = require('@services/premium/CrossBorderCommerce');
const db = require('@services/db');
const exchange = require('@services/exchange');
const shipping = require('@services/shipping');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/exchange');
jest.mock('@services/shipping');
jest.mock('@utils/logger');

describe('CrossBorderCommerce', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('convertCurrency', () => {
    it('converts currency successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      db.getUser.mockResolvedValueOnce(mockUser);
      exchange.convert.mockResolvedValueOnce(1200);

      const result = await CrossBorderCommerce.convertCurrency('123', 1000, 'USD', 'EUR');
      expect(result).toEqual({ convertedAmount: 1200, fromCurrency: 'USD', toCurrency: 'EUR' });
      expect(exchange.convert).toHaveBeenCalledWith(1000, 'USD', 'EUR');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Converted 1000 USD to 1200 EUR'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(CrossBorderCommerce.convertCurrency('123', 1000, 'USD', 'EUR')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error on conversion failure', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      exchange.convert.mockRejectedValueOnce(new Error('Exchange error'));
      await expect(CrossBorderCommerce.convertCurrency('123', 1000, 'USD', 'EUR')).rejects.toThrow('Exchange error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to convert currency'));
    });
  });

  describe('estimateShipping', () => {
    it('estimates shipping successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockVehicle = { id: '789', weight: 1500 };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getVehicle.mockResolvedValueOnce(mockVehicle);
      shipping.estimateCost.mockResolvedValueOnce({ cost: 500, currency: 'USD' });
      shipping.estimateTax.mockResolvedValueOnce(100);

      const result = await CrossBorderCommerce.estimateShipping('123', '789', 'EU');
      expect(result).toEqual({ shippingCost: 500, taxEstimate: 100, currency: 'USD' });
      expect(shipping.estimateCost).toHaveBeenCalledWith(mockVehicle, 'EU');
      expect(shipping.estimateTax).toHaveBeenCalledWith(mockVehicle, 'EU');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Estimated shipping'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(CrossBorderCommerce.estimateShipping('123', '789', 'EU')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when vehicle is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getVehicle.mockResolvedValueOnce(null);
      await expect(CrossBorderCommerce.estimateShipping('123', '789', 'EU')).rejects.toThrow('Vehicle not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Vehicle not found'));
    });
  });
});

