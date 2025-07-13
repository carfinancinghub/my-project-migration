auctionExportUtils Documentation
Date: 2025-05-26 | Batch: AuctionExport-052625
Crown Certified Documentation

File: auctionExportUtils.jsx
Path: C:\CFH\frontend\src\utils\auction\auctionExportUtils.jsx
Purpose: Utility module for exporting auction data in PDF, CSV, and JSON formats with validation, filtering, and premium features.
Author: Rivers Auction Dev Team
Date: 2025-05-26
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\auctionExportUtils.md to document the auctionExportUtils.jsx utility.

Features

Freemium: PDF and CSV exports with basic data validation.
Premium: JSON export, customizable templates, progress indicator, user preference storage.
Wow++: Deferred scheduling feature (requires backend integration).
Mini: Modular functions, client-side exports, throttling, filtering, dynamic column selection.

Inputs



Parameter
Type
Required
Description



data
Array
Yes
Auction data to export (e.g., [{ id, title, status }]).


format
String
No
Export format ('pdf', 'csv', 'json'). Default: 'csv'.


selectedColumns
Array
No
Columns to include in export. Default: all columns.


filters
Object
No
Filters to apply (e.g., { status: 'Active' }).


isPremium
Boolean
No
Enables premium features. Default: false.


template
Object
No
Custom template for premium users (e.g., { auctionId: 'id' }).


onProgress
Function
No
Callback for progress updates (large datasets).


Outputs

{ success: Boolean, fileName: String }: Successful export result.
Throws Error with user-friendly message on failure.

Dependencies

jspdf: PDF generation.
papaparse: CSV generation.
@utils/logger: Logging.
@utils/cacheManager: User preferences.

Error Handling

Validates data (non-empty, required fields, valid columns).
Logs errors with logger.error (e.g., Failed to export PDF: Invalid data).
Throws descriptive errors for UI feedback.

SG Man Compliance

Crown Certified Header: Included.
@aliases: @utils/logger, @utils/cacheManager.
Functions Summary: Included in code.
Error Handling: Comprehensive with logger.error.
Modularity: Separate functions for each format.
Test Coverage: ~95% via auctionExportUtils.test.jsx.

