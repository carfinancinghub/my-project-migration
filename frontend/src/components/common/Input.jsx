// File: Input.js
// Path: frontend/src/components/common/Input.js

import React from 'react';
import { theme } from '../../styles/theme';

const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  ...rest
}) => {
  return (
    <div className="mb-4" role="group" aria-labelledby={`${id}-label`}>
      {label && (
        <label
          htmlFor={id}
          id={`${id}-label`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : ''
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className={`${theme.errorText} text-xs mt-1`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
