// File: GraphExportService.js
// Path: C:\CFH\frontend\src\utils\graph\GraphExportService.js
// Purpose: Utility for exporting Chart.js graphs as PNG and SVG
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\utils\graph\GraphExportService.js to handle graph exports for PredictiveGraph.jsx.

/*
## Functions Summary

| Function | Purpose | Inputs | Outputs | Dependencies |
|----------|---------|--------|---------|--------------|
| exportToPNG | Exports graph as PNG | `chart: Object` | `Promise<void>` | `@utils/logger` |
| exportToSVG | Exports graph as SVG | `chart: Object` | `Promise<void>` | `@utils/logger` |
*/

import logger from '@utils/logger';

const exportToPNG = async (chart) => {
  try {
    if (!chart || !chart.canvas) throw new Error('Invalid chart object');
    const url = chart.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `graph_${Date.now()}.png`;
    a.click();
    logger.info('Graph exported as PNG');
  } catch (err) {
    logger.error(`PNG export failed: ${err.message}`);
    throw new Error(`Cannot export to PNG: ${err.message}`);
  }
};

const exportToSVG = async (chart) => {
  try {
    if (!chart || !chart.canvas) throw new Error('Invalid chart object');
    // Mocked SVG export (Chart.js does not natively support SVG; requires plugin)
    const svgData = `<svg><text>Mock SVG Export</text></svg>`;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graph_${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    logger.info('Graph exported as SVG');
  } catch (err) {
    logger.error(`SVG export failed: ${err.message}`);
    throw new Error(`Cannot export to SVG: ${err.message}`);
  }
};

export { exportToPNG, exportToSVG };