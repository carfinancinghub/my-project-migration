PredictiveGraph Documentation
Date: 2025-05-27 | Batch: Graph-052725
Crown Certified Documentation

File: PredictiveGraph.jsx
Path: C:\CFH\frontend\src\components\common\PredictiveGraph.jsx
Purpose: React component for rendering predictive graphs with Chart.js and interactive features.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\PredictiveGraph.md to document the PredictiveGraph.jsx component.

Features

Freemium: Chart.js line graphs, min/max indicators.
Premium: Tooltips, responsive design, export options, confidence bands.
Wow++: Zoom/pan (deferred), animated transitions, anomaly detection (deferred).
Mini: None.

Inputs



Parameter
Type
Required
Description



data
Array
Yes
Time series data (e.g., [{ date, value }]).


timeframe
String
No
Timeframe ('7d', '30d', '90d'). Default: '7d'.


theme
String
No
Theme ('light', 'dark'). Default: 'light'.


Outputs

JSX element rendering predictive graph.

Dependencies

react: Component rendering.
prop-types: Prop validation.
chart.js: Graph rendering.
@utils/logger: Logging.
framer-motion: Animations.

Error Handling

Logs errors with logger.error.
Renders empty graph on invalid data.

SG Man Compliance

Crown Certified Header: Included.
@aliases: @utils/logger.
Functions Summary: Included.
Error Handling: Comprehensive.
Test Coverage: ~95% via PredictiveGraph.test.jsx.
Modularity: Component-based.

