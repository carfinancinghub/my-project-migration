// File: ValuationDisplay.jsx
// Path: C:\CFH\frontend\src\components\common\ValuationDisplay.jsx
// Purpose: React component for displaying valuation data with animations and interactive features
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\components\common\ValuationDisplay.jsx to display valuation data in dashboards.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { motion } from 'framer-motion';
import './ValuationDisplay.css';

/*
## Functions Summary

| Function | Purpose | Inputs | Outputs | Dependencies |
|----------|---------|--------|---------|--------------|
| ValuationDisplay | Renders valuation display | `props: Object` | JSX Element | `react`, `prop-types`, `@utils/logger`, `framer-motion` |
| formatValue | Formats valuation value | `value: Number`, `hideDecimals: Boolean`, `abbreviate: Boolean` | `String` | None |
| getCurrencySymbol | Gets currency symbol | `currency: String` | `String` | None |
*/

const ValuationDisplay = ({ value, type = 'vehicle', currency = 'USD', hideDecimals = false, abbreviate = false, theme = 'light' }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const formatValue = (val, hideDec, abbr) => {
    try {
      let formatted = val.toLocaleString('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: hideDec ? 0 : 2,
      });
      if (abbr && val >= 1000) {
        const units = ['K', 'M', 'B'];
        const unit = Math.floor((val.toString().length - 1) / 3);
        formatted = `${(val / Math.pow(1000, unit)).toFixed(1)}${units[unit - 1]}`;
      }
      return formatted;
    } catch (err) {
      logger.error(`Value formatting failed: ${err.message}`);
      return 'N/A';
    }
  };

  const getCurrencySymbol = (curr) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(0).replace(/[0-9,.]/g, '');
    } catch (err) {
      logger.error(`Currency symbol retrieval failed: ${err.message}`);
      return '$';
    }
  };

  const change = value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';
  const animationProps = {
    initial: { y: change === 'up' ? 10 : change === 'down' ? -10 : 0, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <div className={`valuation-display ${theme}`} role="region" aria-label={`Valuation for ${type}`}>
      <motion.div {...animationProps} className="valuation-value">
        <span>{getCurrencySymbol(currency)}</span>
        <span>{formatValue(Math.abs(value), hideDecimals, abbreviate)}</span>
        <span className={`change-indicator ${change}`}>
          {change === 'up' ? '↑' : change === 'down' ? '↓' : ''}
        </span>
      </motion.div>
      <div
        className="tooltip"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        aria-hidden={!isTooltipVisible}
      >
        {isTooltipVisible && (
          <div className="tooltip-content">
            Valuation based on AI estimation for {type}. Source: Rivers Auction ML Model.
          </div>
        )}
      </div>
      <div className="valuation-type">{type}</div>
    </div>
  );
};

ValuationDisplay.propTypes = {
  value: PropTypes.number.isRequired,
  type: PropTypes.string,
  currency: PropTypes.string,
  hideDecimals: PropTypes.bool,
  abbreviate: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark']),
};

export default ValuationDisplay;