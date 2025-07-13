// File: ErrorBoundary.js
// Path: frontend/src/components/common/ErrorBoundary.js

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('⛔ ErrorBoundary caught:', error, errorInfo);
    // Optional: log to server or analytics platform
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-600 bg-red-100 border border-red-300 rounded">
          <h2 className="text-lg font-semibold mb-2">🚨 Something went wrong</h2>
          <p>{this.state.error?.toString()}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
