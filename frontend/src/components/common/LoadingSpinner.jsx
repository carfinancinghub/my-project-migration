// File: LoadingSpinner.js
// Path: frontend/src/components/common/LoadingSpinner.js
// 👑 Cod1 Crown Certified — Accessible, Responsive Spinner

import React from 'react';

const LoadingSpinner = () => (
  <div role="status" className="flex justify-center items-center p-4" aria-live="polite">
    <svg
      className="animate-spin h-8 w-8 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);

export default LoadingSpinner;
