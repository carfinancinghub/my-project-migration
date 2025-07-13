// File: PredictiveGraph.jsx
// Path: C:\CFH\frontend\src\components\common\PredictiveGraph.jsx
// Purpose: React component for rendering predictive graphs with Chart.js and interactive features
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\components\common\PredictiveGraph.jsx to render predictive graphs in dashboards.

import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js/auto';
import logger from '@utils/logger';
import { motion } from 'framer-motion';
import './PredictiveGraph.css';

/*
## Functions Summary

| Function | Purpose | Inputs | Outputs | Dependencies |
|----------|---------|--------|---------|--------------|
| PredictiveGraph | Renders predictive graph | `props: Object` | JSX Element | `react`, `prop-types`, `chart.js`, `@utils/logger`, `framer-motion` |
| formatData | Formats graph data | `data: Array` | `Object` | None |
| exportGraph | Exports graph as PNG | `chartRef: Object` | `Promise<void>` | `chart.js`, `@utils/logger` |
*/

const PredictiveGraph = ({ data, timeframe = '7d', theme = 'light' }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const formatData = (rawData) => {
    try {
      return {
        labels: rawData.map(item => item.date),
        datasets: [
          {
            label: 'Predictions',
            data: rawData.map(item => item.value),
            borderColor: theme === 'light' ? '#007bff' : '#4da8ff',
            backgroundColor: theme === 'light' ? 'rgba(0, 123, 255, 0.1)' : 'rgba(77, 168, 255, 0.1)',
          },
          {
            label: 'Confidence Band',
            data: rawData.map(item => item.value * 1.1),
            fill: '-1',
            backgroundColor: 'rgba(0, 123, 255, 0.05)',
            borderWidth: 0,
          },
          {
            label: 'Confidence Band',
            data: rawData.map(item => item.value * 0.9),
            fill: '+1',
            backgroundColor: 'rgba(0, 123, 255, 0.05)',
            borderWidth: 0,
          },
        ],
      };
    } catch (err) {
      logger.error(`Data formatting failed: ${err.message}`);
      return { labels: [], datasets: [] };
    }
  };

  const exportGraph = async () => {
    try {
      if (!chartRef.current) throw new Error('Chart not initialized');
      const url = chartRef.current.toBase64Image();
      const a = document.createElement('a');
      a.href = url;
      a.download = `graph_${Date.now()}.png`;
      a.click();
      logger.info('Graph exported as PNG');
    } catch (err) {
      logger.error(`Graph export failed: ${err.message}`);
      throw new Error(`Cannot export graph: ${err.message}`);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: 'line',
      data: formatData(data),
      options: {
        responsive: true,
        plugins: {
          tooltip: { enabled: true },
        },
        scales: {
          x: { display: true },
          y: { display: true },
        },
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
      },
    });

    chartRef.current = chart;

    return () => chart.destroy();
  }, [data, theme]);

  return (
    <motion.div
      className={`predictive-graph ${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-label="Predictive graph"
    >
      <canvas ref={canvasRef} />
      <button onClick={exportGraph}>Export as PNG</button>
    </motion.div>
  );
};

PredictiveGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  timeframe: PropTypes.oneOf(['7d', '30d', '90d']),
  theme: PropTypes.oneOf(['light', 'dark']),
};

export default PredictiveGraph;