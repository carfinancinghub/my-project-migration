// File: validateInput.test.js
// Path: C:\CFH\backend\tests\utils\validateInput.test.js
// Purpose: Unit tests for validateInput.js, covering validation, sanitization, and reporting
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\backend\tests\utils\validateInput.test.js to test the validateInput.js utility.

import { validateInput, validateBulk, sanitizeInput, validateAsync, getValidationReport } from '@utils/validateInput';
import logger from '@utils/logger';

jest.mock('@utils/logger');

describe('validateInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const schema = [
    { field: 'name', type: 'string', required: true },
    { field: 'email', type: 'email', required: true },
    { field: 'age', type: 'number', required: false },
  ];

  it('validates input successfully', async () => {
    const input = { name: 'John', email: 'john@example.com', age: 30 };
    await expect(validateInput(input, schema)).resolves.toBeUndefined();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Validation successful'));
  });

  it('throws error for invalid input', async () => {
    const input = { name: 'John', email: 'invalid' };
    await expect(validateInput(input, schema)).rejects.toThrow('email must be a valid email');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation failed'));
  });

  it('validates bulk inputs', async () => {
    const inputs = [
      { name: 'John', email: 'john@example.com' },
      { name: 'Jane', email: 'invalid' },
    ];
    const results = await validateBulk(inputs, schema);
    expect(results[0].valid).toBe(true);
    expect(results[1].valid).toBe(false);
    expect(logger.info).toHaveBeenCalledWith('Bulk validation completed: 2 inputs');
  });

  it('sanitizes input to remove HTML', () => {
    const input = { text: '<script>alert("xss")</script>', safe: 'data' };
    const sanitized = sanitizeInput(input);
    expect(sanitized.text).toBe('alert("xss")');
    expect(sanitized.safe).toBe('data');
  });

  it('performs async validation', async () => {
    const checkExists = jest.fn().mockResolvedValue(false);
    const input = { value: 'unique' };
    await expect(validateAsync(input, checkExists)).resolves.toBeUndefined();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Async validation successful'));
  });

  it('generates validation report', async () => {
    const report = await getValidationReport();
    expect(report.totalValidations).toBe(1000);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Validation report generated'));
  });
});

validateInput.test.propTypes = {};