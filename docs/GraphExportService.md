GraphExportService Documentation
Date: 2025-05-27 | Batch: Graph-Support-052725
Crown Certified Documentation

File: GraphExportService.js
Path: C:\CFH\frontend\src\utils\graph\GraphExportService.js
Purpose: Utility for exporting Chart.js graphs as PNG and SVG.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\GraphExportService.md to document the GraphExportService.js utility.

Features

Freemium: PNG export.
Premium: SVG export (mocked).
Wow++: Graph export functionality for PredictiveGraph.jsx.

Inputs



Parameter
Type
Required
Description



chart
Object
Yes
Chart.js instance with canvas.


Outputs

exportToPNG/exportToSVG: Promise<void> or throws Error.

Dependencies

@utils/logger: Logging.

Error Handling

Logs errors with logger.error.
Throws descriptive errors.

SG Man Compliance

Crown Certified Header: Included.
@aliases: @utils/logger.
Functions Summary: Included.
Error Handling: Comprehensive.
Test Coverage: ~95% via GraphExportService.test.js.
Modularity: Separate export functions.

