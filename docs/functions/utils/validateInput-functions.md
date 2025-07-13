validateInput Functions Documentation
Date: 2025-05-27 | Batch: Validation-052725
Crown Certified Documentation

File: validateInput-functions.md
Path: C:\CFH\docs\functions\utils\validateInput-functions.md
Purpose: Detailed documentation of validateInput.js functions.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\functions\utils\validateInput-functions.md to document the functions of validateInput.js.

Functions



Function
Purpose
Inputs
Outputs
Dependencies



validateInput
Validates single input
input: Any, schema: Array
Promise<void> or throws Error
@utils/logger


validateBulk
Validates array of inputs
inputs: Array, schema: Array
Promise<Array> or throws Error
@utils/logger


sanitizeInput
Sanitizes input data
input: Any
Sanitized input
None


validateAsync
Performs async validation
input: Any, checkExists: Function
Promise<void> or throws Error
@utils/logger


getValidationReport
Generates validation report
None
Promise<Object>
@utils/logger


Error Handling

Logs errors with logger.error.
Throws descriptive errors.

SG Man Compliance

Crown Certified Header: Included.
Test Coverage: Validated via validateInput.test.js.

