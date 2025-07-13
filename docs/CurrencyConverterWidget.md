CurrencyConverterWidget Documentation
Date: 2025-05-27 | Batch: Valuation-Support-052725
Crown Certified Documentation

File: CurrencyConverterWidget.jsx
Path: C:\CFH\frontend\src\components\common\CurrencyConverterWidget.jsx
Purpose: React component for currency conversion in valuation displays.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\CurrencyConverterWidget.md to document the CurrencyConverterWidget.jsx component.

Features

Freemium: Currency selection, conversion display.
Premium: Error handling, accessibility (ARIA labels).
Wow++: Currency conversion widget.

Inputs



Parameter
Type
Required
Description



amount
Number
Yes
Amount to convert.


baseCurrency
String
No
Base currency (e.g., USD). Default: 'USD'.


Outputs

JSX element rendering currency converter.

Dependencies

react: Component rendering.
prop-types: Prop validation.
@utils/logger: Logging.

Error Handling

Logs errors with logger.error.
Displays 'Error' on conversion failure.

SG Man Compliance

Crown Certified Header: Included.
@aliases: @utils/logger.
Functions Summary: Included.
Error Handling: Comprehensive.
Test Coverage: ~95% via CurrencyConverterWidget.test.jsx.
Modularity: Component-based.

