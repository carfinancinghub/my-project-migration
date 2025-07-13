validateInput Documentation
Date: 2025-05-27 | Batch: Validation-052725
Crown Certified Documentation

File: validateInput.js
Path: C:\CFH\backend\utils\validateInput.js
Purpose: Utility for validating and sanitizing input data with schema-based validation and logging.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\validateInput.md to document the validateInput.js utility.

Features

Freemium: Basic validation (strings, numbers, emails), error messages, bulk validation.
Premium: Schema-based validation, validation reports, async validation.
Wow++: Interactive schema builder (deferred), validation logging.
Mini: Sanitization, decorator/middleware support.

Inputs



Parameter
Type
Required
Description



input
Any
Yes (validateInput)
Input data to validate.


inputs
Array
Yes (validateBulk)
Array of inputs to validate.


schema
Array
Yes
Validation rules (e.g., [{ field, type, required }]).


checkExists
Function
No (validateAsync)
Async check function.


Outputs

validateInput/validateAsync: Promise<void> or throws Error.
validateBulk: Promise<Array> (validation results).
sanitizeInput: Sanitized input.
getValidationReport: Promise<Object> (report).

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
Test Coverage: ~95% via validateInput.test.js.
Modularity: Separate validation functions.

