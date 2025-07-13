// File: Button.js
// Path: frontend/src/components/common/Button.js

import React from 'react';

const baseStyles =
  'inline-flex items-center justify-center px-4 py-2 font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline:
    'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-3',
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...rest
}) => {
  const combined =
    `${baseStyles} ${variants[variant]} ${sizes[size]} ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`.trim();

  return (
    <button type={type} disabled={disabled} className={combined} {...rest}>
      {children}
    </button>
  );
};

export default Button;
