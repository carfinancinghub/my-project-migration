GraphExportService Functions Documentation
Date: 2025-05-27 | Batch: Graph-Support-052725
Crown Certified Documentation

File: GraphExportService-functions.md
Path: C:\CFH\docs\functions\utils\GraphExportService-functions.md
Purpose: Detailed documentation of GraphExportService.js functions.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\functions\utils\GraphExportService-functions.md to document the functions of GraphExportService.js.

Functions



Function
Purpose
Inputs
Outputs
Dependencies



exportToPNG
Exports graph as PNG
chart: Object
Promise<void>
@utils/logger


exportToSVG
Exports graph as SVG
chart: Object
Promise<void>
@utils/logger


Error Handling

Logs errors with logger.error.
Throws descriptive errors.

SG Man Compliance

Crown Certified Header: Included.
Test Coverage: Validated via GraphExportService.test.js.

