// File: GraphExportService.test.js
// Path: C:\CFH\frontend\src\tests\utils\graph\GraphExportService.test.js
// Purpose: Unit tests for GraphExportService.js, covering PNG and SVG exports
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\tests\utils\graph\GraphExportService.test.js to test the GraphExportService.js utility.

import { exportToPNG, exportToSVG } from '@utils/graph/GraphExportService';
import logger from '@utils/logger';

jest.mock('@utils/logger');

describe('GraphExportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'blob:test');
    global.URL.revokeObjectURL = jest.fn();
    jest.spyOn(document, 'createElement').mockReturnValue({ href: '', download: '', click: jest.fn() });
  });

  const mockChart = {
    canvas: {
      toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test'),
    },
  };

  it('exports graph as PNG', async () => {
    await exportToPNG(mockChart);
    expect(mockChart.canvas.toDataURL).toHaveBeenCalledWith('image/png');
    expect(logger.info).toHaveBeenCalledWith('Graph exported as PNG');
    expect(document.createElement).toHaveBeenCalledWith('a');
  });

  it('exports graph as SVG', async () => {
    await exportToSVG(mockChart);
    expect(logger.info).toHaveBeenCalledWith('Graph exported as SVG');
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('handles invalid chart for PNG export', async () => {
    await expect(exportToPNG(null)).rejects.toThrow('Cannot export to PNG');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('PNG export failed'));
  });

  it('handles invalid chart for SVG export', async () => {
    await expect(exportToSVG(null)).rejects.toThrow('Cannot export to SVG');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('SVG export failed'));
  });
});

GraphExportService.test.propTypes = {};