CurrencyConverterWidget Functions Documentation
Date: 2025-05-27 | Batch: Valuation-Support-052725
Crown Certified Documentation

File: CurrencyConverterWidget-functions.md
Path: C:\CFH\docs\functions\components\CurrencyConverterWidget-functions.md
Purpose: Detailed documentation of CurrencyConverterWidget.jsx functions.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\functions\components\CurrencyConverterWidget-functions.md to document the functionality of CurrencyConverterWidget.jsx.

Functions



Function
Purpose
Inputs
Outputs
Dependencies



CurrencyConverterWidget
Renders currency converter
props: Object
JSX Element
react, prop-types, @utils/logger


convertCurrency
Converts amount to target currency
amount: Number, targetCurrency: String
Promise<Number>
@utils/logger


Error Handling

Logs errors with logger.error.
Displays fallback on failure.

SG Man Compliance

Crown Certified Header: Included.
Test Coverage: Validated via CurrencyConverterWidget.test.jsx.

