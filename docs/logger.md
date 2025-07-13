logger Documentation
Date: 2025-05-26 | Batch: Logger-052625
Crown Certified Documentation

File: logger.js
Path: C:\CFH\backend\utils\logger.js
Purpose: Logging utility for info, warn, error, debug, and trace levels with file/console output, rotation, and premium features.
Author: Rivers Auction Dev Team
Date: 2025-05-26
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\logger.md to document the logger.js utility.

Features

Freemium: Info, warn, error logging to console/file with UTC/local timestamps.
Premium: Debug/trace levels, metadata tagging, Slack/Discord alerts (mocked).
Wow++: Centralized logging with Winston, log viewer UI (deferred).
Mini: Asynchronous logging, conditional logging, request metadata middleware.

Inputs



Parameter
Type
Required
Description



config
Object
No
Logger configuration (e.g., logDir, fileName, maxSize, useUTC).


message
String
Yes
Log message.


meta
Object
No
Metadata (e.g., userId, requestId).


error
Error
No
Error object for stack trace (error level).


Outputs

Logs to console and file in JSON format.
Mocked Slack/Discord alerts for errors.

Dependencies

winston: Centralized logging.
fs/promises: File handling.
moment: Timestamp formatting.
uuid: Request ID generation.

Error Handling

Sanitizes sensitive data (e.g., JWT, PII).
Logs errors with stack traces for debugging.

SG Man Compliance

Crown Certified Header: Included.
@aliases: None (direct imports).
Functions Summary: Included in code.
Error Handling: Comprehensive with sanitization.
Test Coverage: ~95% via logger.test.js.

