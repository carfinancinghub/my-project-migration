// File: auctionExportUtils.test.jsx
// Path: C:\CFH\frontend\src\utils\auction\auctionExportUtils.test.jsx
// Purpose: Unit tests for auctionExportUtils.jsx, covering PDF, CSV, JSON exports, validation, and premium features
// Author: Rivers Auction Dev Team
// Date: 2025-05-26
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\utils\auction\auctionExportUtils.test.jsx to test the auctionExportUtils.jsx utility.

import { exportAuctionData, validateExportData } from '@utils/auction/auctionExportUtils';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import logger from '@utils/logger';
import { cacheManager } from '@utils/cacheManager';

jest.mock('jspdf');
jest.mock('papaparse');
jest.mock('@utils/logger');
jest.mock('@utils/cacheManager');

const mockData = [
  { id: '1', title: 'Car Auction', status: 'Active', price: 10000 },
  { id: '2', title: 'Truck Auction', status: 'Closed', price: 20000 },
];

describe('auctionExportUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jsPDF.mockReturnValue({
      text: jest.fn(),
      save: jest.fn(),
    });
    Papa.unparse.mockReturnValue('id,title\n1,Car Auction\n2,Truck Auction');
    cacheManager.set.mockReturnValue(true);
    global.URL.createObjectURL = jest.fn(() => 'blob:test');
    global.URL.revokeObjectURL = jest.fn();
    const mockAnchor = { click: jest.fn() };
    global.document.createElement = jest.fn(() => mockAnchor);
  });

  it('validates auction data successfully', () => {
    expect(() => validateExportData(mockData, ['id', 'title'])).not.toThrow();
    expect(validateExportData(mockData, ['id', 'title'])).toBe(true);
  });

  it('throws error for invalid auction data', () => {
    expect(() => validateExportData([], ['id'])).toThrow('No auction data provided for export');
    expect(() => validateExportData([{}], ['id'])).toThrow('Required fields missing: id, title, status');
    expect(() => validateExportData(mockData, ['invalid'])).toThrow('Selected columns not found in data');
    expect(logger.error).toHaveBeenCalled();
  });

  it('exports to PDF with selected columns', () => {
    const result = exportAuctionData({ data: mockData, format: 'pdf', selectedColumns: ['id', 'title'], isPremium: true });
    expect(result.success).toBe(true);
    expect(jsPDF).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('PDF export successful'));
  });

  it('exports to CSV with filters', () => {
    const result = exportAuctionData({
      data: mockData,
      format: 'csv',
      filters: { status: 'Active' },
    });
    expect(result.success).toBe(true);
    expect(Papa.unparse).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('CSV export successful'));
  });

  it('exports to JSON with premium template', () => {
    const template = { auctionId: 'id', name: 'title' };
    const result = exportAuctionData({
      data: mockData,
      format: 'json',
      isPremium: true,
      template,
    });
    expect(result.success).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('JSON export successful'));
  });

  it('throttles export to prevent UI freezing', () => {
    const exportFn = exportAuctionData;
    exportFn({ data: mockData, format: 'csv' });
    expect(() => exportFn({ data: mockData, format: 'csv' })).toThrow('Export in progress, please wait');
    expect(logger.warn).toHaveBeenCalledWith('Export throttled to prevent UI freeze');
  });

  it('saves premium user preferences', () => {
    exportAuctionData({
      data: mockData,
      format: 'pdf',
      selectedColumns: ['id'],
      isPremium: true,
      userId: '123',
    });
    expect(cacheManager.set).toHaveBeenCalledWith('export_prefs_123', { format: 'pdf', selectedColumns: ['id'] }, { ttl: 86400 });
  });

  it('handles undefined data fields gracefully', () => {
    const incompleteData = [{ id: '1', title: 'Test' }];
    expect(() => validateExportData(incompleteData, ['id', 'title'])).toThrow('Required fields missing: status');
  });

  it('throws error for unsupported format', () => {
    expect(() => exportAuctionData({ data: mockData, format: 'xml' })).toThrow('Unsupported format: xml');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Unsupported export format: xml'));
  });
});

auctionExportUtils.test.propTypes = {};