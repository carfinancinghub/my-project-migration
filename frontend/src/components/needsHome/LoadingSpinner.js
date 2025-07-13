// File: LoadingSpinner.js
// Path: frontend/src/components/common/LoadingSpinner.js
// 👑 Cod1 Crown Certified — Accessible Spinner with Theme & Size Options

import React from 'react';

const LoadingSpinner = ({ size = 'md', label = 'Loading...' }) => {
  const sizeClass = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  }[size] || 'h-10 w-10 border-4';

  return (
    <div
      className="flex items-center justify-center min-h-32"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={`animate-spin rounded-full border-t-4 border-blue-500 ${sizeClass}`}
      ></div>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
