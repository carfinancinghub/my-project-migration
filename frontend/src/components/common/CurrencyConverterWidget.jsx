/**
 * © 2025 CFH, All Rights Reserved.
 * Purpose: Convert point values to selected currency with multi-language support, error handling, and logging.
 * Author: CFH Dev Team
 * Date: 061825 [1950]
 * Artifact ID: 1196bae5-1e63-423b-9084-adb657d7b0ae
 * Save Location: C:\CFH\frontend\src\components\common\CurrencyConverterWidget.jsx
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import logger from '@utils/logger';
import '@styles/CurrencyConverterWidget.css';

/*
## Functions Summary
| Function                 | Purpose                             | Inputs                                 | Outputs         | Dependencies                                    |
|--------------------------|-------------------------------------|----------------------------------------|-----------------|-------------------------------------------------|
| CurrencyConverterWidget  | Renders currency converter          | props: Object                          | JSX Element     | react, prop-types, react-i18next, @utils/logger |
| convertCurrency          | Converts amount to target currency  | amount: Number, targetCurrency: String | Promise<Number> | @utils/logger                                   |
*//**
 * © 2025 CFH, All Rights Reserved.
 * Purpose: Convert point values to selected currency with multi-language support, error handling, and logging.
 * Author: CFH Dev Team
 * Date: 061825 [1950]
 * Save Location: C:\CFH\frontend\src\components\common\CurrencyConverterWidget.jsx
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import logger from '@utils/logger';
import '@styles/CurrencyConverterWidget.css';

/*
## Functions Summary
| Function                 | Purpose                            | Inputs                       				| Outputs          | Dependencies                                  |
|--------------------------|------------------------------------|-------------------------------------------|------------------|-----------------------------------------------|
| CurrencyConverterWidget  | Renders currency converter         | props: Object                             | JSX Element      | react, prop-types, react-i18next, @utils/logger |
| convertCurrency          | Converts amount to target currency | mount: Number, targetCurrency: String  | Promise<Number>  | @utils/logger                                 |
*//**
 * Â© 2025 CFH, All Rights Reserved.
 * Purpose: Convert point values to selected currency with multi-language support, error handling, and logging.
 * Author: CFH Dev Team
 * Date: 061825 [1950]
 * Save Location: C:\CFH\frontend\src\components\common\CurrencyConverterWidget.jsx
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import logger from '@utils/logger';

const CurrencyConverterWidget = ({ amount, baseCurrency = 'USD' }) => {
  const { t } = useTranslation();
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);

  const convertCurrency = async (amt, targetCurr) => {
    try {
      if (typeof amt !== 'number' || isNaN(amt)) throw new Error('Invalid amount');
      const rates = { USD: 1, EUR: 0.85, GBP: 0.73 };
      if (!rates[targetCurr]) throw new Error(`Unsupported currency: ${targetCurr}`);
      const converted = amt * (rates[targetCurr] / rates[baseCurrency]);
      logger.info(`Converted ${amt} ${baseCurrency} to ${converted} ${targetCurr}`);
      return converted;
    } catch (err) {
      logger.error(`Currency conversion failed: ${err.message}`);
      throw new Error(`Conversion error: ${err.message}`);
    }
  };

  const handleConvert = async () => {
    try {
      const result = await convertCurrency(amount, targetCurrency);
      setConvertedAmount(result.toFixed(2));
    } catch (err) {
      setConvertedAmount(t('currencyConverter.error'));
    }
  };

  return (
    <div role="region" aria-label={t('currencyConverter.title')}>
      <label htmlFor="currency-select">{t('currencyConverter.selectLabel')}</label>
      <select
        id="currency-select"
        value={targetCurrency}
        onChange={(e) => setTargetCurrency(e.target.value)}
        aria-label={t('currencyConverter.selectAria')}
      >
        <option value="USD">{t('currencyConverter.usd')}</option>
        <option value="EUR">{t('currencyConverter.eur')}</option>
        <option value="GBP">{t('currencyConverter.gbp')}</option>
      </select>
      <button onClick={handleConvert} aria-label={t('currencyConverter.convert')}>
        {t('currencyConverter.convert')}
      </button>
      {convertedAmount && (
        <span aria-live="polite">
          {convertedAmount} {targetCurrency}
        </span>
      )}
    </div>
  );
};

CurrencyConverterWidget.propTypes = {
  amount: PropTypes.number.isRequired,
  baseCurrency: PropTypes.string,
};

export default CurrencyConverterWidget;

