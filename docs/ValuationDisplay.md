ValuationDisplay Documentation
Date: 2025-05-27 | Batch: Valuation-052725
Crown Certified Documentation

File: ValuationDisplay.jsx
Path: C:\CFH\frontend\src\components\common\ValuationDisplay.jsx
Purpose: React component for displaying valuation data with animations and interactive features.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\ValuationDisplay.md to document the ValuationDisplay.jsx component.

Features

Freemium: Valuation display, formatting, change animations.
Premium: ARIA labels, customizable formatting, tooltips, theming.
Wow++: Comparison feature (deferred), currency conversion (deferred), grade badge.
Mini: None.

Inputs



Parameter
Type
Required
Description



value
Number
Yes
Valuation amount.


type
String
No
Valuation type (e.g., vehicle). Default: 'vehicle'.


currency
String
No
Currency code (e.g., USD). Default: 'USD'.


hideDecimals
Boolean
No
Hide decimal places. Default: false.


abbreviate
Boolean
No
Abbreviate large numbers. Default: false.


theme
String
No
Theme ('light', 'dark'). Default: 'light'.


Outputs

JSX element rendering valuation data.

Dependencies

react: Component rendering.
prop-types: Prop validation.
@utils/logger: Logging.
framer-motion: Animations.

Error Handling

Logs errors with logger.error.
Displays fallback values (e.g., 'N/A').

SG Man Compliance

Crown Certified Header: Included.
@aliases: @utils/logger.
Functions Summary: Included.
Error Handling: Comprehensive.
Test Coverage: ~95% via ValuationDisplay.test.jsx.
Modularity: Component-based.

