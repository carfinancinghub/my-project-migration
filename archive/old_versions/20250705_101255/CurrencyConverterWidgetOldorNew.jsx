/**
 * © 2025 CFH, All Rights Reserved.
 * Purpose: Convert point values to currency based on user-selected currency, supporting multi-language display.
 * Author: CFH Dev Team
 * Date: 061825 [1950]
 * Save Location: C:\CFH\frontend\src\components\common\CurrencyConverterWidget.jsx
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const CurrencyConverterWidget = ({ value }) => {
  const { t } = useTranslation();
  const [currency, setCurrency] = useState('USD');
  const exchangeRates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
  };

  const convertValue = () => {
    const rate = exchangeRates[currency] || 1.0;
    return (value * rate).toFixed(2);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <div role="region" aria-label={t('currencyConverter.title')}>
      <label htmlFor="currency-select">{t('currencyConverter.selectLabel')}</label>
      <select
        id="currency-select"
        value={currency}
        onChange={handleCurrencyChange}
        aria-label={t('currencyConverter.selectAria')}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>
      <p>
        {t('currencyConverter.result', {
          value: convertValue(),
          currency,
        })}
      </p>
    </div>
  );
};

CurrencyConverterWidget.propTypes = {
  value: PropTypes.number.isRequired,
};

export default CurrencyConverterWidget;