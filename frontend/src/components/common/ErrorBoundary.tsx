/**
 * © 2025 CFH, All Rights Reserved.
 * Purpose: Capture and handle JavaScript errors in the React component tree, providing a fallback UI and logging errors.
 * Author: CFH Dev Team
 * Date: 061825 [1943]
 * Save Location: C:\CFH\frontend\src\components\common\ErrorBoundary.tsx
 */
import React, { Component, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import logger from '@utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught an error', { error, errorInfo });
  }

  render() {
    const { t } = useTranslation(); // Hook must be used in functional component or custom hook
    const FallbackUI = () => (
      <div role="alert" aria-label={t('errorBoundary.message')}>
        <h2>{t('errorBoundary.title')}</h2>
        <p>{t('errorBoundary.message')}</p>
        <button onClick={() => window.location.reload()} aria-label={t('errorBoundary.reload')}>
          {t('errorBoundary.reload')}
        </button>
      </div>
    );

    return this.state.hasError ? <FallbackUI /> : this.props.children;
  }
}

export default ErrorBoundary;