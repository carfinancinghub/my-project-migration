ValuationDisplay Functions Documentation
Date: 2025-05-27 | Batch: Valuation-052725
Crown Certified Documentation

File: ValuationDisplay-functions.md
Path: C:\CFH\docs\functions\components\ValuationDisplay-functions.md
Purpose: Detailed documentation of ValuationDisplay.jsx functions.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\functions\components\ValuationDisplay-functions.md to document the functionality of ValuationDisplay.jsx.

Functions



Function
Purpose
Inputs
Outputs
Dependencies



ValuationDisplay
Renders valuation display
props: Object
JSX Element
react, prop-types, @utils/logger, framer-motion


formatValue
Formats valuation value
value: Number, hideDecimals: Boolean, abbreviate: Boolean
String
None


getCurrencySymbol
Gets currency symbol
currency: String
String
None


Error Handling

Logs errors with logger.error.
Returns fallback values.

SG Man Compliance

Crown Certified Header: Included.
Test Coverage: Validated via ValuationDisplay.test.jsx.

