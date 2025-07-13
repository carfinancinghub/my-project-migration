# Logger Functions Documentation

## Overview
The logger.js utility provides logging functionality for the Rivers Auction Platform backend, enabling consistent logging across services.

## Functions

- **logInfo(message)**: Logs an informational message.
  - **Parameters**: message (string) - The message to log.
  - **Returns**: None
  - **Edge Cases**:
    - If message is empty or null, logs a default message: 'Info: No message provided'.
    - If message exceeds 10,000 characters, truncates to 10,000 characters with a note: '... [truncated]'.

- **logWarn(message)**: Logs a warning message.
  - **Parameters**: message (string) - The warning message to log.
  - **Returns**: None
  - **Edge Cases**:
    - If message is empty or null, logs: 'Warn: No message provided'.
    - If message exceeds 10,000 characters, truncates with a note.

- **logError(error)**: Logs an error message with stack trace.
  - **Parameters**: error (Error) - The error object to log.
  - **Returns**: None
  - **Edge Cases**:
    - If error is null or not an Error object, logs: 'Error: Invalid error object'.
    - If stack trace exceeds 20,000 characters, truncates with a note.

- **logDebug(message)**: Logs a debug message (only in development mode).
  - **Parameters**: message (string) - The debug message to log.
  - **Returns**: None
  - **Edge Cases**:
    - If not in development mode (process.env.NODE_ENV !== 'development'), the message is not logged.
    - If message is empty or null, logs: 'Debug: No message provided'.

## Usage Example
\\\javascript
const logger = require('@utils/logger'); // Using SG Man @alias standard
logger.logInfo('Server started successfully');
logger.logWarn('Potential issue with database connection');
logger.logError(new Error('Database connection failed'));
logger.logDebug('Debugging session ID: 12345');
\\\

## Version History
v1.0.0 (2025-05-26): Initial implementation with logInfo, logWarn, logError, logDebug.  
v1.0.1 (2025-05-27): Added edge case handling for empty/null inputs and truncation limits.

## Save Location
File: logger-functions.md  
Path: C:\CFH\docs\functions\utils\logger-functions.md
